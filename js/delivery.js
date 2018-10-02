'use strict';
(function () {
  var form = document.querySelector('.buy__form');
  var storeTab = form.querySelector('.deliver [type=radio]');
  var deliverMethod = form.querySelector('.deliver__toggle');
  var deliverStores = form.querySelector('.deliver__stores');
  var deliverCourier = form.querySelector('.deliver__courier');
  var deliverAddress = form.querySelectorAll('.deliver [type=text]');
  var deliverText = form.querySelector('.deliver__textarea');
  var deliverMap = form.querySelector('.deliver__store-map-wrap img');

  deliverMethod.addEventListener('change', onMethodChange);
  deliverStores.addEventListener('change', onStoresChange);
  deliverAddress.forEach(function (input) {
    input.addEventListener('focus', onInputFocus);
    input.addEventListener('invalid', onInputInvalid);
  });
  function onMethodChange() {
    var storeMethod = storeTab.checked ? true : false;
    if (storeMethod) {
      deliverStores.querySelectorAll('[type=radio]').forEach(function (it) {
        it.disabled = false;
      });
      deliverAddress.forEach(function (it) {
        it.disabled = true;
      });
      deliverText.disabled = true;
      deliverCourier.classList.add('visually-hidden');
      deliverStores.parentElement.classList.remove('visually-hidden');
    } else {
      deliverStores.querySelectorAll('[type=radio]').forEach(function (it) {
        it.disabled = true;
      });
      deliverAddress.forEach(function (it) {
        it.disabled = false;
      });
      deliverText.disabled = false;
      deliverCourier.classList.remove('visually-hidden');
      deliverStores.parentElement.classList.add('visually-hidden');
    }
  }
  function onStoresChange(evt) {
    var target = evt.target;
    deliverMap.src = window.util.IMG_DELIVER_PATH + target.value + '.jpg';
  }
  function onInputFocus(evt) {
    var target = evt.target;
    Object.defineProperty(target.validity, 'valid', {
      writable: true
    });
    target.validity.valid = true;
    window.order.cleanInput(target);
    target.addEventListener('blur', onInputBlur);
    target.addEventListener('keydown', onInputEnterPress);
  }
  function onInputBlur(evt) {
    var target = evt.target;
    var status = !target.validity.valueMissing && !target.validity.patternMismatch;
    window.order.checkInputValidity(target, status);
    target.removeEventListener('blur', onInputBlur);
    target.removeEventListener('keydown', onInputEnterPress);
  }
  function onInputEnterPress(evt) {
    var target = evt.target;
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      evt.preventDefault();
      var status = target.checkValidity();
      window.order.checkInputValidity(target, status);
    }
  }
  function onInputInvalid(evt) {
    var target = evt.target;
    if (target.id === 'deliver__street' || target.id === 'deliver__house' || target.id === 'deliver__room') {
      if (target.validity.valueMissing) {
        target.setCustomValidity('Обязательное поле');
      } else {
        target.setCustomValidity('');
      }
    }
    if (target.id === 'deliver__floor') {
      if (target.validity.patternMismatch) {
        target.setCustomValidity('Номер этажа должен быть числом');
      } else {
        target.setCustomValidity('');
      }
    }
  }
})();
