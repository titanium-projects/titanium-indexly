const TitaniumIndexly = function ({ name, stores }) {
  const databaseName = name || "localdb";
  const dbSet = Array.isArray(stores) ? stores : [];
  const DBContext = {};
  const DBMode = Object.freeze({
    ReadWrite: "readwrite",
    ReadOnly: "readonly",
  });

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

  const openDB = function (callback) {
    if (instance) {
      callback(instance);
      return;
    }

    const request = indexedDB.open(databaseName, 2);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      dbSet.forEach((key) => {
        if (!db.objectStoreNames.contains(key)) {
          db.createObjectStore(key, { autoIncrement: true });
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
