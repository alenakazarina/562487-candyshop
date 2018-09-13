'use strict';

var rangeMax = parseInt(document.querySelector('.range__price--max').textContent, 10);

var catalogList = document.querySelectorAll('.catalog__card');
var catalogPrices = [];
document.querySelectorAll('.card__price').forEach(function (item) {
  catalogPrices.push(parseInt(item.textContent.split(' ')[0], 10));
});

var ids = [];
catalogPrices.filter(function (price, index) {
  if (price <= rangeMax) {
    ids.push(index);
  }
  return price <= rangeMax;
});
for (var i = 0; i < catalogList.length; i++) {
  catalogList[i].style.display = 'none';
}
for (var j = 0; j < ids.length; j++) {
  var index = ids[j];
  catalogList[index].style.display = 'inline-block';
}
