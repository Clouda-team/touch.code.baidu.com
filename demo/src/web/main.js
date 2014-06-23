require(['src/web/blend','src/web/dialog/alert','src/web/slider'], function (blend, alert,slider) {
    "use strict";
    blend = blend||{};
    
    //dialogs
    blend.dialog = {};
    blend.dialog.alert = alert;

    //components
    blend.component = {};
    blend.component.slider = slider;

    window.Blend = blend;

    var e = new CustomEvent('blendready', {
      // detail: { slideNumber: Math.abs(slideNumber) },
      bubbles: true,
      cancelable: true
    });

    document.dispatchEvent(e);

},null,true);
