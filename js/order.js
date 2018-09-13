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
