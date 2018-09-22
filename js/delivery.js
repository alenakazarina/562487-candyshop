'use strict';

(function () {
  function changeDeliveryMethod(evt) {
    var target = evt.target;
    target.checked = true;
    if (target.id === 'deliver__store') {
      showDeliverStore();
    }
    if (target.id === 'deliver__courier') {
      showDeliverCourier();
    }
  }
  function showDeliverStore() {
    document.querySelector('.deliver__courier').classList.add('visually-hidden');
    document.querySelector('.deliver__store').classList.remove('visually-hidden');
  }
  function showDeliverCourier() {
    document.querySelector('.deliver__store').classList.add('visually-hidden');
    document.querySelector('.deliver__courier').classList.remove('visually-hidden');
  }
  var deliveryTabs = document.querySelector('.deliver__toggle');
  deliveryTabs.addEventListener('click', changeDeliveryMethod);
})();
