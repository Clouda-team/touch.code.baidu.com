define(

    /**
     * @class Popup
     * @extends Dialog
     * @inheritable
     */

    function (require) {

        var blend = require('./blend');
        var lib = require('./../common/lib');
        var Dialog = require('./Dialog');
        var Control = require('./Control');


        var Popup = function (modal, removeOnClose) {
            console.log("popup init");

            //CAUTION: 这里不继承dialog的构造函数，自己构造
            Control.call(this, {
                modal : modal,
                removeOnClose : removeOnClose
            });

            this._init();
            return this;
        };

        lib.inherits(Popup, Dialog);

        Popup.prototype.removeOnClose = true;
        Popup.prototype.type = "popup";

        Popup.prototype._init = function(){
            if (typeof this.modal === 'string' && this.modal.indexOf('<') >= 0) {//如果是HTML
                var _modal = document.createElement('div');
                _modal.innerHTML = this.modal;
                if (_modal.childNodes.length > 0) {
                    modal = _modal.childNodes[0];
                    if (this.removeOnClose){
                        modal.classList.add('remove-on-close');
                    }
                    $('body').append(modal);
                } else {
                    return false;
                }
            }
            var modal = $(this.modal);
            if (modal.length === 0){
                return false;
            }
            $(this.main).append(modal).appendTo("body");

            modal.show();
//            if (modal.find('.' + blend.configs.layerClass).length > 0) {
//                //app.sizeNavbars(modal.find('.' + app.params.viewClass)[0]);
//            }
            this.open();
            return this;
        };

        return Popup;
    }
);