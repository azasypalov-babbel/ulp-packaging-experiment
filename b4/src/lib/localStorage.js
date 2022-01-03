export const getLocalStorage = (namespace) => {
  const localStorage = window.localStorage;

  const set = (key, value) => {
    localStorage.setItem(`${namespace}/${key}`, JSON.stringify(value));
  };

  const get = (key) => {
    return JSON.parse(localStorage.getItem(`${namespace}/${key}`));
  };

  const remove = (key) => {
    localStorage.removeItem(`${namespace}/${key}`);
  };

  return {
    set,
    get,
    remove
  };
};
