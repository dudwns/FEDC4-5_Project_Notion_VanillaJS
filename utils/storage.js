const storage = window.localStorage;

export const getItem = (key, defaultValue) => {
  try {
    const storageValue = storage.getItem(key);
    return storageValue ? JSON.parse(storageValue) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

export const setItem = (key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

export const removeItem = (key) => {
  storage.removeItem(key);
};
