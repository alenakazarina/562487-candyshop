'use strict';
(function () {
  //  start
  window.backend.load(onLoad, onLoadError);
  //  cb
  function onLoad(data) {
    window.goods.init(data);
  }
  function onLoadError(err) {
    var errMsg = document.querySelector('.modal--error');
    showError(err);
    window.goods.initModal(errMsg);
  }
  function showError(err) {
    var errMsg = document.querySelector('.modal--error');
    errMsg.querySelector('.modal__message').textContent = 'Код ошибки: ' + err.match(/[\d]+/) + '.';
    errMsg.classList.remove('modal--hidden');
  }
})();
