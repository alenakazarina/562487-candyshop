'use strict';
(function () {
  var order = {
    count: 0,
    total: 0,
    items: [],
    quantities: []
  };
  var cartInit = false;
  var catalogCards = document.querySelector('.catalog__cards');
  var goodsCards = document.querySelector('.goods__cards');
  function checkInOrder(good) {
    for (var i = 0; i < order.items.length; i++) {
      if (order.items[i].id === good.id) {
        return i;
      }
    }
    return -1;
  }
  function updateOrder(i, count) {
    var good = window.goods.items[i];
    window.goods.items[i].amount -= count;
    order.total += good.price * count;
    order.count += count;
    updateHeaderCart();
  }
  function cleanOrder() {
    order.quantities = [];
    hideTotal();
    showEmptyCart();
  }
  function removeGood(i) {
    var good = order.items[i];
    order.quantities = order.quantities.filter(function (item, position) {
      return position !== i;
    });
    order.items = order.items.filter(function (item) {
      return item !== good;
    });
  }
  function showTotal() {
    var total = goodsCards.nextElementSibling;
    var totals = total.querySelector('.goods__total-count').childNodes;
    if (order.count === 0) {
      totals[0].textContent = 'Итого за ' + order.count + ' товаров';
    }
    if (order.count === 1) {
      totals[0].textContent = 'Итого за ' + order.count + ' товар';
    }
    if (order.count > 1 && order.count < 5) {
      totals[0].textContent = 'Итого за ' + order.count + ' товара';
    }
    if (order.count >= 5) {
      totals[0].textContent = 'Итого за ' + order.count + ' товаров';
    }
    totals[1].textContent = order.total + ' ₽';
    total.classList.remove('visually-hidden');
  }
  function hideTotal() {
    var total = goodsCards.nextElementSibling;
    var totals = total.querySelector('.goods__total-count').childNodes;
    totals[0].textContent = 'Итого за 0 товаров: ';
    totals[1].textContent = '0 ₽';
    total.classList.add('visually-hidden');
  }
  function showEmptyCart() {
    goodsCards.classList.add('goods__cards--empty');
    goodsCards.querySelector('.goods__card-empty').style.display = 'block';
    window.render.setInputsDisabled(true);
  }
  function hideEmptyCart() {
    goodsCards.classList.remove('goods__cards--empty');
    goodsCards.querySelector('.goods__card-empty').style.display = 'none';
    goodsCards.nextElementSibling.querySelector('.goods__order-link').classList.remove('goods__order-link--disabled');
    window.render.setInputsDisabled(false);
  }
  function updateHeaderCart() {
    var headerBasket = document.querySelector('.main-header__basket');
    if (order.count === 0) {
      headerBasket.textContent = 'В корзине ничего нет';
    }
    if (order.count === 1) {
      headerBasket.textContent = 'В корзине ' + order.count + ' товар';
    }
    if (order.count > 1 && order.count < 5) {
      headerBasket.textContent = 'В корзине ' + order.count + ' товара';
    }
    if (order.count >= 5) {
      headerBasket.textContent = 'В корзине ' + order.count + ' товаров';
    }
  }
  function getCardIndex(card) {
    var cardsList = goodsCards.querySelectorAll('.goods_card');
    return [].map.call(cardsList, function (it) {
      return it;
    }).indexOf(card);
  }
  function onOrderClick(evt) {
    evt.preventDefault();
    var target = evt.target;
    var increase = target.classList.contains('card-order__btn--increase') ? true : false;
    var decrease = target.classList.contains('card-order__btn--decrease') ? true : false;
    var close = target.classList.contains('card-order__close') ? true : false;
    if (increase || decrease) {
      var targetCard = window.cart.getClickCard(target, 3);
    } else if (close) {
      targetCard = window.cart.getClickCard(target, 1);
    } else {
      return;
    }
    var countInput = targetCard.querySelector('.card-order__count');
    var i = getCardIndex(targetCard);
    var good = order.items[i];
    var id = good.id;
    if (increase) {
      if (window.goods.items[id].amount === 0) {
        return;
      }
      updateOrder(id, 1);
      showTotal();
      order.quantities[i]++;
      targetCard.querySelector('.card-order__count').value = order.quantities[i];
    } else if (decrease) {
      order.quantities[i]--;
      targetCard.querySelector('.card-order__count').value = order.quantities[i];
      updateOrder(id, -1);
      if (order.quantities[i] === 0) {
        goodsCards.removeChild(targetCard);
        removeGood(i);
        countInput.removeEventListener('focus', onGoodInputFocus);
        countInput.removeEventListener('blur', onGoodInputBlur);
      }
    } else if (close) {
      targetCard = window.cart.getClickCard(target, 1);
      i = getCardIndex(targetCard);
      good = order.items[i];
      id = good.id;
      updateOrder(id, -order.quantities[i]);
      goodsCards.removeChild(targetCard);
      removeGood(i);
      countInput = targetCard.querySelector('.card-order__count');
      countInput.removeEventListener('focus', onGoodInputFocus);
      countInput.removeEventListener('blur', onGoodInputBlur);
    } else {
      return;
    }
    window.cart.checkAvailability(id);
    if (order.items.length === 0) {
      cleanOrder();
      return;
    }
    showTotal();
  }
  function onGoodInputFocus(evt) {
    var target = evt.target;
    target.addEventListener('blur', onGoodInputBlur);
  }
  function onGoodInputBlur(evt) {
    var target = evt.target;
    var targetCard = window.cart.getClickCard(target, 4);
    var i = getCardIndex(targetCard);
    var good = order.items[i];
    var id = good.id;
    var count = parseInt(target.value, 10);
    if (count === 0) {
      goodsCards.removeChild(targetCard);
      updateOrder(id, -order.quantities[i]);
      order.quantities = order.quantities.filter(function (item, position) {
        return position !== i;
      });
      order.items = order.items.filter(function (item) {
        return item !== good;
      });
      target.removeEventListener('focus', onGoodInputFocus);
      target.removeEventListener('blur', onGoodInputBlur);
    } else if (!count) {
      target.value = order.quantities[i];
      return;
    } else {
      var deltaGoodsInOrder = count - order.quantities[i];
      var deltaGoods = 0;
      if (deltaGoodsInOrder === 0) {
        target.value = order.quantities[i];
        return;
      }
      if (deltaGoodsInOrder > 0) {
        deltaGoods = window.goods.items[id].amount - deltaGoodsInOrder;
        if (deltaGoods < 0) {
          target.value = order.quantities[i];
          return;
        }
      }
      target.value = count;
      order.quantities[i] = count;
      updateOrder(id, deltaGoodsInOrder);
    }
    if (order.items.length === 0) {
      cleanOrder();
      return;
    }
    showTotal();
    window.cart.checkAvailability(id);
  }
  window.cart = {
    init: function (i) {
      if (!cartInit) {
        window.goods.items.forEach(function (good, index) {
          good.id = index;
        });
        cartInit = true;
      }
      var current = window.filters.actuals[i];
      var good = window.goods.items[current];
      if (good.amount === 0) {
        return;
      }
      updateOrder(current, 1);
      window.cart.checkAvailability(current);
      var index = checkInOrder(good);
      if (index !== -1) {
        goodsCards.querySelectorAll('.card-order__count')[index].value++;
        order.quantities[index]++;
        showTotal();
        return;
      }
      order.items.push(good);
      order.quantities.push(1);
      hideEmptyCart();
      window.render.createGood(good);
      showTotal();
      goodsCards.addEventListener('click', onOrderClick);
      var last = order.items.length - 1;
      var goodInput = goodsCards.querySelectorAll('.goods_card')[last].querySelector('.card-order__count');
      goodInput.addEventListener('focus', onGoodInputFocus);
    },
    checkAvailability: function (i) {
      var inState = window.filters.actuals.indexOf(i);
      if (inState !== -1) {
        var card = catalogCards.querySelectorAll('.catalog__card')[inState];
        card.classList.remove('card--in-stock');
        card.classList.remove('card--little');
        card.classList.remove('card--soon');
        if (window.goods.items[i].amount > 5) {
          card.classList.add('card--in-stock');
        }
        if (window.goods.items[i].amount >= 1 && window.goods.items[i].amount <= 5) {
          card.classList.add('card--little');
        }
        if (window.goods.items[i].amount === 0) {
          card.classList.add('card--soon');
        }
      }
      if (window.goods.items[i].amount > 0) {
        window.filters.updateInStock(i, true);
      } else {
        window.filters.updateInStock(i, false);
      }
    },
    getClickCard: function (item, count) {
      var parent = item.parentNode;
      while (count !== 1) {
        parent = parent.parentNode;
        count--;
      }
      return parent;
    }
  };
})();
