'use strict';
(function () {
  window.slider = {
    init: function (cb, target) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      function onMouseMove(moveEvt) {
        var startPosition = target.offsetLeft;
        var shift = startPosition - moveEvt.clientX;
        startPosition = moveEvt.clientX;
        var parentX = target.offsetParent.offsetLeft;
        target.style.left = target.offsetLeft - parentX - shift + 'px';
        cb(target);
      }
      function onMouseUp() {
        cb(target);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
    }
  };
})();
