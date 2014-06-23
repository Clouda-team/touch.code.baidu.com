define(

    /**
     * @class Slider
     * @extends WebControl
     * @inheritable
     */

    function (require) {


        var lib = require('../common/lib');
        var Control = require('./WebControl');
        var blend = require('./blend');
        
        var interval;

        // utilities
        // offload a functions execution
        var offloadFn = lib.offloadFn;
        // check browser capabilities
        var browser = {
            addEventListener: !!window.addEventListener,
            touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
            transitions: (function(temp) {
                var props = ['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
                for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
                return false;
            })(document.createElement('swipe'))
        };

        var slidePos;

        // setup initial vars
        var start = {};
        var delta = {};
        var isScrolling;


        function Slider(options) {
            //继承属性
            Control.call(this, options);
            
            if (!this.main) {
                return;
            }
            var element = this.main;
            this.index = parseInt(this.startSlide, 10) || 0;

            // console.log(this.index);
            var _this = this;
            // setup event capturing
            this.events = {
                handleEvent: function(event) {
                    switch (event.type) {
                        case 'touchstart':
                            blend.getUI(event.srcElement)._start(event);
                            break;
                        case 'touchmove':
                            blend.getUI(event.srcElement)._move(event);
                            break;
                        case 'touchend':
                            offloadFn(blend.getUI(event.srcElement)._end(event));
                            break;
                        case 'webkitTransitionEnd':
                        case 'msTransitionEnd':
                        case 'oTransitionEnd':
                        case 'otransitionend':
                        case 'transitionend':
                            offloadFn(this.transitionEnd(event));
                            break;
                        case 'resize':
                            offloadFn(_this._setup.call());
                            break;
                    }
                    if (options.stopPropagation){
                        event.stopPropagation();
                    }
                },
                transitionEnd: function(event) {
                    if (parseInt(event.target.getAttribute('data-index'), 10) == _this.index) {
                        if (_this.auto){
                            _this.begin();
                        }
                        if (typeof options.transitionEnd === 'function') {
                            options.transitionEnd.call(event, _this.index, _this.slides[_this.index]);
                        }
                    }
                }
            };

            // trigger setup
            this._setup();

            // start auto slideshow if applicable
            if (this.auto){
                this.begin();
            }


            // add event listeners
            if (browser.addEventListener) {

                // set touchstart event on element
                if (browser.touch){
                    element.addEventListener('touchstart', this.events, false);
                }

                if (browser.transitions) {
                    element.addEventListener('webkitTransitionEnd', this.events, false);
                    element.addEventListener('msTransitionEnd', this.events, false);
                    element.addEventListener('oTransitionEnd', this.events, false);
                    element.addEventListener('otransitionend', this.events, false);
                    element.addEventListener('transitionend', this.events, false);
                }

                // set resize event on window
                window.addEventListener('resize', this.events, false);

            }
            return this;
        }

        lib.inherits(Slider, Control);


        Slider.prototype.auto = 0;
        Slider.prototype.speed = 300;
        Slider.prototype.continuous = true;
        Slider.prototype.slides = null;
        Slider.prototype.width = 0;
        
        //1. private common function
        Slider.prototype._translate = function (index, dist, speed) {
            var slide = this.slides[index];
            var style = slide && slide.style;

            if (!style) return;

            style.webkitTransitionDuration =
                style.MozTransitionDuration =
                    style.msTransitionDuration =
                        style.OTransitionDuration =
                            style.transitionDuration = speed + 'ms';

            style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
            style.msTransform =
                style.MozTransform =
                    style.OTransform = 'translateX(' + dist + 'px)';
        };
        

        Slider.prototype._setup = function() {
            // cache this.slides
            var container = this.main.children[0];
            this.slides = this.main.children[0].children;//this.main.children;

            // create an array to store current positions of each slide
            slidePos = new Array(this.slides.length);

            // container's is num* times bigger than this.main width
            this.width = this.main.getBoundingClientRect().width || this.main.offsetWidth;

            container.style.width = (this.slides.length * this.width) + 'px';

            // stack elements
            var pos = this.slides.length;
            while(pos--) {

                var slide = this.slides[pos];

                slide.style.width = this.width + 'px';
                slide.setAttribute('data-index', pos);

                if (browser.transitions) {
                    slide.style.left = (pos * -this.width) + 'px';
                    this.__move(pos, this.index > pos ? -this.width : (this.index < pos ? this.width : 0), 0);
                }

            }

            if (!browser.transitions) {
                element.style.left = (this.index * -this.width) + 'px';
            }

            container.style.visibility = 'visible';

        };

        Slider.prototype._slide = function(to, slideSpeed) {
            if (this.index == to){
                return;
            }
            if (browser.transitions) {
                var diff = Math.abs(this.index-to) - 1;
                var direction = Math.abs(this.index-to) / (this.index-to); // 1:right -1:left
                while (diff--){
                    this.__move((to > this.index ? to : this.index) - diff - 1, this.width * direction, 0);
                }
                this.__move(this.index, this.width * direction, slideSpeed || this.speed);
                this.__move(to, 0, slideSpeed || this.speed);
            }
            this.index = to;
            offloadFn(this.callback && this.callback(this.index, this.slides[this.index]));
            return this;
        };
        Slider.prototype.__move = function(index, dist, speed) {
            this._translate(index, dist, speed);
            slidePos[index] = dist;
        };


        //2. private event function
        //touch: _start _move _end

        Slider.prototype._start = function(event) {
            var touches = event.touches[0];
            // measure start values
            start = {
                // get initial touch coords
                x: touches.pageX,
                y: touches.pageY,
                // store time to determine touch duration
                time: +(new Date())
            };
            // used for testing first move event
            isScrolling = undefined;
            // reset delta and end measurements
            delta = {};
            // attach touchmove and touchend listeners
            this.main.addEventListener('touchmove', this.events, false);
            this.main.addEventListener('touchend', this.events, false);
        };
        Slider.prototype._move = function(event) {
            // ensure swiping with one touch and not pinching
            if ( event.touches.length > 1 || event.scale && event.scale !== 1){
                return;
            }
            if (this.disableScroll){
                event.preventDefault();
            }
            var touches = event.touches[0];

            // measure change in x and y
            delta = {
                x: touches.pageX - start.x,
                y: touches.pageY - start.y
            };

            // determine if scrolling test has run - one time test
            if ( typeof isScrolling == 'undefined') {
                isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
            }

            // if user is not trying to scroll vertically
            if (!isScrolling) {

                // prevent native scrolling
                event.preventDefault();

                // stop slideshow
                this.stop();

                // increase resistance if first or last slide
                delta.x =
                    delta.x /
                        ( (!this.index && delta.x > 0  ||             // if first slide and sliding left
                             this.index == this.slides.length - 1  &&      // or if last slide and sliding right
                             delta.x < 0                       // and if sliding at all
                            ) ? ( Math.abs(delta.x) / this.width + 1 ) : 1 );  // no resistance if false

                // translate 1:1
                this._translate(this.index-1, delta.x + slidePos[this.index-1], 0);
                this._translate(this.index, delta.x + slidePos[this.index], 0);
                this._translate(this.index+1, delta.x + slidePos[this.index+1], 0);

            }

        };
        Slider.prototype._end = function(event) {

            // measure duration
            var duration = +(new Date()) - start.time;

            // determine if slide attempt triggers next/prev slide
            var isValidSlide =
                Number(duration) < 250   &&            // if slide duration is less than 250ms
                     Math.abs(delta.x) > 20  ||          // and if slide amt is greater than 20px
                     Math.abs(delta.x) > this.width/2;      // or if slide amt is greater than half the width

            // determine if slide attempt is past start and end
            var isPastBounds =
                !this.index && delta.x > 0  ||                          // if first slide and slide amt is greater than 0
                     this.index == this.slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

            // determine direction of swipe (true:right, false:left)
            var direction = delta.x < 0;

            // if not scrolling vertically
            if (!isScrolling) {
                if (isValidSlide && !isPastBounds) {
                    if (direction) {
                        this.__move(this.index-1, -this.width, 0);
                        this.__move(this.index, slidePos[this.index]-this.width, this.speed);
                        this.__move(this.index+1, slidePos[this.index+1]-this.width, this.speed);
                        this.index += 1;
                    } else {
                        this.__move(this.index+1, this.width, 0);
                        this.__move(this.index, slidePos[this.index]+this.width, this.speed);
                        this.__move(this.index-1, slidePos[this.index-1]+this.width, this.speed);
                        this.index += -1;
                    }
                    if (typeof this.callback === 'function') {
                        this.callback(this.index, this.slides[this.index]);
                    }
                } else {
                    this.__move(this.index-1, -this.width, this.speed);
                    this.__move(this.index, 0, this.speed);
                    this.__move(this.index+1, this.width, this.speed);
                }
            }

            // kill touchmove and touchend event listeners until touchstart called again
            this.main.removeEventListener('touchmove', this.events, false);
            this.main.removeEventListener('touchend', this.events, false);

        };
        
        //3. public  apis
        Slider.prototype.dispose =  function() {


            //call parents dispose;
            Control.prototype.dispose();


            var element = this.main;
            // cancel slideshow
            this.stop();

            // reset element
            element.style.width = 'auto';
            element.style.left = 0;

            // reset slides
            var pos = this.slides.length;
            while(pos--) {

                var slide = this.slides[pos];
                slide.style.width = '100%';
                slide.style.left = 0;

                if (browser.transitions) this._translate(pos, 0, 0);

            }
            // removed event listeners
            if (browser.addEventListener) {
                element.removeEventListener('touchstart', this.events, false);
                element.removeEventListener('webkitTransitionEnd', this.events, false);
                element.removeEventListener('msTransitionEnd', this.events, false);
                element.removeEventListener('oTransitionEnd', this.events, false);
                element.removeEventListener('otransitionend', this.events, false);
                element.removeEventListener('transitionend', this.events, false);
                window.removeEventListener('resize', this.events, false);
            }

        };

        
        Slider.prototype.prev = function() {
            if (this.index){
                this._slide(this.index-1);
            } else if (this.continuous){
                this._slide(this.slides.length-1);
            }
            return this;
        };
        Slider.prototype.next = function() {
            // console.log(this.index);
            if (this.index < this.slides.length - 1) {
                this._slide(this.index+1);
            } else if (this.continuous) {
                this._slide(0);
            }
            return this;
        };

        Slider.prototype.begin = function() {
            var _this = this;
            if (interval) {
                clearTimeout(interval);
            }
            interval = setTimeout(function(){_this.next();}, this.auto);
        };

        Slider.prototype.stop = function() {
            // this.auto = 0;
            clearTimeout(interval);
        };

        return Slider;
    }
);