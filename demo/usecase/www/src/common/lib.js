define(
    function (require) {


        /**
         * @class blend.lib
         * @singleton
         * @private
         */
        var lib = {};

        var lang = require("./lib/lang");
        var string = require("./lib/string");

        var count = 0x861005;

        /**
         * 获得全局唯一的ID
         *
         * @param {string} prefix 前缀
         */
        lib.getUniqueID = function(prefix){
            prefix = prefix || 'BlendUI';
            return prefix + count++;
        };



        /**
         * string相关的lib方法
         *
         * @class {Object} string
         */
        /**
         * lang相关的lib方法
         *
         * @class {Object} lang
         */
        lang.extend(lib, lang);
        lang.extend(lib, string);

        return lib;

    }
);