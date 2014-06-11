define(

    /**
     * @class Popup
     * @extends Dialog
     * @inheritable
     */

    function (require) {

        var blend = require('./blend');
        var lib = require('./lib');
        var Dialog = require('./Dialog');
        var Control = require('./Control');



        /**
         * @constructor
         *
         * @param {Array} options
         *
         * @param {Array} [options[0]] Groups
         * @param {Array} [options] buttons
         * @param {String} [options[0][0].text]
         * @param {Boolean} [options[0][0].red]
         * @param {Boolean} [options[0][0].bold]
         * @param {Function} [options[0][0].onclick]
         * @param {Boolean} [options[0][0].close]
         * @param {Boolean} [options[0][0].label]
         *
         * @returns this
         */

        var Actions = function (options) {
            var me = this;
            options = options || [];




            if (options.length > 0 && !$.isArray(options[0])) {
                options = [options];
            }

            //CAUTION: 这里不继承dialog的构造函数，自己构造
            Control.call(this, options);

            var actionsTemplate = '<div class="actions-modal">{{buttons}}</div>';
            var buttonsHTML = '';
            for (var i = 0; i < options.length; i++) {
                for (var j = 0; j < options[i].length; j++) {
                    if (j === 0){
                        buttonsHTML += '<div class="actions-modal-group">';
                    }
                    var button = options[i][j];
                    var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
                    if (button.bold) buttonClass += ' actions-modal-button-bold';
                    if (button.red) buttonClass += ' actions-modal-button-red';
                    buttonsHTML += '<span class="' + buttonClass + '">' + button.text + '</span>';
                    if (j === options[i].length - 1){
                        buttonsHTML += '</div>';
                    }
                }
            }

            this.main.innerHTML = actionsTemplate.replace(/{{buttons}}/g, buttonsHTML);

            var modal = $(this.main).children();

            $('body').append(this.main);

            var groups = modal.find('.actions-modal-group');
            groups.each(function (index, el) {
                var groupIndex = index;
                $(el).children().each(function (index, el) {
                    var buttonParams = options[groupIndex][index];
                    if ($(el).hasClass('actions-modal-button')) {
                        $(el).on('click', function (e) {
                            if (buttonParams.close !== false){
                                me.close();
                            }
                            if (buttonParams.onClick){
                                buttonParams.onClick(modal, e);
                            }
                        });
                    }
                });
            });
            this.open();
            return modal[0];
        };
        lib.inherits(Actions, Dialog);


        return Actions;
    }
);