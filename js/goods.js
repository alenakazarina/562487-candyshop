'use strict';

(function () {
  var catalogCards = document.querySelector('.catalog__cards');
  var form = document.querySelector('.buy__form');
  //  export
  window.goods = {
    IMG_PATH: './img/cards/',
    init: function (data) {
      //  start
      var goodsList = createGoods(data);
      renderCards(goodsList);
      catalogCards.addEventListener('click', function (evt) {
        evt.preventDefault();
        onCatalogClick(evt.target, goodsList);
      });
      window.goods.setInputsDisabled(true);
      window.filters.init(goodsList);
    },
    getClickCard: function (item, count) {
      var parent = item.parentNode;
      while (count !== 1) {
        parent = parent.parentNode;
        count--;
      }
      return parent;
    },
    checkAvailability: function (element, good) {
      element.classList.remove('card--in-stock');
      element.classList.remove('card--little');
      element.classList.remove('card--soon');
      if (good.amount > 5) {
        element.classList.add('card--in-stock');
      }
      if (good.amount >= 1 && good.amount <= 5) {
        element.classList.add('card--little');
      }
      if (good.amount === 0) {
        element.classList.add('card--soon');
      }
    },
    checkFavouriteCount: function () {
      var filterFavsCount = document.querySelector('#filter-favorite').nextElementSibling.nextElementSibling;
      var ids = [];
      catalogCards.querySelectorAll('.catalog__card').forEach(function (item, index) {
        if (item.classList.contains('favorite')) {
          ids.push(index);
        }
      });
      filterFavsCount.textContent = '(' + ids.length + ')';
      return ids;
    },
    setInputsDisabled: function (status) {
      var inputs = form.querySelectorAll('.text-input__input');
      var deliverText = form.querySelector('.deliver__textarea');
      inputs.forEach(function (input) {
        input.disabled = status;
      });
      deliverText.disabled = status;
    },
    initModal: function (target) {
      var modalClose = target.querySelector('.modal__close');
      modalClose.addEventListener('click', onModalCloseClick);
      document.addEventListener('keydown', onModalEscPress);
      function onModalEscPress(evt) {
        if (evt.keyCode === 27) {
          target.classList.add('modal--hidden');
          modalClose.removeEventListener('click', onModalCloseClick);
          document.removeEventListener('keydown', onModalEscPress);
        }
      }
      function onModalCloseClick(evt) {
        var close = evt.target;
        close.parentElement.parentElement.classList.add('modal--hidden');
        modalClose.removeEventListener('click', onModalCloseClick);
        document.removeEventListener('keydown', onModalEscPress);
      }
    }
  };
  function createGoods(data) {
    var count = data.length;
    var goods = [];
    for (var i = 0; i < count; i++) {
      goods.push({
        id: i,
        name: data[i].name,
        kind: data[i].kind,
        picture: window.goods.IMG_PATH + data[i].picture,
        amount: data[i].amount,
        price: data[i].price,
        weight: data[i].weight,
        rating: {
          value: data[i].rating.value,
          number: data[i].rating.number
        },
        nutritionFacts: {
          sugar: data[i].nutritionFacts.sugar,
          gluten: data[i].nutritionFacts.gluten,
          vegetarian: data[i].nutritionFacts.vegetarian,
          energy: data[i].nutritionFacts.energy,
          contents: data[i].nutritionFacts.contents
        }
      });
    }
    return goods;
  }
  function createCard(item) {
    var template = document.querySelector('#card').content.querySelector('.catalog__card');
    var content = template.cloneNode(true);
    //  availability
    window.goods.checkAvailability(content, item);
    //  picture
    var picture = content.querySelector('.card__img');
    picture.src = item.picture;
    picture.alt = item.name;
    //  name
    content.querySelector('.card__title').textContent = item.name;
    //  price
    var priceElement = content.querySelector('.card__price');
    priceElement.childNodes[0].textContent = item.price + ' ';
    priceElement.childNodes[2].textContent = '/ ' + item.weight + ' Г';
    //  rating
    checkRating(content, item);
    content.querySelector('.star__count').textContent = item.rating.number;
    //  nutrition
    checkNutrition(content, item);
    content.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;
    return content;
  }
  function renderCards(items) {
    var fragment = document.createDocumentFragment();
    items.forEach(function (item) {
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
  function toggleComposition(card) {
    card.querySelector('.card__composition').classList.toggle('card__composition--hidden');
  }
  //  favourites
  function toggleFavourite(card) {
    card.classList.toggle('favorite');
    card.querySelector('.card__btn-favorite').classList.toggle('card__btn-favorite--selected');
  }
  //  helpers
  function getCardIndex(card) {
    var index = 0;
    var cardsList = catalogCards.querySelectorAll('.catalog__card');
    for (var i = 0; i < cardsList.length; i++) {
      if (card === cardsList[i]) {
        index = i;
      }
    }
    return index;
  }

  //  handlers
  function onCatalogClick(target, goodsList) {
    var targetCard = window.goods.getClickCard(target, 3);
    //  click add
    if (target.classList.contains('card__btn')) {
      if (targetCard.classList.contains('card--soon')) {
        return;
      }
      var index = getCardIndex(targetCard);
      window.cart.updateOrder(goodsList[index], goodsList);
      window.goods.checkAvailability(targetCard, goodsList[index]);
    }
    //  click favourite
    if (target.classList.contains('card__btn-favorite')) {
      toggleFavourite(targetCard);
      var count = window.goods.checkFavouriteCount().length;
      if (document.querySelector('#filter-favorite').checked) {
        targetCard.style.display = 'none';
        if (count === 0) {
          window.filters.showMessage();
        }
      }
    }
    //  click composition
    if (target.classList.contains('card__btn-composition')) {
      toggleComposition(targetCard);
    }
  }
})();
