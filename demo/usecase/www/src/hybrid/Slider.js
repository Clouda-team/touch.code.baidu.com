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
    var sliderApi = runtime.component.slider;


    /**
     * @constructor
     *
     * Slider 初始化参数;
     * @param {Object} options 有创建独立slider所需要的条件
     *
     * @param {String} [options.id] slider实例id
     * @param {String} [options.top=0] slider距离屏幕top的坐标
     * @param {String} [options.left=0] slider距离屏幕left的坐标
     * @param {String} [options.width] slider像素宽度，默认全屏
     * @param {String} [options.height] slider像素高度，默认全屏
     * @param {String} [options.bgColor] 背景颜色，默认透明

     * @param {Obeject} [options.images] 图片json数据 {}
    
     * @param {Function} [options.tap] 点击slider的事件回调
     * @param {Function} [options.slide] 发生slide的事件回调

     * param {String} [options.onclick] 点击slider的事件回调

     * @returns this
     */
    var Slider = function (options) {
        Control.call(this, options);
        this._init(options);
        return this;
    };
    
    //继承control类;
    lib.inherits(Slider, Control);

    Slider.prototype.constructor = Slider;

    /**
     * @private
     * 实例初始化,根据传参数自动化实例方法调用, 私有方法;
     * @param {Object} options 创建layer的初始化参数
     */
    Slider.prototype._init = function(options){
        
        this._initEvent();
        
        this.render();

        return this;
    };

    //默认属性
    Slider.prototype.type = "slider";

    /**
     * @private
     * 事件初始化
     * @returns this
     */
    Slider.prototype._initEvent = function(){
        var me = this;

        sliderApi.on('tap',function(event){
            me.tap&&me.tap.apply(me,arguments);
            me.fire('tap',arguments,me);
        },me.id,me);

        sliderApi.on('slide',function(event){
            me.slide&&me.slide.apply(me,arguments);
            me.fire('slide',arguments,me);
        },me.id,me);

        //销毁之后撤销绑定
        me.on("afterdistory",function(){
            sliderApi.off('tap','all',me.id,me);
            sliderApi.off('slide','all',me.id,me);
        });



        return me;
    };
    
    /**
     * 创建渲染页面
     * @returns this 当前实例
     */
    Slider.prototype.paint = function(){
        var me = this;
        if(isRuntimeEnv){
            sliderApi.add(me.id,{
                top:me.top,
                left:me.left,
                width: me.width,
                height: me.height,
                fixed: me.fixed
            });

            sliderApi.addItems(me.id,{
                images:me.images
            });

            if(me.bgColor){
               //@todo 处理颜色
                sliderApi.setConfig(me.id,{
                    backgroundColor:me.bgColor
                })
            };

            //是否添加指示器
            if(me.hasIndicator){
                sliderApi.setupIndicator(me.id,{
                    activeColor:me.activeColor,
                    inactiveColor:me.inactiveColor
                });
            };


        }
        return this;
    };

    //prev
    Slider.prototype.prev = function(){
        sliderApi.prev(me.id);
    };

    //next
    Slider.prototype.next = function(){
        sliderApi.next(me.id);
    };

    //to
    Slider.prototype.slideTo = function(index){
        sliderApi.slideTo(this.id,index,true)
    };

    /**
     * 销毁
     * @returns this
     */
    Slider.prototype.destroy = function(){
        sliderApi.remove(this.id);
        Control.prototype.destroy.apply(this, arguments);
    };

    return Slider;
});
