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
  var catalogForm = document.querySelector('.catalog__sidebar form');
  // var foodTypeFilters = catalogForm.querySelectorAll('input[name=food-type]');
  // var foodPropFilters = catalogForm.querySelectorAll('input[name=food-property]');
  // var filterFavs = catalogForm.querySelector('#filter-favorite');
  // var filterInStock = catalogForm.querySelector('#filter-availability');
  // var sortFilters = catalogForm.querySelectorAll('input[name=sort]');
  // var catalogSubmit = catalogForm.querySelector('.catalog__submit');

  var BUTTON_WIDTH = filterRangeMin.clientWidth;
  var BUTTON_HALF_WIDTH = BUTTON_WIDTH / 2;
  var RANGE_WIDTH = filterRange.clientWidth;
  var MIN = 0;
  var MAX = RANGE_WIDTH - BUTTON_WIDTH;
  var RANGE_OFFSET = priceRangeFilter.offsetLeft;
  var COORD_PERCENT = (MAX + BUTTON_HALF_WIDTH) / MAX * 100;
  function getMinPrice(list) {
    var minPrice = list[0].price;
    list.forEach(function (item) {
      if (item.price <= minPrice) {
        minPrice = item.price;
      }
    });
    return minPrice;
  }
  function getMaxPrice(list) {
    var maxPrice = list[0].price;
    list.forEach(function (item) {
      if (item.price >= maxPrice) {
        maxPrice = item.price;
      }
    });
    return maxPrice;
  }
  function getGoodsInRange(list) {
    var ids = [];
    var minPrice = parseInt(filterRangeMinPrice.textContent, 10);
    var maxPrice = parseInt(filterRangeMaxPrice.textContent, 10);
    list.forEach(function (item) {
      if (item.price >= minPrice && item.price <= maxPrice) {
        ids.push(item.id);
      }
    });
    return ids;
  }
  function renderCards(ids) {
    var catalogCards = catalog.querySelectorAll('.catalog__card');
    catalogCards.forEach(function (card) {
      card.style.display = 'none';
    });
    if (ids.length === 0) {
      window.filters.showMessage();
      return;
    }
    window.filters.hideMessage();
    ids.forEach(function (id) {
      catalogCards[id].style.display = 'block';
    });
  }
  function showAllCards() {
    var catalogCards = catalog.querySelectorAll('.catalog__card');
    catalogCards.forEach(function (item) {
      item.style.display = 'block';
    });
  }
  function updateCount(target, ids) {
    var targetCount = target.nextElementSibling.nextElementSibling;
    targetCount.textContent = '(' + ids.length + ')';
  }
  //  export
  window.filters = {
    init: function (goodsList) {
      var goods = goodsList;
      var MIN_PRICE = getMinPrice(goods);
      var MAX_PRICE = getMaxPrice(goods);
      var PRICES_DELTA = MAX_PRICE - MIN_PRICE;
      var PRICE_PERCENT = MAX_PRICE / PRICES_DELTA * 100;
      var PERCENT_DELTA = Math.round(PRICE_PERCENT - COORD_PERCENT);
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
      catalogForm.addEventListener('click', onCatalogFormClick);
      //  cb
      function setMaxRange(targetBtn) {
        var minCenterX = filterRangeMin.offsetLeft + BUTTON_HALF_WIDTH;
        var targetCenterX = targetBtn.offsetLeft + BUTTON_HALF_WIDTH;
        var centerCoord = targetCenterX;
        var rightLimit = (targetCenterX >= MAX) ? true : false;
        var leftLimit = (targetCenterX <= minCenterX + BUTTON_WIDTH) ? true : false;
        if (leftLimit) {
          centerCoord = (minCenterX + BUTTON_WIDTH);
          targetBtn.style.left = minCenterX + BUTTON_HALF_WIDTH + 'px';
        }
        if (rightLimit) {
          centerCoord = MAX + BUTTON_HALF_WIDTH;
          targetBtn.style.left = MAX + 'px';
        }
        filterRangeFill.style.right = (RANGE_WIDTH - centerCoord) / RANGE_WIDTH * 100 + '%';
        var price = (centerCoord / MAX * 100 + PERCENT_DELTA) / 100 * PRICES_DELTA;
        filterRangeMaxPrice.textContent = Math.round(price);
        var ids = getGoodsInRange(goods);
        renderCards(ids);
        filterRangeCount.textContent = ids.length;
      }
      function setMinRange(targetBtn) {
        var maxCenterX = filterRangeMax.offsetLeft + BUTTON_HALF_WIDTH;
        var targetCenterX = targetBtn.offsetLeft + BUTTON_HALF_WIDTH;
        var centerCoord = targetCenterX;
        var leftLimit = (targetCenterX <= MIN + BUTTON_HALF_WIDTH) ? true : false;
        var rightLimit = (targetCenterX >= maxCenterX - BUTTON_WIDTH) ? true : false;
        if (rightLimit) {
          centerCoord = maxCenterX - BUTTON_WIDTH;
          targetBtn.style.left = maxCenterX - BUTTON_WIDTH - BUTTON_HALF_WIDTH + 'px';
        }
        if (leftLimit) {
          centerCoord = MIN + BUTTON_HALF_WIDTH;
          targetBtn.style.left = MIN + 'px';
        }
        filterRangeFill.style.left = centerCoord / RANGE_WIDTH * 100 + '%';
        var price = (centerCoord / MAX * 100 + PERCENT_DELTA) / 100 * PRICES_DELTA;
        filterRangeMinPrice.textContent = Math.round(price);
        var ids = getGoodsInRange(goods);
        renderCards(ids);
        filterRangeCount.textContent = ids.length;
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
      function onCatalogFormClick(evt) {
        var target = evt.target;
        if (target.classList.contains('catalog__submit')) {
          showAllCards();
          return;
        }
        var ids = [];
        switch (target.id) {
          case 'filter-icecream':
            ids.concat(getGoodsByType('Мороженное'));
            break;
          case 'filter-soda':
            ids.concat(getGoodsByType('Газировка'));
            break;
          case 'filter-gum':
            ids.concat(getGoodsByType('Жевательная резинка'));
            break;
          case 'filter-marmalade':
            ids.concat(getGoodsByType('Мармелад'));
            break;
          case 'filter-marshmallows':
            ids.concat(getGoodsByType('Зефир'));
            break;
          case 'filter-sugar-free':
            ids.concat(getGoodsByProp('sugar'));
            break;
          case 'filter-vegetarian':
            ids.concat(getGoodsByProp('vegetarian'));
            break;
          case 'filter-gluten-free':
            ids.concat(getGoodsByProp('gluten'));
            break;
          case 'filter-favorite':
            ids.concat(getFavsGoods('gluten'));
            break;
          case 'filter-availability':
            ids.concat(getGoodsInStock());
            break;
        }
        if (target.checked) {
          //  переделать функцию - показать карточки с ids
          renderCards(ids);
          updateCount(target, ids);
        } else {
          //  показать уже скрытые карточки, id !== currentId
          //  скрыть сообщение
          window.filters.hideMessage();
          //  showAllCards();
        }
      }
      function getGoodsByType(type) {
        var ids = [];
        goods.forEach(function (good) {
          if (good.kind === type) {
            ids.push(good.id);
          }
        });
        return ids;
      }
      function getGoodsByProp(property) {
        var ids = [];
        if (property === 'vegetarian') {
          goods.forEach(function (good) {
            if (good.nutritionFacts[property]) {
              ids.push(good.id);
            }
          });
        } else {
          goods.forEach(function (good) {
            if (!good.nutritionFacts[property]) {
              ids.push(good.id);
            }
          });
        }
        return ids;
      }
      function getFavsGoods() {
        var catalogCards = document.querySelectorAll('.catalog__card');
        var ids = [];
        catalogCards.forEach(function (card, index) {
          if (card.classList.contains('favorite')) {
            ids.push(index);
          }
        });
        return ids;
      }
      function getGoodsInStock() {
        var ids = [];
        goods.forEach(function (good) {
          if (good.amount !== 0) {
            ids.push(good.id);
          }
        });
        return ids;
      }
    },
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
