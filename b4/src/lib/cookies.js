function identity(x) {
  return x;
}

function convertFeatureStrToObject(elem) {
  const elements = elem.trim().split('=');
  return {
    [elements[0]]: elements[1]
  };
}

function arrayToObjectReducer(acc, element) {
  return {
    ...acc,
    ...element
  };
}

function getCookies() {
  return document?.cookie.split(';')
    .filter(identity)
    .map(convertFeatureStrToObject)
    .reduce(arrayToObjectReducer, {});
}

function getCookie(cookie) {
  const cookies = getCookies();

  return cookies && cookies[cookie];
}

function setCookie(key, value, expiryDate) {
  document.cookie = `${key}=${value};expires=${expiryDate.toUTCString()};path=/`;
}

export default {
  setCookie,
  getCookies,
  getCookie
};
