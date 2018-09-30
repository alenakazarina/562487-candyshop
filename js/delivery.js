'use strict';

(function () {
  var IMG_PATH = './img/map/';
  var deliverTabs = document.querySelector('.deliver__toggle');
  var deliverStores = document.querySelector('.deliver__stores');
  var deliverMap = document.querySelector('.deliver__store-map-wrap img');
  deliverTabs.addEventListener('change', onMethodChange);
  deliverStores.addEventListener('change', onStoresChange);
  function onMethodChange(evt) {
    var target = evt.target;
    if (target.id === 'deliver__store') {
      var inputs = document.querySelectorAll('.deliver__courier input');
      inputs.forEach(function (it) {
        it.disabled = true;
      });
      document.querySelector('.deliver__textarea').disabled = true;
    }
    document.querySelector('.deliver__courier').classList.toggle('visually-hidden');
    document.querySelector('.deliver__store').classList.toggle('visually-hidden');
  }
  function onStoresChange(evt) {
    var target = evt.target;
    deliverMap.src = IMG_PATH + target.value + '.jpg';
  }
})();
