/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  if (!options.data) return;

  const xhr = new XMLHttpRequest();
  let url = options.url;
  if (options.method == 'GET' && Object.keys(options.data).length != 0) {
    url = `${options.url}?${getUrlStringFromData(options.data)}`;
  }

  try {
    xhr.open(options.method, url);
    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState == xhr.DONE) {
        const response = xhr.responseText;
        options.callback(JSON.parse(response));
      };
    });

    //xhr.responseType = options.responseType || 'json';
    //xhr.withCredentials = true;

    if (options.method == 'GET') {
      xhr.send();
    } else {
      const formData = new FormData;
      Object.entries(options.data).forEach(([key, value]) => formData.append(key, value));
      xhr.send(formData);
    }
    
  } catch (error) {
    options.callback(error);
  }

  return xhr;
};

function getUrlStringFromData(obj) {
  const string = Object.entries(obj).map(([key, value]) => `${key}=${value}`).join('&');
  return string;
}
