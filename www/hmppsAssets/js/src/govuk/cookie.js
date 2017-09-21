// ES6 conversion of GOVUK cookie functions
const setCookie = (name, value, options = {}) => {
  let cookieString = `${name}=${value}; path=/`;
  if (options.days) {
    const date = new Date();
    date.setTime((date.getTime() + options.days) * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toGMTString()}`;
  }
  if (document.location.protocol === 'https:') {
    cookieString += '; Secure';
  }
  document.cookie = cookieString;
};

const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0, len = cookies.length; i < len; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

const cookie = (name, value, options) => {
  if (typeof value !== 'undefined') {
    if (value === false || value === null) {
      return setCookie(name, '', { days: -1 });
    }
    return setCookie(name, value, options);
  }
  return getCookie(name);
};

export default cookie;
