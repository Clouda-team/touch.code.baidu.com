define(
    function (require) {

        /**
         * @class runtime
         * @private
         * @singleton
         */

        var runtime = {};


        var layer = require("./api/layer");
        var layerGroup = require("./api/layerGroup");
        var component = require("./api/component");

        runtime.layer = layer;
        runtime.layerGroup = layerGroup;
        runtime.component = component;

        return runtime;

    }

);