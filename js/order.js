'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  //  Luhn algorithm
  function checkLuhn(cardInput) {
    var cardNumber = cardInput.value;
    var digits = cardNumber.split('');
    function getLuhnDigit(item) {
      var digit = parseInt(item, 10);
      if (cardNumber.length % 2 === 0) {
        if (i % 2 === 0) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        return digit;
      } else {
        if (i % 2 !== 0) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        return digit;
      }
    }
    for (var i = 0; i < digits.length; i++) {
      digits[i] = getLuhnDigit(digits[i]);
    }
    var sum = 0;
    for (var j = 0; j < digits.length; j++) {
      sum += digits[j];
    }
    if (sum % 10 === 0) {
      return true;
    }
    return false;
  }
  //  payment method
  function showPaymentCard() {
    document.querySelector('.payment__cash-wrap').classList.add('visually-hidden');
    document.querySelector('.payment__card-wrap').classList.remove('visually-hidden');
  }
  function showPaymentCash() {
    document.querySelector('.payment__card-wrap').classList.add('visually-hidden');
    document.querySelector('.payment__cash-wrap').classList.remove('visually-hidden');
  }
  //  payment inputs
  function disablePaymentInputs() {
    document.querySelectorAll('.payment__card-wrap input').forEach(function (item) {
      item.disabled = true;
    });
  }
  function removeDisabledPaymentInputs() {
    document.querySelectorAll('.payment__card-wrap input').forEach(function (item) {
      item.disabled = false;
    });
  }
  function addInputError(input) {
    input.parentElement.classList.remove('text-input--correct');
    input.parentElement.classList.add('text-input--error');
  }
  function addInputCorrect(input) {
    input.parentElement.classList.remove('text-input--error');
    input.parentElement.classList.add('text-input--correct');
  }
  function cleanPaymentInput(input) {
    input.parentElement.classList.remove('text-input--error');
    input.parentElement.classList.remove('text-input--correct');
  }
  function checkInputValidity(input, status) {
    if (!status) {
      addInputError(input);
    } else {
      addInputCorrect(input);
    }
  }
  function checkCardStatus() {
    var status = [];
    for (var i = 0; i < paymentInputs.length; i++) {
      var input = paymentInputs[i].parentElement;
      var isError = input.classList.contains('text-input--error');
      var isEmpty = (paymentInputs[i].value === '') ? true : false;
      if (isError || isEmpty) {
        status.push(input);
      }
    }
    if (status.length !== 0) {
      statusField.textContent = 'Неизвестен';
      statusField.classList.remove('approved');
      statusField.classList.add('unknown');
    } else {
      statusField.textContent = 'Одобрен';
      statusField.classList.remove('unknown');
      statusField.classList.add('approved');
    }
  }
  function showErrorMessage(input) {
    var errorMessage = input.parentElement.querySelector('.payment__error-message');
    if (!errorMessage) {
      errorMessage = document.querySelector('.payment__error-message').cloneNode();
      errorMessage.classList.remove('visually-hidden');
    }
    switch (input.id) {
      case 'payment__card-number':
        errorMessage.textContent = 'Введите 16 цифр номера карты без пробелов';
        break;
      case 'payment__card-date':
        errorMessage.textContent = 'Формат мм/гг';
        break;
      case 'payment__card-cvc':
        errorMessage.textContent = 'Введите CVC код';
        break;
      case 'payment__cardholder':
        errorMessage.textContent = 'Введите имя держателя карты';
        break;
      default:
        throw new Error('Неизвестный payment input');
    }
    input.parentElement.appendChild(errorMessage);
  }
  function showLunhErrorMessage(input) {
    var errorMessage = document.querySelector('.payment__error-message').cloneNode();
    errorMessage.classList.remove('visually-hidden');
    errorMessage.textContent = 'Проверьте цифры номера карты';
    input.parentElement.appendChild(errorMessage);
  }
  function hideErrorMessage(input) {
    var errorMessage = input.parentElement.querySelector('.payment__error-message');
    if (errorMessage) {
      input.parentElement.removeChild(errorMessage);
    }
  }
  function focusErrorPaymentInput(form) {
    var errorInput = form.querySelector('.text-input--error input');
    if (errorInput) {
      errorInput.focus();
    }
  }
  function validatePaymentInput(input) {
    var inputStatus = input.validity.valid;
    checkInputValidity(input, inputStatus);
    if (!inputStatus) {
      showErrorMessage(input);
    } else {
      hideErrorMessage(input);
      if (input.id === 'payment__card-number') {
        inputStatus = checkLuhn(input);
        checkInputValidity(input, inputStatus);
        if (!inputStatus) {
          showLunhErrorMessage(input);
        }
      }
    }
  }
  //  handlers
  function onPaymentMethodClick(evt) {
    var target = evt.target;
    target.checked = true;
    if (target.id === 'payment__cash') {
      showPaymentCash();
      disablePaymentInputs();
    }
    if (target.id === 'payment__card') {
      showPaymentCard();
      removeDisabledPaymentInputs();
    }
  }
  function onPaymentInputFocus(evt) {
    var target = evt.target;
    cleanPaymentInput(target);
    //  listener
    target.addEventListener('blur', onPaymentInputBlur);
    target.addEventListener('keydown', onPaymentInputEnterPress);
  }
  function onPaymentInputBlur(evt) {
    var target = evt.target;
    validatePaymentInput(target);
    checkCardStatus();
    //  listener remove
    target.removeEventListener('keydown', onPaymentInputEnterPress);
    target.removeEventListener('blur', onPaymentInputBlur);
  }
  function onPaymentInputEnterPress(evt) {
    var target = evt.target;
    if (evt.keyCode === ENTER_KEYCODE) {
      evt.preventDefault();
      validatePaymentInput(target);
      checkCardStatus();
    }
  }
  function onPaymentInputInvalid(evt) {
    var target = evt.target;
    switch (target.id) {
      case 'payment__card-number':
        if (target.validity.tooShort || target.validity.patternMismatch) {
          target.setCustomValidity('Введите 16 цифр номера карты без пробелов');
        } else if (target.validity.missingValue) {
          target.setCustomValidity('Обязательное поле.');
        } else {
          target.setCustomValidity('');
        }
        break;
      case 'payment__card-date':
        if (target.validity.tooShort || target.validity.patternMismatch) {
          target.setCustomValidity('Введите срок действия карты в формате мм/гг');
        } else if (target.validity.missingValue) {
          target.setCustomValidity('Обязательное поле.');
        } else {
          target.setCustomValidity('');
        }
        break;
      case 'payment__card-cvc':
        if (target.validity.missingValue) {
          target.setCustomValidity('Обязательное поле.');
        }
        break;
      case 'payment__cardholder':
        if (target.validity.missingValue) {
          target.setCustomValidity('Обязательное поле.');
        }
        break;
      default:
        throw new Error('Неизвестный payment input');
    }
  }
  function onOrderFormSubmit(evt) {
    evt.preventDefault();
    var target = evt.target;
    var cashMethod = paymentTabs.querySelector('input:checked').value === 'card' ? true : false;
    if (statusField.classList.contains('approved') && cashMethod || !cashMethod) {
      //  submit
      var orderData = new FormData(form);
      window.backend.save(orderData, onSave, onSaveError);
      return;
    }
    focusErrorPaymentInput(target);
  }
  function onSave() {
    showSuccess();
    cleanForm();
    checkCardStatus();
  }
  function onSaveError(err) {
    var errMsg = document.querySelector('.modal--error');
    showError(err);
    window.goods.initModal(errMsg);
  }
  function showError(err) {
    var errMsg = document.querySelector('.modal--error');
    errMsg.querySelector('.modal__message').textContent = 'Код ошибки: ' + err.match(/[\d]+/) + '.';
    errMsg.classList.remove('modal--hidden');
  }
  function showSuccess() {
    var successMsg = document.querySelector('.modal--success');
    successMsg.classList.remove('modal--hidden');
    window.goods.initModal(successMsg);
  }
  function cleanForm() {
    var inputs = form.querySelectorAll('.text-input__input');
    var deliverText = form.querySelector('.deliver__textarea');
    inputs.forEach(function (input) {
      input.value = '';
      cleanPaymentInput(input);
    });
    deliverText.value = '';
  }
  // start
  var paymentTabs = document.querySelector('.payment__method');
  var paymentInputs = document.querySelectorAll('.payment input');
  var statusField = document.querySelector('.payment__card-status');
  var form = document.querySelector('.buy__form');
  //  listener
  paymentTabs.addEventListener('click', onPaymentMethodClick);
  paymentInputs.forEach(function (input) {
    input.addEventListener('focus', onPaymentInputFocus);
    input.addEventListener('invalid', onPaymentInputInvalid);
  });
  form.addEventListener('submit', onOrderFormSubmit);
})();
