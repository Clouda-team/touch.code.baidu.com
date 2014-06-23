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


        var Popover = function (modal, target, removeOnClose) {
            //CAUTION: 这里不继承dialog的构造函数，自己构造
            Control.call(this, {
                modal : modal,
                target : target,
                removeOnClose : removeOnClose
            });

            if (typeof this.modal === 'string' && this.modal.indexOf('<') >= 0) {
                var _modal = document.createElement('div');
                _modal.innerHTML = this.modal;
                if (_modal.childNodes.length > 0) {
                    modal = _modal.childNodes[0];
                    if (this.removeOnClose){
                        this.modal.classList.add('remove-on-close');
                    }
                    $('body').append(this.modal);
                } else {
                    return false;
                }
            }
            modal = $(modal);
            target = $(target);
            if (modal.length === 0 || target.length === 0){
                return false;
            }

            $(this.main).append(modal).appendTo("body");


            if (modal.find('.popover-angle').length === 0) {
                modal.append('<div class="popover-angle"></div>');
            }
            modal.show();

            this._resizeHandler();

            $(window).on('resize', _.bind(this._resizeHandler, this));
            modal.on('close', function () {
                $(window).off('resize', _.bind(this._resizeHandler, this));
            });

            this.open();
            return this;
        };

        lib.inherits(Popover, Dialog);

        Popover.prototype.removeOnClose = true;
        Popover.prototype.type = "popover";



        Popover.prototype._resizeHandler = function(){
            var modal = $(this.modal);
            var target = $(this.target);


            modal.css({left: '', top: ''});
            var modalWidth =  modal.width();
            var modalHeight =  modal.height(); // 13 - height of angle
            var modalAngle = modal.find('.popover-angle');
            var modalAngleSize = modalAngle.width() / 2;
            modalAngle.removeClass('on-left on-right on-top on-bottom').css({left: '', top: ''});

            var targetWidth = target.outerWidth();
            var targetHeight = target.outerHeight();
            var targetOffset = target.offset();
            var targetParentPage = target.parents('.page');
            if (targetParentPage.length > 0) {
                targetOffset.top = targetOffset.top - targetParentPage[0].scrollTop;
            }

            var windowHeight = $(window).height();
            var windowWidth = $(window).width();

            var modalTop = 0;
            var modalLeft = 0;
            var diff = 0;
            // Top Position
            var modalPosition = 'top';

            if ((modalHeight + modalAngleSize) < targetOffset.top) {
                // On top
                modalTop = targetOffset.top - modalHeight - modalAngleSize;
            }
            else if ((modalHeight + modalAngleSize) < windowHeight - targetOffset.top - targetHeight) {
                // On bottom
                modalPosition = 'bottom';
                modalTop = targetOffset.top + targetHeight + modalAngleSize;
            }
            else {
                // On middle
                modalPosition = 'middle';
                modalTop = targetHeight / 2 + targetOffset.top - modalHeight / 2;
                diff = modalTop;
                if (modalTop < 0) {
                    modalTop = 5;
                }
                else if (modalTop + modalHeight > windowHeight) {
                    modalTop = windowHeight - modalHeight - 5;
                }
                diff = diff - modalTop;
            }
            // Horizontal Position
            if (modalPosition === 'top' || modalPosition === 'bottom') {
                modalLeft = targetWidth / 2 + targetOffset.left - modalWidth / 2;
                diff = modalLeft;
                if (modalLeft < 5) modalLeft = 5;
                if (modalLeft + modalWidth > windowWidth) modalLeft = windowWidth - modalWidth - 5;
                if (modalPosition === 'top') modalAngle.addClass('on-bottom');
                if (modalPosition === 'bottom') modalAngle.addClass('on-top');
                diff = diff - modalLeft;
                modalAngle.css({left: (modalWidth / 2 - modalAngleSize + diff) + 'px'});
            }
            else if (modalPosition === 'middle') {
                modalLeft = targetOffset.left - modalWidth - modalAngleSize;
                modalAngle.addClass('on-right');
                if (modalLeft < 5) {
                    modalLeft = targetOffset.left + targetWidth + modalAngleSize;
                    modalAngle.removeClass('on-right').addClass('on-left');
                }
                if (modalLeft + modalWidth > windowWidth) {
                    modalLeft = windowWidth - modalWidth - 5;
                    modalAngle.removeClass('on-right').addClass('on-left');
                }
                modalAngle.css({top: (modalHeight / 2 - modalAngleSize + diff) + 'px'});
            }

            // Apply Styles
            modal.css({top: modalTop + 'px', left: modalLeft + 'px'});
        };

        return Popover;
    }
);