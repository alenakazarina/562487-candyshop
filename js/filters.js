'use strict';

(function () {
  var catalog = document.querySelector('.catalog__cards');
  var filterRange = document.querySelector('.range');
  var filterRangeMinPrice = filterRange.querySelector('.range__price--min');
  var filterRangeMaxPrice = filterRange.querySelector('.range__price--max');
  var filterRangeCount = filterRange.querySelector('.range__count');
  var priceRangeFilter = filterRange.querySelector('.range__filter');
  var filterRangeMin = filterRange.querySelector('.range__btn--left');
  var filterRangeMax = filterRange.querySelector('.range__btn--right');
  var filterRangeFill = filterRange.querySelector('.range__fill-line');
  var MIN_PRICE = 100;
  var MAX_PRICE = 1500;
  var BUTTON_WIDTH = filterRangeMin.clientWidth;
  var BUTTON_HALF_WIDTH = BUTTON_WIDTH / 2;
  var RANGE_WIDTH = filterRange.clientWidth;
  var MIN = 0;
  var MAX = RANGE_WIDTH - BUTTON_HALF_WIDTH * 2;
  var STEP = Math.round((MAX_PRICE - MIN_PRICE) / MAX);
  var RANGE_OFFSET = priceRangeFilter.offsetLeft;

  //  listeners
  priceRangeFilter.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var target = evt.target;
    var downEvtPos = evt.clientX;
    var maxRange = target.classList.contains('range__btn--right');
    var minRange = target.classList.contains('range__btn--left');
    if (maxRange) {
      window.slider.init(setMaxRange, target);
    } else if (minRange) {
      window.slider.init(setMinRange, target);
    } else {
      var activeBtn = getClosest(downEvtPos);
      activeBtn.style.left = downEvtPos - BUTTON_HALF_WIDTH - RANGE_OFFSET + 'px';
      var isMaxActive = activeBtn.classList.contains('range__btn--right');
      if (isMaxActive) {
        setMaxRange(activeBtn);
      } else {
        setMinRange(activeBtn);
      }
    }
  });
  //  cb
  function setMaxRange(targetBtn) {
    var minCenterX = filterRangeMin.offsetLeft + BUTTON_HALF_WIDTH;
    var targetCenterX = targetBtn.offsetLeft + BUTTON_HALF_WIDTH;
    filterRangeFill.style.right = (RANGE_WIDTH - targetCenterX) / RANGE_WIDTH * 100 + '%';
    filterRangeMaxPrice.textContent = MIN_PRICE + targetCenterX * STEP;
    var rightLimit = (targetCenterX >= MAX) ? true : false;
    var leftLimit = (targetCenterX <= minCenterX + BUTTON_WIDTH) ? true : false;
    if (leftLimit) {
      var centerCoord = (minCenterX + BUTTON_WIDTH);
      targetBtn.style.left = minCenterX + BUTTON_HALF_WIDTH + 'px';
      filterRangeFill.style.right = (RANGE_WIDTH - minCenterX - BUTTON_WIDTH) / RANGE_WIDTH * 100 + '%';
      filterRangeMaxPrice.textContent = MIN_PRICE + centerCoord * STEP;
    }
    if (rightLimit) {
      targetBtn.style.left = MAX + 'px';
      filterRangeFill.style.right = 0;
      filterRangeMaxPrice.textContent = MAX_PRICE;
    }
    showCardsInPriceRange();
  }
  function setMinRange(targetBtn) {
    var maxCenterX = filterRangeMax.offsetLeft + BUTTON_HALF_WIDTH;
    var targetCenterX = targetBtn.offsetLeft + BUTTON_HALF_WIDTH;
    filterRangeFill.style.left = targetCenterX / RANGE_WIDTH * 100 + '%';
    filterRangeMinPrice.textContent = MIN_PRICE + targetCenterX * STEP;
    var leftLimit = (targetCenterX <= MIN + BUTTON_HALF_WIDTH) ? true : false;
    var rightLimit = (targetCenterX >= maxCenterX - BUTTON_WIDTH) ? true : false;
    if (rightLimit) {
      var centerCoord = maxCenterX - BUTTON_WIDTH;
      targetBtn.style.left = maxCenterX - BUTTON_WIDTH - BUTTON_HALF_WIDTH + 'px';
      filterRangeFill.style.left = maxCenterX - BUTTON_WIDTH + 'px';
      filterRangeMinPrice.textContent = MIN_PRICE + centerCoord * STEP;
    }
    if (leftLimit) {
      targetBtn.style.left = MIN + 'px';
      filterRangeFill.style.left = 0;
      filterRangeMinPrice.textContent = MIN_PRICE;
    }
    showCardsInPriceRange();
  }
  function getClosest(position) {
    var minPos = filterRangeMin.offsetLeft + RANGE_OFFSET;
    var maxPos = filterRangeMax.offsetLeft + RANGE_OFFSET;
    var half = (maxPos - minPos) / 2;
    if (position >= maxPos) {
      return filterRangeMax;
    }
    if (position <= minPos) {
      return filterRangeMin;
    }
    if (position + half < maxPos) {
      return filterRangeMin;
    }
    return filterRangeMax;
  }
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
  function showCardsInPriceRange() {
    var prices = [];
    document.querySelectorAll('.card__price').forEach(function (item) {
      prices.push(parseInt(item.textContent.split(' ')[0], 10));
    });
    var ids = [];
    var minPrice = parseInt(filterRangeMinPrice.textContent, 10);
    var maxPrice = parseInt(filterRangeMaxPrice.textContent, 10);
    prices.forEach(function (price, index) {
      if (price >= minPrice && price <= maxPrice) {
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
