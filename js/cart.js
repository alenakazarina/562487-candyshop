'use strict';

(function () {
  var order = {
    count: 0,
    total: 0,
    list: [],
    goodCount: []
  };
  var cartInit = false;
  var catalogCards = document.querySelector('.catalog__cards');
  var goodsCards = document.querySelector('.goods__cards');

  window.cart = {
    init: function (i) {
      if (!cartInit) {
        window.goods.list.forEach(function (good, index) {
          good.id = index;
        });
        cartInit = true;
      }
      var current = window.filters.actuals[i];
      var good = window.goods.list[current];
      if (good.amount === 0) {
        return;
      }
      updateOrder(current, 1);
      window.cart.checkAvailability(current);
      var index = checkInOrder(good);
      if (index !== undefined) {
        goodsCards.querySelectorAll('.card-order__count')[index].value++;
        order.goodCount[index]++;
        showTotal();
        return;
      }
      //  если нет в заказе
      order.list.push(good);
      order.goodCount.push(1);
      hideEmptyCart();
      window.render.createGood(good);
      showTotal();
      goodsCards.addEventListener('click', onOrderClick);
      var last = order.list.length - 1;
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
        if (window.goods.list[i].amount > 5) {
          card.classList.add('card--in-stock');
        }
        if (window.goods.list[i].amount >= 1 && window.goods.list[i].amount <= 5) {
          card.classList.add('card--little');
        }
        if (window.goods.list[i].amount === 0) {
          card.classList.add('card--soon');
        }
      }
      if (window.goods.list[i].amount > 0) {
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
  function checkInOrder(good) {
    for (var i = 0; i < order.list.length; i++) {
      if (order.list[i].id === good.id) {
        var j = i;
      }
    }
    return j;
  }
  function updateOrder(i, count) {
    var good = window.goods.list[i];
    window.goods.list[i].amount -= count;
    order.total += good.price * count;
    order.count += count;
    updateHeaderCart();
  }
  function cleanOrder() {
    order.goodCount = [];
    hideTotal();
    showEmptyCart();
  }
  function removeGood(i) {
    var good = order.list[i];
    order.goodCount = order.goodCount.filter(function (item, position) {
      return position !== i;
    });
    order.list = order.list.filter(function (item) {
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
    var j = 0;
    var cardsList = goodsCards.querySelectorAll('.goods_card');
    for (var i = 0; i < cardsList.length; i++) {
      if (card === cardsList[i]) {
        j = i;
      }
    }
    return j;
  }

  function onOrderClick(evt) {
    evt.preventDefault();
    var target = evt.target;
    var targetCard = window.cart.getClickCard(target, 3);
    var countInput = targetCard.querySelector('.card-order__count');
    var i = getCardIndex(targetCard);
    var good = order.list[i];
    var id = good.id;
    if (target.classList.contains('card-order__btn--increase')) {
      if (window.goods.list[id].amount === 0) {
        return;
      }
      updateOrder(id, 1);
      showTotal();
      order.goodCount[i]++;
      targetCard.querySelector('.card-order__count').value = order.goodCount[i];
    } else if (target.classList.contains('card-order__btn--decrease')) {
      order.goodCount[i]--;
      targetCard.querySelector('.card-order__count').value = order.goodCount[i];
      updateOrder(id, -1);
      if (order.goodCount[i] === 0) {
        goodsCards.removeChild(targetCard);
        removeGood(i);
        countInput.removeEventListener('focus', onGoodInputFocus);
        countInput.removeEventListener('blur', onGoodInputBlur);
      }
    } else if (target.classList.contains('card-order__close')) {
      targetCard = window.cart.getClickCard(target, 1);
      i = getCardIndex(targetCard);
      good = order.list[i];
      id = good.id;
      updateOrder(id, -order.goodCount[i]);
      goodsCards.removeChild(targetCard);
      removeGood(i);
      countInput = targetCard.querySelector('.card-order__count');
      countInput.removeEventListener('focus', onGoodInputFocus);
      countInput.removeEventListener('blur', onGoodInputBlur);
    } else {
      return;
    }
    window.cart.checkAvailability(id);
    if (order.list.length === 0) {
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
    var good = order.list[i];
    var id = good.id;
    var count = parseInt(target.value, 10);
    if (count === 0) {
      goodsCards.removeChild(targetCard);
      updateOrder(id, -order.goodCount[i]);
      order.goodCount = order.goodCount.filter(function (item, position) {
        return position !== i;
      });
      order.list = order.list.filter(function (item) {
        return item !== good;
      });
      target.removeEventListener('focus', onGoodInputFocus);
      target.removeEventListener('blur', onGoodInputBlur);
    } else if (!count) {
      target.value = order.goodCount[i];
      return;
    } else {
      var deltaGoodsInOrder = count - order.goodCount[i];
      var deltaGoods = 0;
      if (deltaGoodsInOrder === 0) {
        target.value = order.goodCount[i];
        return;
      }
      if (deltaGoodsInOrder > 0) {
        deltaGoods = window.goods.list[id].amount - deltaGoodsInOrder;
        if (deltaGoods < 0) {
          target.value = order.goodCount[i];
          return;
        }
      }
      target.value = count;
      order.goodCount[i] = count;
      updateOrder(id, deltaGoodsInOrder);
    }
    if (order.list.length === 0) {
      cleanOrder();
      return;
    }
    showTotal();
    window.cart.checkAvailability(id);
  }
})();
