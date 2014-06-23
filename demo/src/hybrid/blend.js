define(
    function (require) {
        var lib = require('../common/lib');
        var runtime = require('./runtime');

        /**
         * @class blend
         * @singleton
         */
        var blend = {};
        var controls = {};


        /**
         * 版本信息
         *
         * @property {String} version info
         */
        blend.version = 'alpha';

        /**
         * 开放的Api接口entend到blend中
         *
         * @property {Object} Api接口
         */
        blend.api = {};


        /**
         * 是否处于Runtime环境中
         *
         * @property {boolean} inRuntime
         */
        blend.inRuntime  = function(){
            return false;
        };//runtime.inRuntime();


        var config = {
            DOMPrefix: 'data-ui',
            classPrefix: {
                "ui" :'ui',
                "skin" :'skin',
                "state" :'state'
            }
        };


        /**
         * 设置config
         *
         * @property {Object} info
         */
        blend.config = function (info) {
            lib.extend(config, info);
        };

        /**
         * 获取config
         *
         * @property {String} name
         */
        blend.getConfig = function (name) {
            return config[name];
        };

        /**
         * 从ID获取Control
         *
         * @param {String} element
         *
         * @returns {Control} control
         */
        blend.getUI = function (element) {
            element = $(element)[0];
            do{
                //console.log(element);
                //如果元素是document
                if(!element || element.nodeType == 9){
                    return null;
                }
                if(element.getAttribute("data-blend")){
                    return controls[element.getAttribute("data-blend-id")];
                }
            }while((element = element.parentNode) != document.body);
        };

        /**
         * 注册控件到系统中
         *
         * @param {Control} control 控件实例
         * @returns null
         */
        blend.register = function (control) {
            controls[control.id] = control;
        };

        /**
         * 注销控件
         *
         * @param {Control} control 控件实例
         * @returns null
         */
        blend.cancel = function (control) {
            //console.log("reg: " + control.id);
            delete controls[control.id];
        };

        blend.create = function (type, options) {

        };

        /**
         * 根据id获取实例
         *
         * @param {string} id 控件id
         * @returns {Control}
         */
        blend.get = function (id) {
            return controls[id];
        };

        /**
         * runtime layer接口
         *
         * @property {Object} 
         */
        blend.api.layer = runtime.layer;

        /**
         * runtime layerGroup接口
         *
         * @property {Object} layerGroup
         */

        return blend;
    }
);