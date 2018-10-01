'use strict';
(function () {
  var IMG_PATH = './img/cards/';
  var catalogCards = document.querySelector('.catalog__cards');
  var goodsCards = document.querySelector('.goods__cards');
  //  ---------------
  var form = document.querySelector('.buy__form');
  var deliverText = form.querySelector('.deliver__textarea');
  var cardTab = form.querySelector('.payment [type=radio]');
  var deliverTabs = form.querySelectorAll('.deliver__toggle [type=radio]');
  var deliverAddress = form.querySelectorAll('.deliver__courier [type=text]');
  var deliverStores = form.querySelectorAll('.deliver__stores [type=radio]');

  function createCard(item) {
    var template = document.querySelector('#card').content.querySelector('.catalog__card');
    var content = template.cloneNode(true);
    content.classList.remove('card--in-stock');
    content.classList.remove('card--little');
    content.classList.remove('card--soon');
    if (item.amount > 5) {
      content.classList.add('card--in-stock');
    }
    if (item.amount >= 1 && item.amount <= 5) {
      content.classList.add('card--little');
    }
    if (item.amount === 0) {
      content.classList.add('card--soon');
    }
    var picture = content.querySelector('.card__img');
    picture.src = IMG_PATH + item.picture;
    picture.alt = item.name;
    content.querySelector('.card__title').textContent = item.name;
    var priceElement = content.querySelector('.card__price');
    priceElement.childNodes[0].textContent = item.price + ' ';
    priceElement.childNodes[2].textContent = '/ ' + item.weight + ' Г';
    checkRating(content, item);
    content.querySelector('.star__count').textContent = item.rating.number;
    checkNutrition(content, item);
    content.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;
    return content;
  }
  function createGoodCard(name, imgSrc, price) {
    var template = document.querySelector('#card-order').content.querySelector('.goods_card');
    var content = template.cloneNode(true);
    var picture = content.querySelector('.card-order__img');
    picture.src = IMG_PATH + imgSrc;
    picture.alt = name;
    content.querySelector('.card-order__title').textContent = name;
    var priceElement = content.querySelector('.card-order__price');
    priceElement.textContent = price + ' ₽';
    var inputElement = content.querySelector('.card-order__count');
    var inputName = imgSrc.replace(IMG_PATH, '').replace('.jpg', '');
    inputElement.name = inputName;
    inputElement.id = /[^*__]+/.exec(inputElement.id)[0] + '__' + inputName;
    return content;
  }
  function renderCards(list) {
    var fragment = document.createDocumentFragment();
    list.forEach(function (item) {
      fragment.appendChild(createCard(item));
    });
    catalogCards.appendChild(fragment);
    return fragment;
  }
  function checkRating(element, good) {
    var ratingElement = element.querySelector('.stars__rating');
    ratingElement.classList.remove('stars__rating--one');
    ratingElement.classList.remove('stars__rating--two');
    ratingElement.classList.remove('stars__rating--three');
    ratingElement.classList.remove('stars__rating--four');
    ratingElement.classList.remove('stars__rating--five');
    switch (good.rating.value) {
      case 1:
        ratingElement.classList.add('stars__rating--one');
        break;
      case 2:
        ratingElement.classList.add('stars__rating--two');
        break;
      case 3:
        ratingElement.classList.add('stars__rating--three');
        break;
      case 4:
        ratingElement.classList.add('stars__rating--four');
        break;
      case 5:
        ratingElement.classList.add('stars__rating--five');
        break;
    }
  }
  function checkNutrition(element, good) {
    var nutritionElement = element.querySelector('.card__characteristic');
    if (good.nutritionFacts.sugar) {
      nutritionElement.textContent = 'Содержит сахар';
    } else {
      nutritionElement.textContent = 'Без сахара';
    }
  }
  window.render = {
    init: function (goods) {
      renderCards(goods);
      window.render.setInputsDisabled(true);
      window.filters.init();
    },
    createGood: function (good) {
      var goodCard = createGoodCard(good.name, good.picture, good.price);
      goodCard.querySelector('.card-order__count').value = 1;
      goodsCards.appendChild(goodCard);
    },
    setInputsDisabled: function (status) {
      if (status) {
        form.querySelectorAll('input').forEach(function (it) {
          it.disabled = true;
        });
        deliverText.disabled = true;
      } else {
        form.querySelectorAll('.contact-data input').forEach(function (it) {
          it.disabled = false;
        });
        form.querySelectorAll('.payment input').forEach(function (it) {
          it.disabled = status;
        });
        if (!cardTab.checked) {
          form.querySelectorAll('.payment .text-input').forEach(function (it) {
            it.disabled = true;
          });
        }
        deliverTabs.forEach(function (it) {
          it.disabled = false;
        });
        if (deliverTabs[0].checked) {
          deliverStores.forEach(function (it) {
            it.disabled = false;
          });
          deliverAddress.forEach(function (it) {
            it.disabled = true;
          });
          deliverText.disabled = true;
        } else {
          deliverStores.forEach(function (it) {
            it.disabled = true;
          });
          deliverAddress.forEach(function (it) {
            it.disabled = false;
          });
          deliverText.disabled = false;
        }
      }
    },
  };
})();
