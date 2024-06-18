/**
 * Define actions to manage tip section
 */
(function () {
  'use strict';

  function tipPanel() {
    const defaultTips = [
      'Consejo: ¡usa las flechas para mover un objeto seleccionado 1 píxel!',
      'Consejo: ¡Mayús + clic para seleccionar y modificar múltiples objetos!',
      'Consejo: ¡mantén presionada la tecla Mayús cuando gires un objeto para realizar saltos en un ángulo de 15°!',
      'Consejo: ¡mantén presionada la tecla Mayús cuando dibujes una línea para saltos en ángulo de 15°!',
      'Consejo: Ctrl +/-, Ctrl + rueda para acercar y alejar!',
    ]
    const _self = this;
    $(`${this.containerSelector} .canvas-holder .content`).append(`
    <div id="tip-container">${defaultTips[parseInt(Math.random() * defaultTips.length)]}</div>`)
    this.hideTip = function () {
      $(`${_self.containerSelector} .canvas-holder .content #tip-container`).hide();
    }

    this.showTip = function () {
      $(`${_self.containerSelector} .canvas-holder .content #tip-container`).show();
    }

    this.updateTip = function (str) {
      typeof str === 'string' && $(`${_self.containerSelector} .canvas-holder .content #tip-container`).html(str);
    }
  }

  window.ImageEditor.prototype.initializeTipSection = tipPanel;
})();