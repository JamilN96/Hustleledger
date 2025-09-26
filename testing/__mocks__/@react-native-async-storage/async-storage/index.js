const storage = new Map();

export async function getItem(key) {
  return storage.has(key) ? storage.get(key) : null;
}

export async function setItem(key, value) {
  storage.set(key, String(value));
}

export async function removeItem(key) {
  storage.delete(key);
}

export async function clear() {
  storage.clear();
}

export default {
  getItem,
  setItem,
  removeItem,
  clear,
};
