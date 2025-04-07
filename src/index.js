const TitaniumIndexly = function ({ name, stores, version, dropStores }) {
  const databaseName = name || "localdb";
  const isDynamicVersion = !version;
  const dbSet = Array.isArray(stores) ? stores : [];
  const DBContext = {};
  const DBMode = Object.freeze({
    ReadWrite: "readwrite",
    ReadOnly: "readonly",
  });

  let databaseVersion = version || 1;
  let dbVersionChecked = false;

  const getDBInfo = function () {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName);

      request.onsuccess = (e) => {
        const db = e.target.result;
        const existingStores = Array.from(db.objectStoreNames);
        const version = db.version;
        db.close();
        resolve({ existingStores, version });
      };

      request.onerror = () => reject(request.error);
    });
  };

  const updateDbVersion = async function () {
    const { existingStores, version } = await getDBInfo();
    const missingStores = dbSet.filter((s) => !existingStores.includes(s));

    const shouldUpgrade = missingStores.length > 0;
    databaseVersion = shouldUpgrade ? version + 1 : version;

    if (shouldUpgrade) {
      instance?.close();
      instance = null;
    }
  };

  const ActionTypes = {
    add: {
      mode: DBMode.ReadWrite,
    },
    put: {
      mode: DBMode.ReadWrite,
    },
    delete: {
      mode: DBMode.ReadWrite,
    },
    get: {
      mode: DBMode.ReadOnly,
    },
    getAll: {
      mode: DBMode.ReadOnly,
    },
    clear: {
      mode: DBMode.ReadWrite,
    },
    count: {
      mode: DBMode.ReadOnly,
    },
    where: {
      mode: DBMode.ReadOnly,
      isOptions: true,
      cursor: function ({ event, resolve, predicateFn, results, options }) {
        const cursor = event.target.result;

        if (cursor) {
          const value = cursor.value;

          try {
            if (predicateFn(value)) {
              results.push(value);
            }
          } catch (err) {
            console.warn("Error in filter function:", err);
          }
          cursor.continue();
        } else {
          // Apply sorting, offset, and limit
          let final = results;

          if (options?.sortBy) {
            final = final.sort((a, b) => {
              const va = a[options.sortBy];
              const vb = b[options.sortBy];
              return va < vb ? -1 : va > vb ? 1 : 0;
            });
          }

          if (typeof options?.offset === "number") {
            final = final.slice(options.offset);
          }

          if (typeof options?.limit === "number") {
            final = final.slice(0, options.limit);
          }

          resolve(final);
        }

        return true;
      },
    },
  };

  let instance;
  dbSet.forEach((key) => {
    const actions = Object.entries(ActionTypes).reduce((all, [k, v]) => {
      all[k] = (value, options) =>
        crudOperation({ type: k, obj: value, key, ...v, options });
      return all;
    }, {});

    Object.defineProperty(DBContext, key, {
      get() {
        return Object.freeze(actions);
      },
    });
  });

  const crudOperation = function ({
    type,
    key,
    obj,
    mode = DBMode.ReadWrite,
    cursor,
    isOptions,
    options,
  }) {
    return new Promise((resolve, reject) => {
      openDB(function (db) {
        // Common Process
        const transaction = db.transaction([key], mode);
        const store = transaction.objectStore(key);
        const request = cursor ? store.openCursor() : store[type](obj);
        const results = [];

        request.onsuccess = function (event) {
          if (cursor) {
            cursor({
              resolve,
              reject,
              event,
              predicateFn: obj,
              results,
              options: isOptions && options,
            });
            return;
          }

          resolve(request.result);
        };

        request.onerror = function (event) {
          reject(request.error || event.target.error);
        };
      });
    });
  };

  const openDB = async function (callback) {
    if (isDynamicVersion && !dbVersionChecked) {
      await updateDbVersion();
      dbVersionChecked = true;
    }

    if (instance) {
      callback(instance);
      return;
    }

    const request = indexedDB.open(databaseName, databaseVersion);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      // Delete Stores
      if (Array.isArray(dropStores)) {
        dropStores.forEach((s) => {
          if (db.objectStoreNames.contains(s)) {
            db.deleteObjectStore(s);
          }
        });
      }

      // Add Stores
      dbSet.forEach((key) => {
        if (!db.objectStoreNames.contains(key)) {
          db.createObjectStore(key, { autoIncrement: true, keyPath: "id" });
        }
      });
    };

    request.onsuccess = function (event) {
      instance = event.target.result;

      if (callback) {
        console.log("Database initialized");
        callback(instance);
      }
    };

    request.onblocked = () => {
      console.warn("Database upgrade blocked by another tab.");
    };

    request.onerror = function (event) {
      console.error("Database error:", event.target.error);
    };
  };

  return new Proxy(DBContext, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }
      const returnAction = () =>
        console.log(`No store found with name "${prop}"`);

      const actions = Object.entries(ActionTypes).reduce((all, [k, v]) => {
        all[k] = () => returnAction();
        return all;
      }, {});

      return Object.freeze(actions);
    },
  });
};

export default TitaniumIndexly;
