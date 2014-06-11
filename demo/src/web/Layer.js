define(

    /**
     * Layer类，内含一个web容器，可以放置在手机屏幕的任何位置，动画可自定义
     * @class Layer
     * @extends WebControl
     * @static
     * @inheritable
     */

    function (require) {


        var lib = require('../common/lib');
        var Control = require('./WebControl');
        var blend = require('./blend');
        var zepto = require('../../third_party/zepto.js');
        
        var layerApi = require('./layer/layerapi');


        /**
         * @constructor
         *
         * Layer 初始化参数;
         * @param {Object} options 有创建独立layer所需要的条件
         *
         * @param {String} options.url 页面url
         * @param {String} [options.id] layer实例id
         * @param {String} [options.top=0] layer距离屏幕top的坐标
         * @param {String} [options.left=0] layer距离屏幕left的坐标
         * @param {String} [options.width] layer像素宽度，默认全屏
         * @param {String} [options.height] layer像素高度，默认全屏
         * @param {boolean} [options.active] 是否立即激活
         *
         * @param {boolean} [options.reverse] =true 动画是否反向
         * @param {String} [options.fx] ="none" 无动画
         * @param {String} [options.fx] ="slide" 默认从右往左，出场从左往右
         * @param {String} [options.fx] ="pop" 弹出
         * @param {String} [options.fx] ="fade" 透明度渐显
         * @param {number} [options.duration] 动画持续时间s
         * @param {String} [options.timingFn] 动画时间线函数@todo
         * @param {String} [options.cover] 是否覆盖效果，默认是推拉效果@todo

         *
         * @param {Function} [options.afterrender] webview容器render成功的回调
         * @param {Function} [options.onload] webview页面onload的回调
         * @param {Function} [options.changeUrl] webview url改变的回调
         *
         * @param {Function} [options.onshow] layer被唤起时会触发此事件
         * @param {Function} [options.onhide] layer被隐藏时会触发此事件
         *
         * @param {boolean} options.pullToRefresh 是否支持下拉刷新
         * @param {Array|String} options.ptrIcon 下拉时显示的图标。可以传入Array，下标0、1、2分别表示下拉时显示的图标、提示释放的图标、加载中的图标@todo
         * @param {Array|String} options.ptrText 下拉时显示的文字。可以传入Array，下标0、1、2分别表示下拉时显示的文字、提示释放的文字、加载中的文字@todo
         * @param {String} options.ptrColor 文字颜色@todo
         * @param {Function} options.ptrFn 下拉刷新回调
         
         * @returns this
         */
        var Layer = function (options) {
            
            Control.call(this, options);
            
            this._init(options);
            return this;
        };
        
        //继承control类;
        lib.inherits(Layer,Control);

        //初始化空函数
        Layer.prototype.onload = Layer.prototype.onshow = Layer.prototype.onhide = lib.noop;

        Layer.prototype.constructor = Layer;

        /**
         * @private
         * 实例初始化,根据传参数自动化实例方法调用, 私有方法;
         * @param {Object} options 创建layer的初始化参数
         */
        Layer.prototype._init = function(options){
            //处理options值;
            
            
            //监听事件
            this._initEvent();
            var me = this;
            this.render(function(){

                //pull to refresh
                if (me.ptrFn) {
                    me.on('layerPullDown',function(event){
                        me.ptrFn();
                    });
                    layerApi.startPullRefresh(me);
                }
                options.active && me.in();
            },function(){
                //提示用户加载失败

            });
            //这里可以提示用户 doing render

            return this;
        };

        Layer.prototype._initEvent = function  () {
            var me = this;
            // var cancelTime = null;
            
            //native 下 layer 的载入和载出会触发in 和 out 事件 
            //web 下 layer的载入和 载出 均是 触发 自定义事件，自定义事件的this 是 Layer实例 （事件名相同： in out）
            me.on('in',me.onshow);

            me.on('out',me.onhide);

            //onload 与hybird 事件名保持一致
            me.on('onload',me.onload);

            //me.on('layerCreateSuccess',me.afterrender);
            //after render
            me.on('afterrender',me.afterrender);

            // me.on('load',function(event){
            //     this.onload();
            // });

            //loading...
            //layerCreateSuccess

            
            
            
            

            //!FIXME SHOULD BE destroy
            me.on('beforedestroy',function(event){
                if (me.ptrFn ) {
                    layerApi.stopPullRefresh(me);
                }
                // me.ptrFn  &&  me.off('layerPullDown');
                me.off('afterrender');
                me.off('onload');
                me.off('in',me.onshow);
                me.off('out',me.onhide);
            });
        };


        //默认属性
        Layer.prototype.type = "layer";


        /**
         * loading状态出现的时间
         *
         * @cfg {Number} loadingTime 毫秒ms;
         */
        Layer.prototype.loadingTime = 500;
        

        /**
         * 创建渲染页面
         * @returns this 当前实例
         */
        Layer.prototype.paint = function(cb,fail){
            var me = this;
            
            
            //1. load url
            layerApi.prepare(me.id,{
                url: me.url,
                top:me.top,
                left:me.left,
                bottom: me.bottom,
                right: me.right,
                onsuccess:cb,//ADDED 
                onfail:fail,
                pullToRefresh: me.pullToRefresh
            },me);
            
            //3. set pullToRefresh
            
            //4. set  position before animate.
            $(this.main).addClass('page');

            return this;
        };

        var parentlayer = $(".page");

        /**
         * 激活页面
         * @returns this 当前实例
         */
        Layer.prototype.in = function(){
            /*
                reverse: me.reverse,
                fx: me.fx,
                duration: me.duration,
                timingFn: me.timingFn
            */
            this.fire("changeUrl");

            //1. 找到当前page，然后动画走掉
            parentlayer.removeClass("page-on-center").addClass("page-from-center-to-left");
            // $(this.main).removeClass('page-from-left-to-center page-on-left').addClass('page-on-center');

            //2. 滑入新page
            $(this.main).addClass('page-on-right').appendTo(".pages").addClass('page-from-right-to-center');
            
            var me = this;
            
            // state
            me.state = "slide";
            
            //入场动画结束
            this.animationEnd(function(){
                parentlayer.removeClass("page-from-center-to-left").addClass("page-on-left");
                $(me.main).removeClass("page-from-right-to-center page-on-right").addClass('page-on-center');
                me.fire("aftershow");
                me.state = "";
            });
            return this;
        };

        /**
         * 当前layer退场，返回上一个Layer
         * @returns this 当前实例
         */
        Layer.prototype.out = function( options ){
            //go back
            var me = this;
            
            
            parentlayer.removeClass("page-on-left").addClass("page-from-left-to-center");
            
            $(me.main).removeClass("page-on-center").addClass('page-from-center-to-right');

            me.state = "slide";

            //出场动画结束
            this.animationEnd(function(){
                me.dispose();
                parentlayer.removeClass("page-from-left-to-center").addClass("page-on-center");
                $(me.main).removeClass('page-from-center-to-right').addClass("page-on-right");
                me.fire("afterhide");
                me.state = "";
            });
            return this;
        };

        /**
         * 重新刷新页面
         *
         * @param {String} url 刷新页面时所用的url
         * @returns this
         */
        Layer.prototype.reload = function(url){
            //reload
            //1. destroy
            // this.destroy();
            //2. got items
            var obj = {
                url :url,
                onsuccess:this.onsuccess,
                onfail:this.onfail,
                top:this.top,
                left:this.left,
                right:this.right,
                bottom:this.bottom
            };
            //TODO IT 
            // this.fire("changeUrl");
                    
            layerApi.prepare(this.id , obj, this);

            //清空main
            $("#"+this.main.id).html('');


            //贴上prepare的内容
            layerApi.resume(this.id , {}, this);

            return this;
        };

        /**
         * 开始layer拉动刷新状态
         *
         * returns this
         */
        Layer.prototype.startPullRefresh = function(context){
            //set pull to refresh
            layerApi.startPullRefresh(context || this);
            return this;
        };

        /**
         * 停止layer拉动刷新状态
         *
         * returns this
         */
        Layer.prototype.stopPullRefresh = function(context){
            //set pull to refresh
            layerApi.stopPullRefresh(context|| this);
            return this;
        };
        Layer.prototype.endPullRefresh = function(context){
            //end pull to refresh loading status
            layerApi.endPullRefresh(context|| this);
            return this;
        };

        /**
         * 销毁此layer
         * @returns this
         */
        Layer.prototype.destroy = function(){
            Control.prototype.destroy.apply(this, arguments);
        };


        return Layer;
    }
);