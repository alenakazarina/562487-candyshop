'use strict';

function changePaymentMethod(evt) {
  var target = evt.target;
  target.checked = true;
  if (target.id === 'payment__cash') {
    showPaymentCash();
  }
  if (target.id === 'payment__card') {
    showPaymentCard();
  }
}
function showPaymentCard() {
  document.querySelector('.payment__cash-wrap').classList.add('visually-hidden');
  document.querySelector('.payment__card-wrap').classList.remove('visually-hidden');
}
function showPaymentCash() {
  document.querySelector('.payment__card-wrap').classList.add('visually-hidden');
  document.querySelector('.payment__cash-wrap').classList.remove('visually-hidden');
}

var paymentTabs = document.querySelector('.payment__method');
paymentTabs.addEventListener('click', changePaymentMethod);

//  Luhn algorithm
function checkLuhn(cardNumber) {
  var digits = cardNumber.split('').map(function (digit, index) {
    digit = parseInt(digit, 10);
    if (cardNumber.length % 2 === 0) {
      if (index % 2 === 0) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      return digit;
    } else {
      if (index % 2 !== 0) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      return digit;
    }
  });
  var sum = 0;
  for (var i = 0; i < digits.length; i++) {
    sum += digits[i];
  }
  if (sum % 10 === 0) {
    return true;
  }
  return false;
}

var cardNumberInput = document.querySelector('#payment__card-number');
// var cardDate = document.querySelector('#payment__card-date');
// var cardCvc = document.querySelector('#payment__card-cvc');
// var cardholder = document.querySelector('.payment__cardholder');

cardNumberInput.addEventListener('change', onCardNumberChange);

function onCardNumberChange(evt) {
  var target = evt.target;
  var isValid = checkLuhn(target.value);
  if (!isValid) {
    var message = document.createElement('p');
    message.textContent = 'Введен некорректный номер банковской карты';
    document.querySelector('.payment__input-wrap--card-number').appendChild(message);
  }
}
