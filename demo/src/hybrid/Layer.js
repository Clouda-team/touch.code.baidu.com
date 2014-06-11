/**
 * Layer类，内含一个web容器，可以放置在手机屏幕的任何位置，动画可自定义
 * @class Layer
 * @extends Control
 * @static
 * @inheritable
 */
define(function (require) {

    var blend = require('./blend');
    var lib = require('../common/lib');
    var runtime = require('./runtime');
    var Control = require('./Control');
    //是否是runtime运行环境
    var isRuntimeEnv = true;//main.inRuntime();//runtime.isRuntimeEnv&&runtime.isRuntimeEnv();
    var layerApi = runtime.layer;

    //layer注册事件
    layerApi.on('in',function(event){
        var layer =  blend.get(event['data']);
        if(layer && layer.onhide){
            layer.onshow();
        }
    });

    layerApi.on('out',function(event){
        var layer =  blend.get(event['data']);
        if(layer && layer.onhide){
            layer.onhide();
        }
    });

    /*layerApi.on('destroy',function(event){
        var layer =  blend.get(event['data']);
        if(layer && layer.destroy){
            layer.destroy();
        }
    });*/

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
        /*if(!(this instanceof Layer)){
            return new Layer(options);
        }*/
        Control.call(this, options);
        
        this._init(options);
        return this;
    };
    
    //继承control类;
    lib.inherits(Layer,Control);

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
        
        this.render();
        
        options.active && this.in();

        return this;
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
     * @private
     * 事件初始化
     * @returns this
     */
    Layer.prototype._initEvent = function(){
        var me = this;
        var cancelTime = null;
        /*var clearTime = function(){
            cancelTime&&clearTimeout(cancelTime);
        }*/
        //下拉刷新回调，建议在相应的document里面触发
        if(me.ptrFn){
            layerApi.on("layerPullDown",function(event){
                me.ptrFn.apply(me,arguments);
            },me.id,me);
        }
        layerApi.on('layerCreateSuccess',function(event){
            cancelTime = setTimeout(function(){
                layerApi.layerStopLoading(me.id);
            },me.loadingTime);
            me.afterrender && me.afterrender.apply(me,arguments);
        },me.id,me);
        layerApi.on('layerLoadFinish',function(event){
            clearTimeout(cancelTime);
            if(event['url']!==me.url){
                me.url = event['url'];
                me.changeUrl&&me.changeUrl.call(me,event,me.url);
            }
            me.onload&&me.onload.apply(me,arguments);
        },me.id,me);

        //销毁之后撤销绑定
        me.on("afterdestory",function(){
            clearTimeout(cancelTime);
            me.ptrFn&&layerApi.off('layerPullDown',"all",me.id,me);
            layerApi.off('layerCreateSuccess',"all",me.id,me);
            layerApi.off('layerLoadFinish',"all",me.id,me);
        });
        return me;
    };
    
    /**
     * 创建渲染页面
     * @returns this 当前实例
     */
    Layer.prototype.paint = function(){
        var me = this;
        if(isRuntimeEnv){
            layerApi.prepare(me.id,{
                url: me.url,
                top:me.top,
                left:me.left,
                bottom: me.bottom,
                right: me.right,
                pullToRefresh: me.pullToRefresh
            });
            //设置loading背景

        }else{
            
        }
        return this;
    };

    /**
     * 激活页面
     * @returns this 当前实例
     */
    Layer.prototype.in = function(){
        var me = this;
        //检查侧layer是否已经销毁
        if(!layerApi.isAvailable(this.id)){
            me.render();
        }
        //Control.prototype.in.apply(me, arguments);
        layerApi.resume(me.id,{
            reverse: me.reverse,
            fx: me.fx,
            duration: me.duration,
            timingFn: me.timingFn
        });

        return this;
    };


    /**
     * 当前layer退场，返回上一个Layer
     * @returns this 当前实例
     */
    Layer.prototype.out = function( options ){
        //Control.prototype.out.apply(this, arguments);
        layerApi.back();
        return this;
    };

    /**
     * 重新刷新页面
     *
     * @param {String} url 刷新页面时所用的url
     * @returns this
     */
    Layer.prototype.reload = function(url){
        if(!url){
            url = this.url;
        }
        layerApi.reload(this.id,url);
        return this;
    };

    /**
     * 停止layer拉动刷新状态
     *
     * returns this
     */
    Layer.prototype.stopPullRefresh = function(){
        layerApi.stopPullRefresh(this.id);
        return this;
    };

    /**
     * 销毁此layer
     * @returns this
     */
    Layer.prototype.destroy = function(){
        //this.fire("_initEvent");
        Control.prototype.destroy.apply(this, arguments);
    };

    return Layer;
});
