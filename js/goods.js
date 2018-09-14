'use strict';

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
  checkAvailability(content, item);
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
function checkAvailability(element, good) {
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

function renderCards(items, block) {
  var fragment = document.createDocumentFragment();
  if (block === 'catalog') {
    items.forEach(function (item) {
      fragment.appendChild(createCard(item));
    });
  }
  if (block === 'goods') {
    items.forEach(function (item) {
      fragment.appendChild(createGoodCard(item));
    });
  }
  return fragment;
}

function updateOrder(good) {
  //  если есть в заказе
  var index = checkInOrder(good);
  if (index !== undefined) {
    goodsCards.querySelectorAll('.card-order__count')[index].value++;
    showTotal();
    return;
  }
  //  если нет в заказе
  order.list.push(good);
  showGoodsCards(good);
  showTotal();
  hideEmptyCart();
}

function checkInOrder(good) {
  for (var i = 0; i < order.list.length; i++) {
    if (order.list[i].id === good.id) {
      var index = i;
    }
  }
  return index;
}

function getClickCard(item, count) {
  var parent = item.parentNode;
  while (count !== 1) {
    parent = parent.parentNode;
    count--;
  }
  return parent;
}

function getCardIndex(card, block) {
  var index = 0;
  var cardsList = [];
  if (block === 'catalog') {
    cardsList = catalogCards.querySelectorAll('.catalog__card');
  }
  if (block === 'cart') {
    cardsList = goodsCards.querySelectorAll('.goods_card');
  }
  for (var i = 0; i < cardsList.length; i++) {
    if (card === cardsList[i]) {
      index = i;
    }
  }
  return index;
}

function addGoodToOrder(index) {
  goodsList[index].amount--;
  order.total += goodsList[index].price;
  order.count++;
}

function removeGoodFromOrder(good) {
  goodsList[good.id].amount++;
  order.total -= good.price;
  order.count--;
}

function removeGoodsFromOrderCloseClick(good, count) {
  goodsList[good.id].amount += count;
  order.total -= good.price * count;
  order.count -= count;
  order.list = order.list.filter(function (item) {
    return item !== good;
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

function toggleFavourite(card) {
  card.classList.toggle('favorite');
  card.querySelector('.card__btn-favorite').classList.toggle('card__btn-favorite--selected');
}

function toggleComposition(card) {
  card.querySelector('.card__composition').classList.toggle('card__composition--hidden');
}

function showGoodsCards(good) {
  var goodCard = createGoodCard(good.name, good.picture, good.price);
  goodCard.querySelector('.card-order__count').value = 1;
  goodsCards.appendChild(goodCard);
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
  disableOrderInputs();
}

function hideEmptyCart() {
  goodsCards.classList.remove('goods__cards--empty');
  goodsCards.querySelector('.goods__card-empty').style.display = 'none';
  goodsCards.nextElementSibling.querySelector('.goods__order-link').classList.remove('goods__order-link--disabled');
  removeDisabledOrderInputs();
}

function hideLoad() {
  catalogCards.classList.remove('catalog__cards--load');
  var catalogLoad = catalogCards.querySelector('.catalog__load');
  catalogCards.removeChild(catalogLoad);
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

//  goods data
var goodsList = createGoods(26);
//  order
var order = {
  count: 0,
  total: 0,
  list: []
};
//  catalog
var catalogList = goodsList;
var contentCards = renderCards(catalogList, 'catalog');
var catalogCards = document.querySelector('.catalog__cards');
var goodsCards = document.querySelector('.goods__cards');
hideLoad();
showEmptyCart();
catalogCards.appendChild(contentCards);

//  listeners
catalogCards.addEventListener('click', onCatalogClick);
goodsCards.addEventListener('click', onOrderClick);

//  handlers
function onCatalogClick(evt) {
  evt.preventDefault();
  var target = evt.target;
  var targetCard = getClickCard(target, 3);
  //  добавить
  if (target.classList.contains('card__btn')) {
    if (targetCard.classList.contains('card--soon')) {
      return;
    }
    var index = getCardIndex(targetCard, 'catalog');
    addGoodToOrder(index);
    updateOrder(goodsList[index]);
    updateHeaderCart();
    checkAvailability(targetCard, goodsList[index]);
  }
  //  фаворит
  if (target.classList.contains('card__btn-favorite')) {
    toggleFavourite(targetCard);
  }
  //  состав
  if (target.classList.contains('card__btn-composition')) {
    toggleComposition(targetCard);
  }
}

function onOrderClick(evt) {
  evt.preventDefault();
  var target = evt.target;
  var targetCard = getClickCard(target, 3);
  var index = getCardIndex(targetCard, 'cart');
  var good = order.list[index];
  //  клик по close
  if (target.classList.contains('card-order__close')) {
    targetCard = getClickCard(target, 1);
    index = getCardIndex(targetCard, 'cart');
    good = order.list[index];
    var count = parseInt(targetCard.querySelector('.card-order__count').value, 10);
    goodsCards.removeChild(targetCard);
    removeGoodsFromOrderCloseClick(good, count);
    updateHeaderCart();
    checkAvailability(catalogCards.querySelectorAll('.catalog__card')[good.id], good);
    if (order.list.length === 0) {
      hideTotal();
      showEmptyCart();
      return;
    }
    showTotal();
    return;
  }
  //  клик увеличить
  if (target.classList.contains('card-order__btn--increase')) {
    if (goodsList[good.id].amount === 0) {
      return;
    }
    addGoodToOrder(good.id);
    showTotal();
    updateHeaderCart();
    checkAvailability(catalogCards.querySelectorAll('.catalog__card')[good.id], good);
    targetCard.querySelector('.card-order__count').value++;
    return;
  }
  //  клик уменьшить
  if (target.classList.contains('card-order__btn--decrease')) {
    targetCard.querySelector('.card-order__count').value--;
    if (parseInt(targetCard.querySelector('.card-order__count').value, 10) === 0) {
      goodsCards.removeChild(targetCard);
      removeGoodsFromOrderCloseClick(good, 1);
    } else {
      removeGoodFromOrder(good);
    }
    updateHeaderCart();
    checkAvailability(catalogCards.querySelectorAll('.catalog__card')[good.id], good);
    if (order.list.length === 0) {
      hideTotal();
      showEmptyCart();
      return;
    }
    showTotal();
    return;
  }
}
