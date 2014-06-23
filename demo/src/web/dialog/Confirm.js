define(

    /**
     * @class Confirm
     * @extends Dialog
     * @inheritable
     */

    function (require) {

        var blend = require('../blend');
        var lib = require('../../common/lib');
        var Dialog = require('../Dialog');


        var Confirm = function (content, title, callbackOk, callbackCancel) {

            Dialog.call(this, {
                content: content,
                title: title,
                buttons: [ {
                    text: blend.configs.dialogBtnCancel,
                    onclick: callbackCancel
                }, {
                    text: blend.configs.dialogBtnOK,
                    bold: true,
                    onclick: callbackOk
                }
                ]
            });

            return this;
        };

        lib.inherits(Confirm, Dialog);


        Confirm.prototype.title = blend.configs.dialogTitle;
        Confirm.prototype.content = "";


        return Confirm;
    }
);