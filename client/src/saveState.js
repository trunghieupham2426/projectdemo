export const saveToLocalStorage = (keyLocalStorage, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(keyLocalStorage, serializedState);
  } catch (e) {
    console.log(e);
  }
};

export const loadFromLocalStorage = (keyLocalStorage) => {
  try {
    const serializedState = localStorage.getItem(keyLocalStorage);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.log(e);
    return undefined;
  }
};
