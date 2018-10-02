'use strict';
(function () {
  var catalogCards = document.querySelector('.catalog__cards');
  function showLoad() {
    catalogCards.classList.add('catalog__cards--load');
    catalogCards.querySelector('.catalog__load').classList.remove('visually-hidden');
  }
  function hideLoad() {
    catalogCards.classList.remove('catalog__cards--load');
    catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
  }
  window.backend = {
    load: function (onLoad, onError) {
      showLoad();
      var xhr = new XMLHttpRequest();
      var URL = 'https://js.dump.academy/candyshop/data';
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          hideLoad();
          onLoad(xhr.response);
        } else {
          hideLoad();
          onError('Ошибка при загрузке данных ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });
      xhr.timeout = 5000;
      xhr.open('GET', URL);
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      var URL = 'https://js.dump.academy/candyshop';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad();
        } else {
          onError('Ошибка отправки данных формы заказа ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });
      xhr.open('POST', URL);
      xhr.timeout = 5000;
      xhr.send(data);
    }
  };
})();
