'use strict';

//  data
var NAMES = [
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
var CONTENTS = [
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

//  random data
function getName(items) {
  var index = getNumber(items.length - 1);
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

//  generate goods array
function createGoods(count) {
  var goods = [];
  for (var i = 0; i < count; i++) {
    goods.push({
      name: getName(NAMES),
      amount: getNumber(20),
      price: getNumber(500),
      weight: getNumber(500),
      rating: {
        value: getNumber(5),
        number: getFromRange(10, 900)
      },
      nutritionFacts: {
        sugar: !getNumber(1),
        energy: getFromRange(70, 500),
        contents: getContents(CONTENTS)
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
  checkAvailability(content, item);
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
function checkAvailability(element, good) {
  element.classList.remove('card--in-stock');
  if (good.amount > 5) {
    element.classList.add('card--in-stock');
  }
  if (good.amount >= 1 && good.amount <= 5) {
    element.classList.add('card--little');
  }
  if (good.amount === 0) {
    element.classList.add('card--soon');
  }
}
function checkRating(element, good) {
  var ratingElement = element.querySelector('.stars__rating');
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

//  goods cards
function createGoodCard(item) {
  var template = document.querySelector('#card-order').content.querySelector('.goods_card');
  var content = template.cloneNode(true);
  //  name
  content.querySelector('.card-order__title').textContent = item.name;
  //  price
  var priceElement = content.querySelector('.card-order__price');
  priceElement.textContent = item.price + ' ₽';
  return content;
}
function renderCards(count, block) {
  var goods = createGoods(count);
  var fragment = document.createDocumentFragment();
  if (block === 'catalog') {
    goods.forEach(function (good) {
      fragment.appendChild(createCard(good));
    });
  }
  if (block === 'goods') {
    goods.forEach(function (good) {
      fragment.appendChild(createGoodCard(good));
    });
  }
  return fragment;
}

//  catalog
var catalogCards = document.querySelector('.catalog__cards');
catalogCards.classList.remove('catalog__cards--load');
catalogCards.querySelector('.catalog__load').style.display = 'none';
catalogCards.appendChild(renderCards(26, 'catalog'));

//  cart
var goodsCards = document.querySelector('.goods__cards');
goodsCards.classList.remove('goods__cards--empty');
goodsCards.querySelector('.goods__card-empty').style.display = 'none';
goodsCards.appendChild(renderCards(3, 'goods'));
