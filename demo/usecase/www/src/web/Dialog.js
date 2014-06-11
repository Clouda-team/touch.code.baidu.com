define(

    /**
     * @class Dialog
     * @inheritable
     */

    function (require) {

        var blend = require('./blend');
        var lib = require('./lib');
        var Control = require('./Control');

        /**
         * @constructor
         *
         * @param {Object} options
         *
         * @param {String} options.title
         * @param {String} [options.content]
         * @param {String} [options.afterContent]
         *
         * @param {Object} [options.buttons]
         * @param {String} [options.buttons.text]
         * @param {Boolean} [options.buttons.bold]
         * @param {Function} [options.buttons.onclick]
         * @param {Boolean} [options.buttons.close]
         *
         *
         * @returns this
         */
        var Dialog = function (options) {
            console.log("dialog init");
            Control.call(this, options);
            this._init();
            return this;
        };
        lib.inherits(Dialog, Control);
        Dialog.prototype.type = "dialog";
        Dialog.prototype.content = "";
        Dialog.prototype.title = "";
        Dialog.prototype.afterContent = "";


        Dialog.prototype._init = function(){

            var me = this;

            var buttonsHTML = '';
            if (this.buttons && this.buttons.length > 0) {
                for (var i = 0; i < this.buttons.length; i++) {
                    buttonsHTML += '<span class="modal-button' + (this.buttons[i].bold ? ' modal-button-bold' : '') + '">' + this.buttons[i].text + '</span>';
                }
            }
            var template = '<div class="modal {{noButtons}}">' +
                '<div class="modal-inner">' +
                '{{if title}}<div class="modal-title">{{title}}</div>{{/if title}}' +
                '<div class="modal-text">{{content}}</div>' +
                '{{afterContent}}' +
                '</div>' +
                '<div class="modal-buttons">{{buttons}}</div>' +
                '</div>';
            if (!this.title) {
                template = template.split('{{if title}}')[0] + template.split('{{/if title}}')[1];
            } else {
                template = template.replace(/{{if\ title}}/g, '').replace(/{{\/if\ title}}/g, '');
            }
            var html = template
                .replace(/{{title}}/g, this.title)
                .replace(/{{content}}/g, this.content)
                .replace(/{{afterContent}}/g, this.afterContent)
                .replace(/{{buttons}}/g, buttonsHTML)
                .replace(/{{noButtons}}/g, !this.buttons || this.buttons.length === 0 ? 'modal-no-buttons' : '');

            this.main.innerHTML = html;

            $('body').append(this.main);

            $(this.main).find('.modal-button').each(function (index, el) {
                $(el).on('click', _.bind(function (e) {
                    if (this.buttons[index].close !== false) {
                        this.close();
                    }
                    if (this.buttons[index].onclick){
                        this.buttons[index].onclick.call(this, e);
                    }
                }, me) );
            });
            this.open();
            return this;
        };
        Dialog.prototype.open = function () {
            Dialog.__open($(this.main).children());
        };
        Dialog.__open = function(main){
            var main = $(main);
            if ($('.modal-overlay').length === 0) {
                var overlay = document.createElement('div');
                overlay.className = 'modal-overlay';
                $('body').append(overlay);
            }
            var isPopover = main.hasClass('popover');
            var isPopup = main.hasClass('popup');
            if (!isPopover && !isPopup) {
                main.css({marginTop: -main.outerHeight() / 2 + 'px'});
            }

            var clientLeft = main[0].clientLeft;//触发浏览器repaint

            main.trigger('open');

            // Classes for transition in
            $('.modal-overlay').addClass('modal-overlay-visible');

            main.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
                if (main.hasClass('modal-out')){
                    main.trigger('closed');
                } else {
                    main.trigger('opened');
                }
            });
            return true;
        };
        Dialog.prototype.close = function () {
            return Dialog.__close($(this.main).children());
        };
        Dialog.__close = function(main){
            var main =  $(main) || '.modal-in';

            $('.modal-overlay').removeClass('modal-overlay-visible');
            main.trigger('close');
            var isPopup = main.hasClass('popup');
            var removeOnClose = main.hasClass('remove-on-close');
            if (!main.hasClass('popover')) {
                main.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
                    if (main.hasClass('modal-out')){
                        main.trigger('closed');
                    } else {
                        main.trigger('opened');
                    }
                    if (!isPopup){
                        main.remove();
                    }
                    if (isPopup){
                        main.removeClass('modal-out').hide();
                    }
                    if (removeOnClose){
                        main.remove();
                    }
                });
            } else {
                main.removeClass('modal-in modal-out').trigger('closed').hide();
                if (removeOnClose){
                    main.remove();
                }
            }
            return true;
        };
        return Dialog;
    }
);