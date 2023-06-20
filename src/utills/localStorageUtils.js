export function getItem(key) {
   const item = localStorage.getItem(key);
   return JSON.parse(item);
}

export function setItem(key, value) {
   const item = JSON.stringify(value);
   localStorage.setItem(key, item);
}

export function removeItem(key) {
   localStorage.removeItem(key);
}
