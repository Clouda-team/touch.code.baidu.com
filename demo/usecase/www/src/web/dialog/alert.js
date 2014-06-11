define(

    /**
     * @class Alert
     * @extends Dialog
     * @inheritable
     */

    function (require) {

        var blend = require('../blend');
        var lib = require('../lib');
        var Dialog = require('../Dialog');
        var Control = require('../Dialog');


        var Alert = function (content, title, buttonText) {


            Control.prototype.setProperties.call(this, {
                content : content,
                title : title,
                buttonText : buttonText
            });

            Dialog.call(this, {
                content: this.content,
                title: this.title,
                buttons: [ {
                    text: this.buttonText,
                    bold: true
                } ]
            });
            return this;
        };
        lib.inherits(Alert, Dialog);

        Alert.prototype.title = blend.configs.dialogTitle;
        Alert.prototype.content = "";
        Alert.prototype.buttonText = blend.configs.dialogBtnOK;

        return Alert;
    }
);