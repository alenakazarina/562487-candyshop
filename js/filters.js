'use strict';

(function () {
  var MIN_PRICE = 94;
  var MAX_PRICE = 1494;

  //  render cards with ids
  function renderCards(ids) {
    var cards = document.querySelectorAll('.catalog__card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.display = 'none';
    }
    for (var j = 0; j < ids.length; j++) {
      var index = ids[j];
      cards[index].style.display = 'block';
    }
  }
  function showAllCards() {
    document.querySelectorAll('.catalog__card').forEach(function (item) {
      item.style.display = 'block';
    });
  }
  //  filter price
  function showCardsInPriceRange() {
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
      window.filters.showMessage();
    } else {
      window.filters.hideMessage();
    }
    renderCards(ids);
    filterRangeCount.textContent = ids.length;
  }
  //  handlers
  function onRangeFilterMouseDown(evt) {
    evt.preventDefault();
    var target = evt.target;
    var isMax = target.classList.contains('range__btn--right');
    function onMouseMove(moveEvt) {
      var buttonWidth = filterRangeMin.clientWidth;
      var halfWidth = buttonWidth / 2;
      var rangeWidth = filterRange.clientWidth;
      var leftCoord = filterRange.offsetLeft + halfWidth;
      var rightCoord = filterRange.offsetLeft + rangeWidth - halfWidth;
      var minCoord = filterRangeMin.offsetLeft;
      var maxCoord = filterRangeMax.offsetLeft;
      var step = Math.round((MAX_PRICE - MIN_PRICE) / (rightCoord - leftCoord));
      var shift = startPosition - moveEvt.clientX;
      startPosition = moveEvt.clientX;
      if (isMax) {
        if (moveEvt.clientX < minCoord + buttonWidth * 2.5 || moveEvt.clientX >= rightCoord) {
          shift = 0;
        }
        filterRangeFill.style.right = rangeWidth - halfWidth - target.offsetLeft - shift + 'px';
        filterRangeMaxPrice.textContent = MIN_PRICE + target.offsetLeft * step;
      } else {
        if (moveEvt.clientX > maxCoord + halfWidth || moveEvt.clientX <= leftCoord) {
          shift = 0;
        }
        filterRangeFill.style.left = target.offsetLeft - shift + 'px';
        filterRangeMinPrice.textContent = MIN_PRICE + target.offsetLeft * step;
      }
      target.style.left = target.offsetLeft - shift + 'px';
    }
    function onMouseUp() {
      if (isMax) {
        priceRange.max = parseInt(filterRangeMaxPrice.textContent, 10);
      }
      priceRange.min = parseInt(filterRangeMinPrice.textContent, 10);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      showCardsInPriceRange();
    }
    if (target.classList.contains('range__btn')) {
      var startPosition = evt.clientX;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  }
  //  range filter items
  var catalog = document.querySelector('.catalog__cards');
  var filterRange = document.querySelector('.range');
  var filterRangeMinPrice = filterRange.querySelector('.range__price--min');
  var filterRangeMaxPrice = filterRange.querySelector('.range__price--max');
  var filterRangeCount = filterRange.querySelector('.range__count');
  var filterRangeFilter = filterRange.querySelector('.range__filter');
  var filterRangeMax = filterRange.querySelector('.range__btn--right');
  var filterRangeMin = filterRange.querySelector('.range__btn--left');
  var filterRangeFill = filterRange.querySelector('.range__fill-line');
  var priceRange = {
    min: 100,
    max: 1500
  };
  //  listeners range filter
  filterRangeFilter.addEventListener('mousedown', onRangeFilterMouseDown);

  //  favourites filter
  function onFilterFavsClick(evt) {
    showAllCards();
    var target = evt.target;
    if (target.checked) {
      var ids = [];
      catalog.querySelectorAll('.catalog__card').forEach(function (item, index) {
        if (item.classList.contains('favorite')) {
          ids.push(index);
        }
      });
      if (ids.length === 0) {
        window.filters.showMessage();
      }
      renderCards(ids);
      filterFavsCount.textContent = '(' + ids.length + ')';
      return;
    }
    window.filters.hideMessage();
    showAllCards();
  }
  var filterFavs = document.querySelector('#filter-favorite');
  var filterFavsCount = document.querySelector('#filter-favorite').nextElementSibling.nextElementSibling;
  //  listener favourites
  filterFavs.addEventListener('click', onFilterFavsClick);

  //  export
  window.filters = {
    //  message
    showMessage: function () {
      var message = document.querySelector('.catalog__empty-filter');
      if (message) {
        message.style.display = 'block';
        return;
      }
      var template = document.querySelector('#empty-filters').content;
      var content = template.cloneNode(true);
      catalog.appendChild(content);
    },
    hideMessage: function () {
      var message = document.querySelector('.catalog__empty-filter');
      if (message) {
        message.style.display = 'none';
      }
    }
  };
})();
