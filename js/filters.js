'use strict';
(function () {
  var BUTTON_WIDTH;
  var BUTTON_HALF_WIDTH;
  var RANGE_WIDTH;
  var MIN;
  var MAX;
  var RANGE_OFFSET;
  var COORD_PERCENT;
  var ALL_CARDS;

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

  BUTTON_WIDTH = filterRangeMin.clientWidth;
  BUTTON_HALF_WIDTH = BUTTON_WIDTH / 2;
  RANGE_WIDTH = filterRange.clientWidth;
  MIN = 0;
  MAX = RANGE_WIDTH - BUTTON_WIDTH;
  RANGE_OFFSET = priceRangeFilter.offsetLeft;
  COORD_PERCENT = (MAX + BUTTON_HALF_WIDTH) / MAX * 100;
  var Category = {};
  var price = {};
  var goods = [];
  var catalogTree;
  var catalogTreeCards;
  var sort = {
    price: function (cheap) {
      var currents = window.filters.actuals;
      var sorted = currents.map(function (it) {
        return {index: it, price: goods[it].price};
      }).sort(function (a, b) {
        return a.price - b.price;
      }).map(function (it) {
        return it.index;
      });
      if (!cheap) {
        sorted = sorted.reverse();
      }
      return sorted;
    },
    rate: function () {
      var currents = window.filters.actuals;
      var sorted = currents.map(function (i) {
        return {
          index: i,
          value: goods[i].rating.value,
          number: goods[i].rating.number
        };
      }).sort(function (a, b) {
        return (b.value - a.value) || (b.number - a.number);
      }).map(function (it) {
        return it.index;
      });
      return sorted;
    }
  };
  var filter = {
    state: 0,
    addState: function (state) {
      this.state = this.state | state;
    },
    deleteState: function (state) {
      this.state = this.state & ~state;
    },
    hasState: function (state) {
      return Boolean(this.state & state);
    },
    getStateObj: function (names) {
      var obj = {
        'none': 0x00
      };
      names.forEach(function (name, i) {
        obj[name] = Math.pow(2, i);
      });
      return obj;
    }
  };
  var inputs = catalogForm.querySelectorAll('input');
  var inputVals = [].map.call(inputs, function (it) {
    return it.value;
  }).slice(0, 10);
  inputVals.push('price');
  var inputsMap = filter.getStateObj(inputVals);
  function sortNumbers(its) {
    return its.sort(function (a, b) {
      return a - b;
    });
  }
  function renderCards() {
    var show = window.debounce(function () {
      var currents = window.filters.actuals;
      catalog.textContent = '';
      if (currents.length === 0) {
        showMessage();
        return;
      }
      var favs = Category['256'];
      currents.forEach(function (id) {
        var card = catalogTreeCards[id];
        if (favs.includes(id)) {
          card.querySelector('.card__btn-favorite').classList.add('card__btn-favorite--selected');
        }
        card.classList.remove('card--in-stock');
        card.classList.remove('card--little');
        card.classList.remove('card--soon');
        if (window.goods.items[id].amount > 5) {
          card.classList.add('card--in-stock');
        }
        if (window.goods.items[id].amount >= 1 && window.goods.items[id].amount <= 5) {
          card.classList.add('card--little');
        }
        if (window.goods.items[id].amount === 0) {
          card.classList.add('card--soon');
        }
        catalog.appendChild(card);
      });
    }, 500);
    show();
  }
  function showMessage() {
    var template = document.querySelector('#empty-filters').content;
    var content = template.cloneNode(true);
    catalog.appendChild(content);
  }
  window.filters = {
    actuals: [],
    init: function () {
      goods = window.goods.items;
      categoryInit(goods);
      inputsCountInit();
      window.filters.actuals = ALL_CARDS;
      catalogTree = document.querySelector('.catalog__cards').cloneNode(true);
      catalogTreeCards = catalogTree.querySelectorAll('.catalog__card');
      price.min = getMinPrice(goods);
      price.max = getMaxPrice(goods);
      price.delta = price.max - price.min;
      price.percent = price.max / price.delta * 100;
      var PERCENT_DELTA = Math.round(price.percent - COORD_PERCENT);
      sort.check = function () {
        var sortType = [].filter.call(inputs, function (it) {
          return it.type === 'radio' && it.checked;
        })[0];
        if (sortType.value === 'popular') {
          window.filters.actuals = sortNumbers(window.filters.actuals);
        }
        if (sortType.value === 'expensive') {
          window.filters.actuals = sort.price(false);
        }
        if (sortType.value === 'cheep') {
          window.filters.actuals = sort.price(true);
        }
        if (sortType.value === 'rating') {
          window.filters.actuals = sort.rate(true);
        }
      };
      priceRangeFilter.addEventListener('mousedown', onRangeStartDrag);
      catalogForm.addEventListener('change', onFilterChange);
      catalogForm.addEventListener('submit', onFilterSubmit);
      function categoryInit() {
        Category['0'] = [];
        Category['1'] = getGoodsByType('Мороженое');
        Category['2'] = getGoodsByType('Газировка');
        Category['4'] = getGoodsByType('Жевательная резинка');
        Category['8'] = getGoodsByType('Мармелад');
        Category['16'] = getGoodsByType('Зефир');
        Category['32'] = getGoodsByProp('sugar');
        Category['64'] = getGoodsByProp('vegetarian');
        Category['128'] = getGoodsByProp('gluten');
        Category['256'] = [];
        Category['512'] = getGoodsInStock();
        Category['1024'] = getGoodsInRange();
        Category['2047'] = getAllGoods();
        ALL_CARDS = Category['2047'];
      }
      function inputsCountInit() {
        inputs.forEach(function (input, i) {
          if (i < 10) {
            var categoryIds = Category[inputsMap[input.value]];
            var targetCount = input.nextElementSibling.nextElementSibling;
            targetCount.textContent = '(' + categoryIds.length + ')';
          }
        });
        filterRangeCount.textContent = Category[inputsMap['price']].length;
      }
      function onRangeStartDrag(evt) {
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
      }
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
        var priceValue = (centerCoord / MAX * 100 + PERCENT_DELTA) / 100 * price.delta;
        filterRangeMaxPrice.textContent = Math.round(priceValue);
        var filteredIds = getGoodsInRange();
        Category[inputsMap['price']] = filteredIds;
        filter.addState(inputsMap['price']);
        window.filters.actuals = updateFilter();
        sort.check();
        renderCards();
        filterRangeCount.textContent = filteredIds.length;
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
        var priceValue = (centerCoord / MAX * 100 + PERCENT_DELTA) / 100 * price.delta;
        filterRangeMinPrice.textContent = Math.round(priceValue);
        var filteredIds = getGoodsInRange();
        Category[inputsMap['price']] = filteredIds;
        filter.addState(inputsMap['price']);
        window.filters.actuals = updateFilter();
        sort.check();
        renderCards();
        filterRangeCount.textContent = filteredIds.length;
      }
      function resetRangeToDefault() {
        filterRangeMax.style.left = MAX + 'px';
        filterRangeMin.style.left = MIN + 'px';
        filterRangeFill.style.left = 0 + '%';
        filterRangeFill.style.right = 0 + '%';
        var filteredIds = ALL_CARDS;
        filterRangeMaxPrice.textContent = getMaxPrice();
        filterRangeMinPrice.textContent = getMinPrice();
        filterRangeCount.textContent = filteredIds.length;
      }
      function getMinPrice() {
        var prices = window.goods.items.map(function (it) {
          return it.price;
        });
        return sortNumbers(prices).shift();
      }
      function getMaxPrice() {
        var prices = window.goods.items.map(function (it) {
          return it.price;
        });
        return sortNumbers(prices).pop();
      }
      function getGoodsInRange() {
        var filteredIds = [];
        var minPrice = parseInt(filterRangeMinPrice.textContent, 10);
        var maxPrice = parseInt(filterRangeMaxPrice.textContent, 10);
        window.goods.items.forEach(function (it, i) {
          if (it.price >= minPrice && it.price <= maxPrice) {
            filteredIds.push(i);
          }
        });
        return filteredIds;
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
      function onFilterSubmit(evt) {
        evt.preventDefault();
        inputs.forEach(function (input) {
          input.disabled = false;
          if (input.value === 'popular') {
            input.checked = true;
          } else {
            input.checked = false;
          }
        });
        priceRangeFilter.addEventListener('mousedown', onRangeStartDrag);
        filter.state = 0;
        window.filters.actuals = ALL_CARDS;
        renderCards();
      }
      function onFilterChange(evt) {
        var target = evt.target;
        if (target.type === 'checkbox') {
          var filterState = target.value;
          var state = inputsMap[filterState];
          if (target.checked) {
            if (state < 256) {
              filter.addState(state);
            } else {
              setAllFilters(target, false);
              filter.state = state;
            }
          } else {
            if (state < 256) {
              filter.deleteState(state);
            } else {
              filter.state = 0;
            }
            if (state === 256 || state === 512) {
              setAllFilters(target, true);
            }
          }
          if (filter.state === 0) {
            window.filters.actuals = ALL_CARDS;
          } else {
            if (Category[filter.state] === undefined) {
              window.filters.actuals = updateFilter();
            } else {
              window.filters.actuals = Category[filter.state];
            }
          }
        }
        sort.check();
        renderCards();
      }
      function setAllFilters(target, active) {
        var inputsToSet = [].filter.call(inputs, function (input) {
          return input !== target;
        });
        if (!active) {
          inputsToSet.forEach(function (input, i) {
            if (i < 8) {
              input.checked = false;
              input.disabled = true;
            }
            if (i === 8) {
              input.checked = false;
            }
          });
          resetRangeToDefault();
          priceRangeFilter.removeEventListener('mousedown', onRangeStartDrag);
        } else {
          inputsToSet.forEach(function (input, i) {
            if (i < 9) {
              input.checked = false;
              input.disabled = false;
            }
          });
          priceRangeFilter.addEventListener('mousedown', onRangeStartDrag);
        }
      }
      function updateFilter() {
        var ids = [];
        for (var key in Category) {
          if (key !== 0 && key !== '2047') {
            key = parseInt(key, 10);
            if (filter.hasState(key)) {
              if (key < 32) {
                ids = ids.concat(Category[key]);
              } else {
                if (ids.length === 0) {
                  ids = ids.concat(Category[key]);
                } else {
                  ids = getRepeats(Category[key], ids);
                }
              }
            }
          }
        }
        return sortNumbers(ids);
      }
      function getRepeats(arr1, arr2) {
        var i;
        var ids = [];
        if (arr1.length === 0 && arr2.length === 0) {
          return [];
        }
        arr1.forEach(function (it) {
          i = arr2.indexOf(it);
          if (i !== -1) {
            ids.push(it);
          }
        });
        return ids.sort(function (a, b) {
          return a - b;
        });
      }
      function getGoodsByType(type) {
        var typeGoods = [];
        window.goods.items.forEach(function (good, i) {
          if (good.kind === type) {
            typeGoods.push(i);
          }
        });
        return typeGoods;
      }
      function getGoodsByProp(property) {
        var specialGoods = [];
        if (property === 'vegetarian') {
          window.goods.items.forEach(function (good, i) {
            if (good.nutritionFacts[property]) {
              specialGoods.push(i);
            }
          });
        } else {
          window.goods.items.forEach(function (good, i) {
            if (!good.nutritionFacts[property]) {
              specialGoods.push(i);
            }
          });
        }
        return specialGoods;
      }
      function getGoodsInStock() {
        return window.goods.items.filter(function (good) {
          return good.amount !== 0;
        }).map(function (it, i) {
          return i;
        });
      }
      function getAllGoods() {
        return window.goods.items.map(function (it, i) {
          return i;
        });
      }
    },
    updateFavorite: function (i) {
      var state = window.filters.actuals;
      var favGood = state[i];
      var favorite = inputsMap['favorite'];
      var inFavs = Category[favorite].includes(favGood);
      if (inFavs) {
        Category[favorite] = Category[favorite].filter(function (it) {
          return it !== favGood;
        });
      } else {
        Category[favorite].push(favGood);
        if (Category[favorite].length > 1) {
          Category[favorite] = sortNumbers(Category[favorite]);
        }
      }
      var filterFavsCount = document.querySelector('#filter-favorite').nextElementSibling.nextElementSibling;
      filterFavsCount.textContent = '(' + Category['256'].length + ')';
    },
    updateInStock: function (i, add) {
      var available = inputsMap['availability'];
      if (!add) {
        Category[available] = Category[available].filter(function (it) {
          return it !== i;
        });
      } else {
        if (!Category[available].includes(i)) {
          Category[available].push(i);
        }
      }
      if (filter.state === available) {
        window.filters.actuals = Category[available];
        sort.check();
        renderCards();
      }
      var filterInStockCount = document.querySelector('#filter-availability').nextElementSibling.nextElementSibling;
      filterInStockCount.textContent = '(' + Category['512'].length + ')';
    }
  };
})();
