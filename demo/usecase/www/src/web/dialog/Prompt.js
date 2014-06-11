define(

    /**
     * @class Prompt
     * @extends Dialog
     * @inheritable
     */

    function (require) {

        var blend = require('../blend');
        var lib = require('../lib');
        var Control = require('../Control');
        var Dialog = require('../Dialog');


        var Prompt = function (content, title, callbackOk, callbackCancel) {
            Control.prototype.setProperties.call(this, {
                content : content,
                title : title
            });

            Dialog.call(this, {
                content: content,
                title: title,
                afterContent: '<input type="text" class="modal-prompt-input">',
                buttons: [
                    {
                        text: blend.configs.dialogBtnCancel,
                        onclick: function () {
                            if (callbackCancel) {
                                callbackCancel($(this.main).find('.modal-prompt-input').val());
                            }
                        }
                    },
                    {
                        text: blend.configs.dialogBtnOK,
                        bold: true,
                        onclick: function (modal) {
                            if (callbackOk) {
                                callbackOk($(this.main).find('.modal-prompt-input').val());
                            }
                        }
                    }
                ]
            });

            return this;
        };
        lib.inherits(Prompt, Dialog);

        Prompt.prototype.title = blend.configs.dialogTitle;
        Prompt.prototype.content = "";


        return Prompt;
    }
);