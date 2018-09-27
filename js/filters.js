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

  var BUTTON_WIDTH = filterRangeMin.clientWidth;
  var BUTTON_HALF_WIDTH = BUTTON_WIDTH / 2;
  var RANGE_WIDTH = filterRange.clientWidth;
  var MIN = 0;
  var MAX = RANGE_WIDTH - BUTTON_WIDTH;
  var RANGE_OFFSET = priceRangeFilter.offsetLeft;
  var COORD_PERCENT = (MAX + BUTTON_HALF_WIDTH) / MAX * 100;

  var cardsState = 0;
  var basicStates = [];
  var Category = {};
  var choice = [];
  var goods = [];
  var cardsFilter = {
    getStateObj: function (names) {
      var obj = {
        'none': 0x00
      };
      names.forEach(function (name, i) {
        obj[name] = Math.pow(2, i);
      });
      return obj;
    },
    addState: function (currentState, newState) {
      return [currentState | newState];
    },
    deleteState: function (currentState, stateToDelete) {
      return currentState & ~stateToDelete;
    },
    hasState: function (currentState, state) {
      return Boolean(currentState & state);
    }
  };
  var inputs = catalogForm.querySelectorAll('input');
  var inputVals = [].map.call(inputs, function (it) {
    return it.value;
  }).slice(0, 10);
  inputVals.push('price');
  var inputsMap = cardsFilter.getStateObj(inputVals);

  function getMinPrice(list) {
    var prices = list.map(function (it) {
      return it.price;
    });
    return sortNumbers(prices).shift();
  }
  function getMaxPrice(list) {
    var prices = list.map(function (it) {
      return it.price;
    });
    return sortNumbers(prices).pop();
  }
  function sortNumbers(its) {
    return its.sort(function (a, b) {
      return a - b;
    });
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
  function removeAllFilters(target) {
    [].filter.call(inputs, function (input) {
      return input !== target;
    }).
    forEach(function (input) {
      input.checked = false;
    });
    choice = [];
    cardsState = 0;
  }

  window.filters = {
    init: function (goodsList) {
      goods = goodsList;
      categoryInit(goods);
      inputsCountInit();
      var MIN_PRICE = getMinPrice(goods);
      var MAX_PRICE = getMaxPrice(goods);
      var PRICES_DELTA = MAX_PRICE - MIN_PRICE;
      var PRICE_PERCENT = MAX_PRICE / PRICES_DELTA * 100;
      var PERCENT_DELTA = Math.round(PRICE_PERCENT - COORD_PERCENT);

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
        updateStateByPrice(ids);
        renderCards(choice);
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
        updateStateByPrice(ids);
        renderCards(choice);
        filterRangeCount.textContent = ids.length;
      }
      function updateStateByPrice(ids) {
        var filterState = inputsMap['price'];
        var isRange = cardsFilter.hasState(cardsState, filterState);
        if (isRange) {
          changeRangeFilter(ids, filterState);
        } else {
          addRangeFilter(ids, filterState);
        }
        Category[filterState] = ids;
      }
      function addRangeFilter(ids, filterState) {
        cardsState = cardsFilter.addState(cardsState, filterState);
        if (choice.length === 0) {
          choice = ids;
        } else {
          choice = getRepeats(choice, ids);
        }
        Category[cardsState] = choice;
      }
      function changeRangeFilter(ids, filterState) {
        var stateWithoutRange = cardsFilter.deleteState(cardsState, filterState);
        if (stateWithoutRange === 0) {
          choice = ids;
          Category[cardsState] = choice;
          return;
        }
        if (Category[stateWithoutRange] !== undefined) {
          var repeats = getRepeats(Category[stateWithoutRange], ids);
        } else {
          var newState = getNewState(stateWithoutRange);
          repeats = getRepeats(newState, ids);
        }
        if (repeats.length !== 0) {
          choice = repeats;
          Category[cardsState] = choice;
        } else {
          choice = [];
        }
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
      function categoryInit(items) {
        Category['0'] = [];
        Category['1'] = getGoodsByType('Мороженое');
        Category['2'] = getGoodsByType('Газировка');
        Category['4'] = getGoodsByType('Жевательная резинка');
        Category['8'] = getGoodsByType('Мармелад');
        Category['16'] = getGoodsByType('Зефир');
        Category['32'] = getGoodsByProp('sugar');
        Category['64'] = getGoodsByProp('vegetarian');
        Category['128'] = getGoodsByProp('gluten');
        Category['256'] = getFavsGoods();
        Category['512'] = getGoodsInStock();
        Category['1024'] = getGoodsInRange(items);
        Category['2047'] = getAllGoods();
        for (var key in Category) {
          if (key !== 0 && key !== 2047) {
            basicStates.push(key);
          }
        }
      }
      function inputsCountInit() {
        inputs.forEach(function (input, i) {
          if (i < 10) {
            var ids = Category[inputsMap[input.value]];
            var targetCount = input.nextElementSibling.nextElementSibling;
            targetCount.textContent = '(' + ids.length + ')';
          }
        });
        filterRangeCount.textContent = Category[inputsMap['price']].length;
      }
      function onCatalogFormClick(evt) {
        var target = evt.target;
        var key = target.value;
        var filterState = inputsMap[key];
        var ids = Category[filterState];
        // debugger;
        if (target.classList.contains('catalog__submit')) {
          evt.preventDefault();
          showAllCards();
          removeAllFilters(target);
          return;
        }
        if (filterState < 256) {
          if (target.checked) {
            addFilter(ids, filterState);
            renderCards(choice);
          } else {
            removeFilter(filterState);
            if (choice.length === 0) {
              window.filters.hideMessage();
              showAllCards();
              return;
            }
            renderCards(choice);
            return;
          }
        }
        if (filterState === 256 || filterState === 512) {
          if (target.checked) {
            removeAllFilters(target);
            if (filterState === 256) {
              var favourites = window.goods.checkFavouriteCount();
              choice = favourites;
              Category[filterState] = choice;
            } else {
              choice = Category[filterState];
            }
            cardsState = filterState;
            renderCards(choice);
            return;
          } else {
            showAllCards();
            cardsState = 0;
            choice = [];
            return;
          }
        }
      }
      function addFilter(ids, filterState) {
        if (choice.length !== 0) {
          var repeats = getRepeats(choice, ids);
          if (repeats.length !== 0) {
            choice = repeats;
          } else {
            choice = choice.concat(ids);
          }
        } else {
          choice = Category[filterState];
        }
        choice = sortNumbers(choice);
        cardsState = cardsFilter.addState(cardsState, filterState);
        if (Category[cardsState] === undefined) {
          Category[cardsState] = choice;
        }
      }
      function removeFilter(filterState) {
        cardsState = cardsFilter.deleteState(cardsState, filterState);
        if (Category[cardsState] !== undefined) {
          choice = Category[cardsState];
        } else {
          var newState = getNewState(cardsState);
          Category[cardsState] = newState;
          choice = Category[cardsState];
        }
      }
      function getRepeats(currentState, ids) {
        var stash = [];
        ids.forEach(function (id) {
          currentState.forEach(function (item) {
            if (id === item) {
              stash.push(id);
            }
          });
        });
        return stash;
      }
      function getNewState(state) {
        var ids = [];
        basicStates.forEach(function (key) {
          if (key !== 0 && key !== 512 && cardsFilter.hasState(state, key)) {
            if (ids.length !== 0) {
              var repeats = getRepeats(ids, Category[key]);
              if (repeats.length !== 0) {
                ids = repeats;
              } else {
                ids = ids.concat(Category[key]);
              }
            } else {
              ids = Category[key];
            }
          }
        });
        ids = sortNumbers(ids);
        return ids;
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
      function getAllGoods() {
        var ids = [];
        goods.forEach(function (item, index) {
          ids.push(index);
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
