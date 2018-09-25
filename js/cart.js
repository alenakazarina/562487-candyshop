'use strict';

(function () {
  var order = {
    count: 0,
    total: 0,
    list: [],
    goodCount: []
  };
  var cartInit = false;
  var list = [];
  var catalogCards = document.querySelector('.catalog__cards');
  var goodsCards = document.querySelector('.goods__cards');
  //  start from goods
  window.cart = {
    updateOrder: function (good, goodsList) {
      if (!cartInit) {
        list = goodsList;
        cartInit = true;
      }
      addGoodsToOrder(good, 1);
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
      renderGoodCard(good);
      showTotal();
      //  listeners
      goodsCards.addEventListener('click', onOrderClick);
      var last = order.list.length - 1;
      var goodInput = goodsCards.querySelectorAll('.goods_card')[last].querySelector('.card-order__count');
      goodInput.addEventListener('focus', onGoodInputFocus);
    }
  };
  function createGoodCard(name, imgSrc, price) {
    var template = document.querySelector('#card-order').content.querySelector('.goods_card');
    var content = template.cloneNode(true);
    //  picture
    var picture = content.querySelector('.card-order__img');
    picture.src = imgSrc;
    picture.alt = name;
    //  name
    content.querySelector('.card-order__title').textContent = name;
    //  price
    var priceElement = content.querySelector('.card-order__price');
    priceElement.textContent = price + ' ₽';
    //  input
    var inputElement = content.querySelector('.card-order__count');
    var inputName = imgSrc.replace(window.goods.IMG_PATH, '').replace('.jpg', '');
    inputElement.name = inputName;
    inputElement.id = /[^*__]+/.exec(inputElement.id)[0] + '__' + inputName;
    return content;
  }
  function renderGoodCard(good) {
    var goodCard = createGoodCard(good.name, good.picture, good.price);
    goodCard.querySelector('.card-order__count').value = 1;
    goodsCards.appendChild(goodCard);
  }
  //  order handling
  function checkInOrder(good) {
    for (var i = 0; i < order.list.length; i++) {
      if (order.list[i].id === good.id) {
        var j = i;
      }
    }
    return j;
  }
  function addGoodsToOrder(good, count) {
    var id = good.id;
    list[id].amount -= count;
    order.total += good.price * count;
    order.count += count;
    updateHeaderCart();
  }
  function removeGoodFromOrder(good) {
    var id = good.id;
    list[id].amount++;
    order.total -= good.price;
    order.count--;
    updateHeaderCart();
  }
  function removeAllGoodsFromOrder(good, count) {
    var id = good.id;
    var i = checkInOrder(good);
    list[id].amount += count;
    order.total -= good.price * count;
    order.count -= count;
    order.goodCount = order.goodCount.filter(function (item, position) {
      return position !== i;
    });
    order.list = order.list.filter(function (item) {
      return item !== good;
    });
    updateHeaderCart();
  }
  function cleanOrder() {
    order.goodCount = [];
    hideTotal();
    showEmptyCart();
  }
  //  total
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
  //  empty cart + disabled inputs
  function showEmptyCart() {
    goodsCards.classList.add('goods__cards--empty');
    goodsCards.querySelector('.goods__card-empty').style.display = 'block';
    window.goods.setInputsDisabled(true);
  }
  function hideEmptyCart() {
    goodsCards.classList.remove('goods__cards--empty');
    goodsCards.querySelector('.goods__card-empty').style.display = 'none';
    goodsCards.nextElementSibling.querySelector('.goods__order-link').classList.remove('goods__order-link--disabled');
    window.goods.setInputsDisabled(false);
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
  //  helpers
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

  //  handlers
  function onOrderClick(evt) {
    evt.preventDefault();
    var target = evt.target;
    var targetCard = window.goods.getClickCard(target, 3);
    var countInput = targetCard.querySelector('.card-order__count');
    var i = getCardIndex(targetCard);
    var good = order.list[i];
    var id = good.id;
    //  клик увеличить
    if (target.classList.contains('card-order__btn--increase')) {
      if (list[id].amount === 0) {
        return;
      }
      addGoodsToOrder(good, 1);
      showTotal();
      window.goods.checkAvailability(catalogCards.querySelectorAll('.catalog__card')[id], good);
      order.goodCount[i]++;
      targetCard.querySelector('.card-order__count').value = order.goodCount[i];
      return;
    }
    //  клик уменьшить
    if (target.classList.contains('card-order__btn--decrease')) {
      order.goodCount[i]--;
      targetCard.querySelector('.card-order__count').value = order.goodCount[i];
      if (order.goodCount[i] === 0) {
        goodsCards.removeChild(targetCard);
        removeAllGoodsFromOrder(good, 1);
        //  listeners
        countInput.removeEventListener('focus', onGoodInputFocus);
        countInput.removeEventListener('blur', onGoodInputBlur);
      } else {
        removeGoodFromOrder(good);
      }
      window.goods.checkAvailability(catalogCards.querySelectorAll('.catalog__card')[id], good);
      if (order.list.length === 0) {
        cleanOrder();
        return;
      }
      showTotal();
      return;
    }
    //  клик по close
    if (target.classList.contains('card-order__close')) {
      targetCard = window.goods.getClickCard(target, 1);
      i = getCardIndex(targetCard);
      good = order.list[i];
      id = good.id;
      goodsCards.removeChild(targetCard);
      removeAllGoodsFromOrder(good, order.goodCount[i]);
      window.goods.checkAvailability(catalogCards.querySelectorAll('.catalog__card')[id], good);
      //  listeners
      countInput = targetCard.querySelector('.card-order__count');
      countInput.removeEventListener('focus', onGoodInputFocus);
      countInput.removeEventListener('blur', onGoodInputBlur);
      if (order.list.length === 0) {
        cleanOrder();
        return;
      }
      showTotal();
      return;
    }
  }
  function onGoodInputFocus(evt) {
    var target = evt.target;
    target.addEventListener('blur', onGoodInputBlur);
  }
  function onGoodInputBlur(evt) {
    var target = evt.target;
    var targetCard = window.goods.getClickCard(target, 4);
    var i = getCardIndex(targetCard);
    var good = order.list[i];
    var id = good.id;
    var count = parseInt(target.value, 10);
    if (count === 0) {
      goodsCards.removeChild(targetCard);
      removeAllGoodsFromOrder(good, order.goodCount[i]);
      window.goods.checkAvailability(catalogCards.querySelectorAll('.catalog__card')[id], good);
      //  listeners
      target.removeEventListener('focus', onGoodInputFocus);
      target.removeEventListener('blur', onGoodInputBlur);
      if (order.list.length === 0) {
        cleanOrder();
        return;
      }
      showTotal();
      return;
    }
    if (!count) {
      target.value = order.goodCount[i];
      return;
    }
    if (count) {
      var deltaGoodsInOrder = count - order.goodCount[i];
      var deltaGoods = 0;
      if (deltaGoodsInOrder === 0) {
        target.value = order.goodCount[i];
        return;
      }
      if (deltaGoodsInOrder > 0) {
        deltaGoods = list[id].amount - deltaGoodsInOrder;
        if (deltaGoods <= 0) {
          target.value = order.goodCount[i];
          return;
        }
      }
      target.value = count;
      order.goodCount[i] = count;
      addGoodsToOrder(good, deltaGoodsInOrder);
      showTotal();
      window.goods.checkAvailability(catalogCards.querySelectorAll('.catalog__card')[id], good);
    }
  }
})();
