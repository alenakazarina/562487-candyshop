'use strict';
(function () {
  var form = document.querySelector('.buy__form');
  var paymentTabs = form.querySelector('.payment__method');
  var contactInputs = form.querySelectorAll('.contact-data input');
  var paymentInputs = form.querySelectorAll('.payment input');
  var statusField = form.querySelector('.payment__card-status');
  contactInputs.forEach(function (input) {
    input.addEventListener('focus', onInputFocus);
    input.addEventListener('invalid', onInputInvalid);
  });
  paymentTabs.addEventListener('change', onMethodChange);
  paymentInputs.forEach(function (input) {
    input.addEventListener('focus', onInputFocus);
    input.addEventListener('invalid', onPaymentInputInvalid);
  });
  form.addEventListener('submit', onOrderFormSubmit);
  function onMethodChange(evt) {
    var target = evt.target;
    var flag = (target.id === 'payment__cash') ? true : false;
    document.querySelectorAll('.payment__card-wrap input').forEach(function (it) {
      it.disabled = flag;
    });
    document.querySelector('.payment__cash-wrap').classList.toggle('visually-hidden');
    document.querySelector('.payment__card-wrap').classList.toggle('visually-hidden');
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
    var isPayment = [].filter.call(paymentInputs, function (it) {
      return it === target;
    });
    if (isPayment.length !== 0) {
      validatePaymentInput(target);
      checkCardStatus();
    } else {
      var status = !target.validity.valueMissing;
      if (target.type === 'email') {
        status = !target.validity.typeMismatch;
      }
      window.order.checkInputValidity(target, status);
    }
    target.removeEventListener('blur', onInputBlur);
    target.removeEventListener('keydown', onInputEnterPress);
  }
  function onInputEnterPress(evt) {
    var target = evt.target;
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      var isPayment = [].filter.call(paymentInputs, function (it) {
        return it === target;
      });
      if (isPayment.length !== 0) {
        validatePaymentInput(target);
        checkCardStatus();
      } else {
        var status = target.checkValidity();
        window.order.checkInputValidity(target, status);
      }
    }
  }
  function validatePaymentInput(input) {
    var inputStatus = !input.validity.valueMissing && !input.validity.patternMismatch;
    window.order.checkInputValidity(input, inputStatus);
    if (!inputStatus) {
      showErrorMessage(input);
    } else {
      hideErrorMessage(input);
      if (input.id === 'payment__card-number') {
        inputStatus = checkLuhn(input);
        window.order.checkInputValidity(input, inputStatus);
        if (!inputStatus) {
          showLunhErrorMessage(input);
        }
      }
    }
  }
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
  function checkCardStatus() {
    var invalids = [];
    for (var i = 0; i < paymentInputs.length; i++) {
      var input = paymentInputs[i].parentElement;
      var isError = input.classList.contains('text-input--error');
      var isEmpty = (paymentInputs[i].value === '') ? true : false;
      if (isError || isEmpty) {
        invalids.push(input);
      }
    }
    if (invalids.length !== 0) {
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
  function onInputInvalid(evt) {
    var target = evt.target;
    if (target.id === 'contact-data__name' || target.id === 'contact-data__tel') {
      if (target.validity.valueMissing) {
        target.setCustomValidity('Обязательное поле');
      } else {
        target.setCustomValidity('');
      }
    }
    if (target.id === 'contact-data__email') {
      if (target.validity.typeMismatch) {
        target.setCustomValidity('Введите корректный email');
      } else {
        target.setCustomValidity('');
      }
    }
  }
  function onPaymentInputInvalid(evt) {
    var target = evt.target;
    switch (target.id) {
      case 'payment__card-number':
        if (target.validity.patternMismatch) {
          target.setCustomValidity('Введите 16 цифр номера карты без пробелов');
        } else if (target.validity.valueMissing) {
          target.setCustomValidity('Обязательное поле');
        } else {
          target.setCustomValidity('');
        }
        break;
      case 'payment__card-date':
        if (target.validity.patternMismatch) {
          target.setCustomValidity('Введите срок действия карты в формате мм/гг');
        } else if (target.validity.valueMissing) {
          target.setCustomValidity('Обязательное поле');
        } else {
          target.setCustomValidity('');
        }
        break;
      case 'payment__card-cvc':
        if (target.validity.patternMismatch) {
          target.setCustomValidity('Введите 3 цифры CVC кода с обратной стороны карты');
        } else if (target.validity.valueMissing) {
          target.setCustomValidity('Обязательное поле');
        } else {
          target.setCustomValidity('');
        }
        break;
      case 'payment__cardholder':
        if (target.validity.valueMissing) {
          target.setCustomValidity('Обязательное поле');
        } else {
          target.setCustomValidity('');
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
      var orderData = new FormData(form);
      window.backend.save(orderData, onSave, onSaveError);
      return;
    }
    focusErrorInput(target);
  }
  function focusErrorInput() {
    var errorInput = form.querySelector('.text-input--error input:invalid');
    if (errorInput) {
      errorInput.focus();
    }
  }
  function onSave() {
    showSuccess();
    cleanForm();
    checkCardStatus();
  }
  function onSaveError(err) {
    var errMsg = document.querySelector('.modal--error');
    window.start.initModal(errMsg);
    errMsg.querySelector('.modal__message').textContent = 'Код ошибки: ' + err.match(/[\d]+/) + '.';
    errMsg.classList.remove('modal--hidden');
  }
  function showSuccess() {
    var successMsg = document.querySelector('.modal--success');
    window.start.initModal(successMsg);
    successMsg.classList.remove('modal--hidden');
  }
  function cleanForm() {
    var inputs = form.querySelectorAll('.text-input__input');
    var deliverText = form.querySelector('.deliver__textarea');
    inputs.forEach(function (input) {
      input.value = '';
      window.order.cleanInput(input);
    });
    deliverText.value = '';
  }
  window.order = {
    addInputError: function (input) {
      input.parentElement.classList.remove('text-input--correct');
      input.parentElement.classList.add('text-input--error');
    },
    addInputCorrect: function (input) {
      input.parentElement.classList.remove('text-input--error');
      input.parentElement.classList.add('text-input--correct');
    },
    cleanInput: function (input) {
      input.parentElement.classList.remove('text-input--error');
      input.parentElement.classList.remove('text-input--correct');
    },
    checkInputValidity: function (input, status) {
      if (!status) {
        window.order.addInputError(input);
      } else {
        window.order.addInputCorrect(input);
      }
    }
  };
})();
