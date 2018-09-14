'use strict';

function showMessage() {
  var message = document.querySelector('.catalog__empty-filter');
  if (message) {
    message.style.display = 'block';
    return;
  }
  var template = document.querySelector('#empty-filters').content;
  var content = template.cloneNode(true);
  catalog.appendChild(content);
}
function hideMessage() {
  var message = document.querySelector('.catalog__empty-filter');
  if (message) {
    message.style.display = 'none';
  }
}
function showCardsInPriceRange() {
  var cards = document.querySelectorAll('.catalog__card');
  var prices = [];
  document.querySelectorAll('.card__price').forEach(function (item) {
    prices.push(parseInt(item.textContent.split(' ')[0], 10));
  });
  var ids = [];
  prices.forEach(function (price, index) {
    if (price >= priceRange.min && price <= priceRange.max) {
      ids.push(index);
    }
  });
  if (ids.length === 0) {
    showMessage();
  } else {
    hideMessage();
  }
  for (var i = 0; i < cards.length; i++) {
    cards[i].style.display = 'none';
  }
  for (var j = 0; j < ids.length; j++) {
    cards[ids[j]].style.display = 'block';
  }
  filterRangeCount.textContent = ids.length;
}

var catalog = document.querySelector('.catalog__cards');
var filterRange = document.querySelector('.range');
var filterRangeMinInput = filterRange.querySelector('.range__price--min');
var filterRangeMaxInput = filterRange.querySelector('.range__price--max');
var filterRangeCount = filterRange.querySelector('.range__count');
var priceRange = {
  min: 100,
  max: 1500
};
showCardsInPriceRange();

//  listeners
filterRangeMinInput.addEventListener('change', onRangeMinInput);
filterRangeMaxInput.addEventListener('change', onRangeMaxInput);

function onRangeMinInput(evt) {
  evt.preventDefault();
  priceRange.min = evt.target.value;
  showCardsInPriceRange();
}
function onRangeMaxInput(evt) {
  evt.preventDefault();
  priceRange.max = evt.target.value;
  showCardsInPriceRange();
}
