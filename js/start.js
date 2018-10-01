'use strict';
(function () {
  window.backend.load(onLoad, onLoadError);

  function onLoad(data) {
    window.goods.init(data);
  }
  function onLoadError(err) {
    var errMsg = document.querySelector('.modal--error');
    window.start.initModal(errMsg);
    showError(err);
  }
  function showError(err) {
    var errMsg = document.querySelector('.modal--error');
    errMsg.querySelector('.modal__message').textContent = 'Код ошибки: ' + err.match(/[\d]+/) + '.';
    errMsg.classList.remove('modal--hidden');
  }
  window.start = {
    initModal: function (target) {
      var modalClose = target.querySelector('.modal__close');
      modalClose.addEventListener('click', onModalCloseClick);
      document.addEventListener('keydown', onModalEscPress);
      function onModalEscPress(evt) {
        if (evt.keyCode === 27) {
          target.classList.add('modal--hidden');
          modalClose.removeEventListener('click', onModalCloseClick);
          document.removeEventListener('keydown', onModalEscPress);
        }
      }
      function onModalCloseClick(evt) {
        var close = evt.target;
        close.parentElement.parentElement.classList.add('modal--hidden');
        modalClose.removeEventListener('click', onModalCloseClick);
        document.removeEventListener('keydown', onModalEscPress);
      }
    }
  };
})();
