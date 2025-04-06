# Titanium Indexly

**A lightweight, modular, and powerful abstraction layer for IndexedDB, made for developers who want a modern and simplified API.**

[![npm version](https://img.shields.io/npm/v/titanium-indexly)](https://www.npmjs.com/package/titanium-indexly)
[![GitHub issues](https://img.shields.io/github/issues/titanium-projects/titanium-indexly)](https://github.com/titanium-projects/titanium-indexly/issues)
[![GitHub stars](https://img.shields.io/github/stars/titanium-projects/titanium-indexly)](https://github.com/titanium-projects/titanium-indexly/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

GitHub Repository → [https://github.com/titanium-projects/titanium-indexly](https://github.com/titanium-projects/titanium-indexly)

---

## ✨ Features
- 🚀 Modern IndexedDB usage with zero boilerplate
- ✅ Simple API: `add`, `put`, `delete`, `clear`, `get`, `getAll`, `where`
- ⚖️ Filtering, sorting, pagination with `where`
- 🧠 Automatic versioning based on missing object stores
- 🔁 Supports both dynamic and static version handling
- 🔄 Dynamically add new stores during runtime via version auto-increment
- 🔥 Drop (delete) stores during upgrade using `dropStores` option
- 🧱 Dynamic store access via Proxy
- 📦 UMD and ESM module support via Rollup bundling

---

## 📦 Installation

```bash
npm install titanium-indexly
```

---

## 🔧 Usage

### 1. Import the module (ESM)
```js
import TitaniumIndexly from 'titanium-indexly';
```

Or use directly in the browser (UMD):
```html
<script src="./dist/titanium-indexly.umd.js"></script>
<script>
  const db = window.TitaniumIndexly({ name: 'mydb', stores: ['users'] });
</script>
```

---

## 📚 Example

```js
const db = TitaniumIndexly({
  name: 'myAppDb',
  stores: ['users', 'products'],
  dropStores: ['oldStore'] // 🔥 this store will be deleted if it exists
});

await db.users.add({ name: 'Kerem', age: 27 });

const results = await db.products.where(
  (p) => p.model > 2010,
  { limit: 5, sortBy: 'model' }
);
console.log(results);

await db.users.clear(); // ✅ deletes all users in the store
```

---

## 💡 API Reference

### `add(data)`
Adds a new record.

### `put(data)`
Updates a record (requires `id`).

### `delete(id)`
Deletes the record by ID.

### `clear()`
Deletes all records in the store.

### `get(id)`
Fetches a record by ID.

### `getAll()`
Fetches all records.

### `where(predicateFn, options)`
Filters and retrieves records based on a condition.

**Options:**
- `limit`: Max number of results to return
- `offset`: Skip the first N results
- `sortBy`: Field name to sort by

---

## 🔁 Static vs Dynamic Versioning

Titanium Indexly supports two ways to manage IndexedDB versioning:

### 🔧 Static Versioning (Manual)
You provide a fixed version number:
```js
TitaniumIndexly({
  name: 'appdb',
  version: 2,
  stores: ['users', 'products']
});
```
Use this when you want full control over schema updates.

### ⚙️ Dynamic Versioning (Auto)
No `version` field is provided:
```js
TitaniumIndexly({
  name: 'appdb',
  stores: ['users']
});
```
The library automatically:
- Reads existing store list and version
- Detects missing stores
- Increments version only if new stores are needed

---

## 🧠 Dynamically Adding or Removing Stores

### ➕ Adding a New Store
With dynamic versioning:
```js
TitaniumIndexly({
  name: 'appdb',
  stores: ['users', 'orders'] // 'orders' will be added if missing
});
```

### ❌ Removing a Store
Use the `dropStores` option:
```js
TitaniumIndexly({
  name: 'appdb',
  stores: ['users'],
  dropStores: ['products'] // 'products' store will be deleted
});
```

> ⚠️ With static versioning, you must manually increase the version number to trigger the removal.

---

## 🛠 Development

This package uses [Rollup](https://rollupjs.org/) to generate both ESM and UMD builds.

To build:
```bash
npm run build
```
Output goes to the `dist/` folder.

---

## ⚙️ Contributing
Pull requests and issues are welcome! Feel free to fork and contribute to improve the project.

---

## 📁 Project Structure
```
titanium-indexly/
├── src/              # Source code (ES6)
├── dist/             # Compiled outputs (ESM + UMD)
├── demo.html         # Browser demo
├── rollup.config.js  # Bundler config
└── package.json
```

---

## 🚫 Dependencies
None. Pure Vanilla JS + IndexedDB API.

---

## 📢 License
MIT

