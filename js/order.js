'use strict';

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
function showPaymentCard() {
  document.querySelector('.payment__cash-wrap').classList.add('visually-hidden');
  document.querySelector('.payment__card-wrap').classList.remove('visually-hidden');
}
function showPaymentCash() {
  document.querySelector('.payment__card-wrap').classList.add('visually-hidden');
  document.querySelector('.payment__cash-wrap').classList.remove('visually-hidden');
}

var paymentTabs = document.querySelector('.payment__method');
paymentTabs.addEventListener('click', onPaymentMethodClick);

//  Luhn algorithm
function checkLuhn(cardInput) {
  var cardNumber = cardInput.value;
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
    cardNumberInput.invalid = false;
  }
  cardNumberInput.invalid = true;
}
//  -------------
//  helpers
// function getCardData() {
//   // var numberField = document.querySelector('#payment__card-number');
//   // var dataField = document.querySelector('#payment__card-date');
//   // var cvcField = document.querySelector('#payment__card-cvc');
//   // var holderField = document.querySelector('#payment__cardholder');
//   var paymentData = [];
//   document.querySelectorAll('.payment__card-wrap input').forEach(function (item) {
//     paymentData.push(item.value);
//   });
//   return paymentData;
// }
// function setCardData() {
//   var paymentData = getCardData();
//   card.number = paymentData[0];
//   card.date = paymentData[1];
//   card.cvc = paymentData[2];
//   card.holder = paymentData[3];
// }
// function changeStatus() {
//   var cardStatus = document.querySelector('.payment__card-status');
//   if (card.isValid) {
//     cardStatus.textContent = 'Одобрен';
//     return;
//   }
//   cardStatus.textContent = 'Неизвестен';
// }
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
//  handlers
function onCardNumberChange(evt) {
  var target = evt.target;
  checkLuhn(target);
}
function onOrderFormInvalid() {
//  handling invalid
}
// start
// var card = {
//   number: 0,
//   date: ' ',
//   cvc: 0,
//   holder: ' ',
//   isValid: false
// };
var cardNumberInput = document.querySelector('#payment__card-number');
var orderForm = document.querySelector('.buy form');
//  listeners
cardNumberInput.addEventListener('change', onCardNumberChange);
orderForm.addEventListener('invalid', onOrderFormInvalid);
