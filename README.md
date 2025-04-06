# Titanium Indexly

**A lightweight, modular, and powerful abstraction layer for IndexedDB, made for developers who want a modern and simplified API.**

[![npm version](https://img.shields.io/npm/v/titanium-indexly)](https://www.npmjs.com/package/titanium-indexly)
[![GitHub issues](https://img.shields.io/github/issues/titanium-projects/titanium-indexly)](https://github.com/titanium-projects/titanium-indexly/issues)
[![GitHub stars](https://img.shields.io/github/stars/titanium-projects/titanium-indexly)](https://github.com/titanium-projects/titanium-indexly/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

GitHub Repository → [https://github.com/titanium-projects/titanium-indexly](https://github.com/titanium-projects/titanium-indexly)

---

## ✨ Features
- 🚀 Use IndexedDB the modern JavaScript way
- ✅ Simple API: `add`, `put`, `delete`, `get`, `getAll`, `where`
- ⚖️ Filtering, sorting, pagination with `where`
- 🧱 Dynamic store access via Proxy
- ✈️ Lightweight, dependency-free, and ready to use

---

## 📦 Installation

```bash
npm install titanium-indexly
```

---

## 🔍 Basic Usage

### 1. Import the module
```js
import TitaniumIndexly from 'titanium-indexly';
```

### 2. Initialize the database
```js
const db = TitaniumIndexly({
  name: 'myAppDb',
  stores: ['users', 'products']
});
```

### 3. Add data
```js
await db.users.add({ name: 'Kerem', age: 27 });
```

### 4. Query data
```js
const results = await db.products.where(
  (p) => p.model > 2010,
  { limit: 5, sortBy: 'model' }
);
```

---

## 💡 API Reference

### `add(data)`
Adds a new record.

### `put(data)`
Updates a record (requires `id`).

### `delete(id)`
Deletes the record by ID.

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

## 📘 Example
```js
const db = TitaniumIndexly({ name: 'demo', stores: ['tasks'] });

await db.tasks.add({ title: 'Coding class', done: false });
await db.tasks.add({ title: 'Grocery shopping', done: true });

const pendingTasks = await db.tasks.where(
  t => !t.done,
  { sortBy: 'title' }
);
console.log(pendingTasks);
```

---

## ⚙️ Contributing
Pull requests and issues are welcome! Feel free to fork and contribute to improve the project.

---

## 🚫 Dependencies
None. Pure Vanilla JS + IndexedDB API.

---

## 📢 License
MIT

