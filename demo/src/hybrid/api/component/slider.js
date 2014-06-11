define(
    function (require) {

        /**
         * @class rutime.component.slider 
         * @singleton
         * @private
         */
        var config = require('../config');
        var event = require('../event');
        var slider  = {};
        var devPR = window.devicePixelRatio || 2;
        var bridge = window.lc_bridge;

        /**
         * 增加slider
         */
        slider.add = function(id, options){
            var _options = {
                "left":0,
                "top":0,
                "width":window.innerWidth*devPR,
                "height":window.innerHeight*devPR,
                "fixed":false
            };
            ['left','top','width','height','fixed'].forEach(function(n,i){
                if(options&&options[n]!=undefined){
                    _options[n] = options[n]*devPR;
                }
            });
            _options.top += window.pageYOffset*devPR;
            bridge.addComponent(id, 'UIBase', 'com.baidu.lightui.component.slider.Slider', JSON.stringify(_options));

            return slider;
        };
        
        /**
         * 增加images数据
         */
        slider.addItems = function(id, images){
            bridge.componentExecuteNative(id, 'addItems',  JSON.stringify(images));
            return slider;
        }
        /**
         * 设置背景
         */
        slider.setConfig = function(id, options){
            bridge.componentExecuteNative(id, 'setSliderConfig',JSON.stringify(options));
            return slider;
        }

        /**
         * 设置指示器
         */
        slider.setupIndicator = function(id, options){
            //alert(JSON.stringify(options));
            options.layoutRules=[config.CENTER_HORIZONTAL, config.ALIGN_PARENT_BOTTOM];
            options.verticalMargin= Math.round(5 * devicePixelRatio);
            options.unitSize=Math.round(10 * devicePixelRatio);
            options.unitSpace=Math.round(5 * devicePixelRatio);
            bridge.componentExecuteNative(id, 'setupIndicator',JSON.stringify(options));
            return slider;
        }

        /**
         * next
         */
        slider.next = function(id){
            bridge.componentExecuteNative(id, 'next');
            return slider;
        }

        /**
         * prev
         */
        slider.prev = function(id){
            bridge.componentExecuteNative(id, 'prev');
            return slider;
        };

        /**
         * slider to
         */
        slider.slideTo = function(id, index,hasAnim){
            bridge.componentExecuteNative(id, 'slideTo', JSON.stringify({
                index:index,
                isAnim:!!hasAnim
            }));
            return slider;
        };
        
        // layer触发的自定义事件
        var events = {
           
        };
        
        
        /**
         *
         * 注册layer事件触发
         * @method {Function} on
         *
         * @param {String} type
         * @param {Function} handler
         * @param {String} layerId
         *
         * @returns layerId
         * @private
         */
        slider.on = event.on;
        
        /**
         *
         * 移除事件
         * @method {Function} off
         *
         * @param {String} type
         * @param {Function} handler
         * @param {String} layerId
         *
         * @returns layerId
         * @private
         */
        slider.off = event.off;
        
        /**
         * 移除组件
         */
        slider.remove = function(id){
            lc_bridge.removeComponent(id, 'UIBase');
        }
        return slider;
    }
);