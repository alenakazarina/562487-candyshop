'use strict';

(function () {

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
        var index = i;
      }
    }
    return index;
  }
  function addGoodToOrder(good) {
    good.amount--;
    order.total += good.price;
    order.count++;
    updateHeaderCart();
  }
  function removeGoodFromOrder(good) {
    var id = good.id;
    window.goods.list[id].amount++;
    order.total -= good.price;
    order.count--;
    updateHeaderCart();
  }
  function addAllGoodsToOrder(good, deltaGoods) {
    var id = good.id;
    window.goods.list[id].amount -= deltaGoods;
    order.total += good.price * deltaGoods;
    order.count += deltaGoods;
    updateHeaderCart();
  }
  function removeAllGoodsFromOrder(good, count) {
    var id = good.id;
    window.goods.list[id].amount += count;
    order.total -= good.price * count;
    order.count -= count;
    order.list = order.list.filter(function (item) {
      return item !== good;
    });
    updateHeaderCart();
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
    disableOrderInputs();
  }
  function hideEmptyCart() {
    goodsCards.classList.remove('goods__cards--empty');
    goodsCards.querySelector('.goods__card-empty').style.display = 'none';
    goodsCards.nextElementSibling.querySelector('.goods__order-link').classList.remove('goods__order-link--disabled');
    removeDisabledOrderInputs();
  }
  function disableOrderInputs() {
    var items = document.querySelectorAll('.contact-data__inputs input');
    items.forEach(function (item) {
      item.disabled = true;
    });
  }
  function removeDisabledOrderInputs() {
    var items = document.querySelectorAll('.contact-data__inputs input');
    items.forEach(function (item) {
      item.disabled = false;
    });
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
    var index = 0;
    var cardsList = goodsCards.querySelectorAll('.goods_card');
    for (var i = 0; i < cardsList.length; i++) {
      if (card === cardsList[i]) {
        index = i;
      }
    }
    return index;
  }

  //  handlers
  function onOrderClick(evt) {
    evt.preventDefault();
    var target = evt.target;

    var targetCard = window.goods.getClickCard(target, 3);
    var index = getCardIndex(targetCard);
    var good = order.list[index];
    var id = good.id;
    //  клик увеличить
    if (target.classList.contains('card-order__btn--increase')) {
      if (window.goods.list[id].amount === 0) {
        return;
      }
      addGoodToOrder(good);
      showTotal();
      window.goods.checkAvailability(catalogCards.querySelectorAll('.catalog__card')[id], good);
      order.goodCount[index]++;
      targetCard.querySelector('.card-order__count').value = order.goodCount[index];
      return;
    }
    //  клик уменьшить
    if (target.classList.contains('card-order__btn--decrease')) {
      order.goodCount[index]--;
      targetCard.querySelector('.card-order__count').value = order.goodCount[index];
      if (order.goodCount[index] === 0) {
        goodsCards.removeChild(targetCard);
        removeAllGoodsFromOrder(good, 1);
      } else {
        removeGoodFromOrder(good);
      }
      window.goods.checkAvailability(catalogCards.querySelectorAll('.catalog__card')[id], good);
      if (order.list.length === 0) {
        hideTotal();
        showEmptyCart();
        return;
      }
      showTotal();
      return;
    }
    //  клик по close
    if (target.classList.contains('card-order__close')) {
      targetCard = window.goods.getClickCard(target, 1);
      index = getCardIndex(targetCard);
      good = order.list[index];
      id = good.id;
      goodsCards.removeChild(targetCard);
      removeAllGoodsFromOrder(good, order.goodCount[index]);
      window.goods.checkAvailability(catalogCards.querySelectorAll('.catalog__card')[id], good);
      if (order.list.length === 0) {
        hideTotal();
        showEmptyCart();
        return;
      }
      showTotal();
      return;
    }
    //  клик по инпуту
    if (target.classList.contains('card-order__count')) {
      target.addEventListener('change', onGoodInputChange);
      target.addEventListener('blur', onGoodInputBlur);
    }
  }
  function onGoodInputChange(evt) {
    var target = evt.target;
    var targetCard = window.goods.getClickCard(target, 4);
    var index = getCardIndex(targetCard);
    var good = order.list[index];
    var id = good.id;
    var count = parseInt(target.value, 10);
    if (count === 0) {
      goodsCards.removeChild(targetCard);
      removeAllGoodsFromOrder(good, order.goodCount[index]);
      window.goods.checkAvailability(catalogCards.querySelectorAll('.catalog__card')[id], good);
      if (order.list.length === 0) {
        hideTotal();
        showEmptyCart();
        return;
      }
      showTotal();
      return;
    }
    if (!count) {
      target.value = order.goodCount[index];
      return;
    }
    if (count) {
      var deltaGoodsInOrder = count - order.goodCount[index];
      var deltaGoods = good.amount - deltaGoodsInOrder;
      if (deltaGoods <= 0) {
        target.value = order.goodCount[index];
        return;
      }
      order.goodCount[index] = count;
      addAllGoodsToOrder(good, deltaGoodsInOrder);
      showTotal();
    }
  }
  function onGoodInputBlur(evt) {
    var target = evt.target;
    target.removeEventListener('change', onGoodInputChange);
  }

  //  start
  var catalogCards = document.querySelector('.catalog__cards');
  var goodsCards = document.querySelector('.goods__cards');
  var order = {
    count: 0,
    total: 0,
    list: [],
    goodCount: []
  };

  //  listeners
  goodsCards.addEventListener('click', onOrderClick);


  //  export
  window.cart = {
    updateOrder: function (good) {
      addGoodToOrder(good);
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
    }
  };
})();
