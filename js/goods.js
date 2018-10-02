'use strict';
(function () {
  var catalogCards = document.querySelector('.catalog__cards');
  function onCompositionClick(card) {
    card.querySelector('.card__composition').classList.toggle('card__composition--hidden');
  }
  function getCardIndex(card) {
    var index = 0;
    var cardsList = catalogCards.querySelectorAll('.catalog__card');
    cardsList.forEach(function (it, i) {
      if (card === it) {
        index = i;
      }
    });
    return index;
  }
  function onCatalogClick(evt) {
    var target = evt.target;
    var targetCard = window.cart.getClickCard(target, 3);
    var i = getCardIndex(targetCard);
    if (target.classList.contains('card__btn')) {
      if (targetCard.classList.contains('card--soon')) {
        return;
      }
      window.cart.init(i);
    }
    if (target.classList.contains('card__btn-favorite')) {
      evt.preventDefault();
      window.goods.onFavClick(targetCard, i);
    }
    if (target.classList.contains('card__btn-composition')) {
      onCompositionClick(targetCard);
    }
  }
  window.goods = {
    items: [],
    init: function (data) {
      window.goods.items = data;
      window.render.init(data);
      catalogCards.addEventListener('click', onCatalogClick);
    },
    onFavClick: function (card, i) {
      card.querySelector('.card__btn-favorite').classList.toggle('card__btn-favorite--selected');
      window.filters.updateFavorite(i);
    }
  };
})();
