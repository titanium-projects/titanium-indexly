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
- 🔄 Dynamically add or delete object stores with `dropStores`
- 🧱 Dynamic store access via Proxy
- 📦 UMD and ESM module support via Rollup bundling

---

## 📦 Installation

```bash
npm install titanium-indexly
```

---

## 🔧 Usage

### Import (ESM)
```js
import TitaniumIndexly from 'titanium-indexly';
```

### Or use in browser
```html
<script src="./dist/titanium-indexly.umd.js"></script>
<script>
  const db = window.TitaniumIndexly({ name: 'mydb', stores: ['users'] });
</script>
```

---

## 📚 Basic Example

```js
const db = TitaniumIndexly({
  name: 'myAppDb',
  stores: ['users', 'products'],
  dropStores: ['oldStore']
});
```

---

## 🧪 API Usage with Sample Output

### 🔹 `add(data)`
Add a new record to a store.
```js
const id = await db.users.add({ name: 'Kerem', age: 27 });
console.log(id); // ➜ 1 (auto-generated ID)
```

### 🔹 `put(data)`
Update an existing record.
```js
await db.users.put({ id: 1, name: 'Kerem', age: 28 });
```

### 🔹 `get(id)`
Retrieve a record by ID.
```js
const user = await db.users.get(1);
console.log(user); 
// ➜ { name: 'Kerem', age: 28 }
```

### 🔹 `getAll()`
Fetch all records in a store. Includes their `id`s.
```js
const allUsers = await db.users.getAll();
console.log(allUsers);
/* ➜ [
  { id: 1, name: 'Kerem', age: 28 },
  { id: 2, name: 'Ayşe', age: 25 }
] */
```

### 🔹 `clear()`
Delete all records in the store.
```js
await db.users.clear();
```

### 🔹 `delete(id)`
Delete a single record by ID.
```js
await db.users.delete(1);
```

### 🔹 `where(fn, options)`
Filter records with additional options like sorting and pagination.
```js
const filtered = await db.products.where(
  (item) => item.price > 100,
  { limit: 5, offset: 0, sortBy: 'price' }
);
console.log(filtered);
/* ➜ [
  { id: 3, name: 'Tablet', price: 120 },
  { id: 5, name: 'Monitor', price: 180 }
] */
```

---

## 🔁 Static vs Dynamic Versioning

Titanium Indexly supports two ways to manage IndexedDB versioning:

### Static Versioning (Manual)
```js
TitaniumIndexly({
  name: 'appdb',
  version: 2,
  stores: ['users', 'products']
});
```

### Dynamic Versioning (Auto)
```js
TitaniumIndexly({
  name: 'appdb',
  stores: ['users']
});
```
The library will:
- Check existing stores and version
- Automatically increment version if needed

---

## ➕ Adding or ❌ Removing Stores

### Add a New Store
```js
TitaniumIndexly({
  name: 'appdb',
  stores: ['users', 'orders']
});
```

### Remove a Store
```js
TitaniumIndexly({
  name: 'appdb',
  stores: ['users'],
  dropStores: ['products']
});
```

> ⚠️ For static versioning, you must manually bump the version number to trigger the schema update.

---

## 🛠 Development

To build the project with Rollup:
```bash
npm run build
```

Output will be available in the `dist/` folder.

---

## 🤝 Contributing

We welcome all contributions! Feel free to open issues or submit pull requests to improve Titanium Indexly.

---

## 📁 Project Structure
```
titanium-indexly/
├── src/              # Source code (ES6)
├── dist/             # Compiled outputs (ESM + UMD)
├── demo.html         # Browser demo
├── rollup.config.js  # Rollup build configuration
└── package.json
```

---

## 📢 License

MIT