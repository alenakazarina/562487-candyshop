'use strict';

(function () {
  var PATH = './img/cards/';
  var imgSources = [
    'gum-cedar.jpg',
    'gum-chile.jpg',
    'gum-eggplant.jpg',
    'gum-mustard.jpg',
    'gum-portwine.jpg',
    'gum-wasabi.jpg',
    'ice-cucumber.jpg',
    'ice-eggplant.jpg',
    'ice-garlic.jpg',
    'ice-italian.jpg',
    'ice-mushroom.jpg',
    'ice-pig.jpg',
    'marmalade-beer.jpg',
    'marmalade-caviar.jpg',
    'marmalade-corn.jpg',
    'marmalade-new-year.jpg',
    'marmalade-sour.jpg',
    'marshmallow-bacon.jpg',
    'marshmallow-beer.jpg',
    'marshmallow-shrimp.jpg',
    'marshmallow-spicy.jpg',
    'marshmallow-wine.jpg',
    'soda-bacon.jpg',
    'soda-celery.jpg',
    'soda-cob.jpg',
    'soda-garlic.jpg',
    'soda-peanut-grapes.jpg',
    'soda-russian.jpg'
  ];
  var names = [
    'Чесночные сливки',
    'Огуречный педант',
    'Молочная хрюша',
    'Грибной шейк',
    'Баклажановое безумие',
    'Паприколу итальяно',
    'Нинзя-удар васаби',
    'Хитрый баклажан',
    'Горчичный вызов',
    'Кедровая липучка',
    'Корманный портвейн',
    'Чилийский задира',
    'Беконовый взрыв',
    'Арахис vs виноград',
    'Сельдерейная душа',
    'Початок в бутылке',
    'Чернющий мистер чеснок',
    'Раша федераша',
    'Кислая мина',
    'Кукурузное утро',
    'Икорный фуршет',
    'Новогоднее настроение',
    'С пивком потянет',
    'Мисс креветка',
    'Бесконечный взрыв',
    'Невинные винные',
    'Бельгийское пенное',
    'Острый язычок'
  ];
  var contents = [
    'молоко',
    'сливки',
    'вода',
    'пищевой краситель',
    'патока',
    'ароматизатор бекона',
    'ароматизатор свинца',
    'ароматизатор дуба, идентичный натуральному',
    'ароматизатор картофеля',
    'лимонная кислота',
    'загуститель',
    'эмульгатор',
    'консервант: сорбат калия',
    'посолочная смесь: соль, нитрит натрия',
    'ксилит',
    'карбамид',
    'вилларибо',
    'виллабаджо'
  ];

  function getString(items, string) {
    var index = getNumber(items.length - 1);
    if (string === 'picture') {
      var path = PATH + items[index];
      return path;
    }
    return items[index];
  }
  function getFromRange(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }
  function getNumber(value) {
    return Math.floor(Math.random() * (value + 1));
  }
  function getContents(items) {
    var string = '';
    var count = getFromRange(1, items.length);
    for (var i = 0; i < count; i++) {
      var index = getFromRange(0, items.length - 1);
      if (i !== count - 1) {
        string += items[index] + ', ';
      } else {
        string += items[index];
      }
    }
    return string;
  }
  function createGoods(count) {
    var goods = [];
    for (var i = 0; i < count; i++) {
      goods.push({
        id: i,
        name: getString(names),
        picture: getString(imgSources, 'picture'),
        amount: getNumber(20),
        price: getFromRange(100, 1500),
        weight: getFromRange(30, 300),
        rating: {
          value: getFromRange(1, 5),
          number: getFromRange(10, 900)
        },
        nutritionFacts: {
          sugar: !getNumber(1),
          energy: getFromRange(70, 500),
          contents: getContents(contents)
        }
      });
    }
    return goods;
  }

  //  catalog cards
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
  function renderCards(items) {
    var fragment = document.createDocumentFragment();
    items.forEach(function (item) {
      fragment.appendChild(createCard(item));
    });
    catalogCards.appendChild(fragment);
    return fragment;
  }
  function toggleComposition(card) {
    card.querySelector('.card__composition').classList.toggle('card__composition--hidden');
  }
  //  loading
  function showLoad() {
    catalogCards.classList.add('catalog__cards--load');
    catalogCards.querySelector('.catalog__load').classList.remove('visually-hidden');
  }
  function hideLoad() {
    catalogCards.classList.remove('catalog__cards--load');
    catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
  }
  //  favourites
  function toggleFavourite(card) {
    card.classList.toggle('favorite');
    card.querySelector('.card__btn-favorite').classList.toggle('card__btn-favorite--selected');
  }
  function checkFavouriteCount() {
    var filterFavsCount = document.querySelector('#filter-favorite').nextElementSibling.nextElementSibling;
    var ids = [];
    catalogCards.querySelectorAll('.catalog__card').forEach(function (item) {
      if (item.classList.contains('favorite')) {
        ids.push(item);
      }
    });
    filterFavsCount.textContent = '(' + ids.length + ')';
    return ids.length;
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
  function onCatalogClick(evt) {
    evt.preventDefault();
    var target = evt.target;
    var targetCard = window.goods.getClickCard(target, 3);
    //  click add
    if (target.classList.contains('card__btn')) {
      if (targetCard.classList.contains('card--soon')) {
        return;
      }
      var index = getCardIndex(targetCard);
      window.cart.updateOrder(goodsList[index]);
      window.goods.checkAvailability(targetCard, goodsList[index]);
    }
    //  click favourite
    if (target.classList.contains('card__btn-favorite')) {
      toggleFavourite(targetCard);
      var count = checkFavouriteCount();
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

  //  start
  var goodsList = createGoods(26);
  var catalogCards = document.querySelector('.catalog__cards');
  showLoad();
  setTimeout(function () {
    hideLoad();
    renderCards(goodsList);
  }, 2000);

  //  listeners
  catalogCards.addEventListener('click', onCatalogClick);

  //  export
  window.goods = {
    list: goodsList,
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
