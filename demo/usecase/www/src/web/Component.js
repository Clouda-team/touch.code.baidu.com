define(


        function (require) {
            var blend = require('./blend');
            var lib = require('./lib');
            var Control = require('./Control');



        /**
         * @class Component
         * @extends Control
         * @static
         */

        function Component(options) {

            //todo: 拿到这个component所属的pager，用来同步滚动和位置
            //this.layer = options.layer;
            //走underscore的bind
//            this.layer.on("move", function(pos){
//                lib.bind(this.updatePosition, this, pos);
//            });

            Control.apply(this, arguments);
        }


        Component.prototype.type = 'layout';

        Component.prototype.pos = {};


        Component.prototype.updatePosition = function(pos){
            this.nativeObj.updatePosition();
        };


        lib.inherits(Component, Control);

        return Component;
    }
);