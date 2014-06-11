require(['src/hybrid/blend','src/hybrid/Layer','src/hybrid/LayerGroup'], function (blend, Layer,LayerGroup) {
    window.Blend = blend||{};
    window.Blend.Layer = Layer;
    window.Blend.LayerGroup = LayerGroup;
},null,true);

