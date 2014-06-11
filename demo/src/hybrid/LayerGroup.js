/**
 * LayerGruop类，内含多个Layer，可以放置在手机屏幕的任何位置，系统会自动管理多个Layer之间的滑动关系
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
    var layerApi = runtime.layerGroup;

    /**
     * @constructor;
     *
     * LayerGroup结构化函数;
     * @extends Control
     *
     * @param {Object} options 有创建独立layer所需要的条件
     * @param {Array} options.layers LayerGroup中的Layer参数options
     * @param {String} options.layers.url layer的link
     * @param {Boolean} [options.layers.active=false] layer默认展示
     * @param {Boolean} [options.layers.autoload=false] 是否自动加载
     * @param {String} [options.layers.id] layer的id
     * @param {Function} [options.layers.beforerender] webview容器render开始前的回调
     * @param {Function} [options.layers.afterrender] webview容器render成功的回调
     * @param {Function} [options.layers.renderfail] webview容器render失败的回调
     * @param {Function} [options.layers.onload] webview页面onload的回调
     * @param {Function} [options.layers.onshow] layer被唤起时会触发此事件
     * @param {Function} [options.layers.onhide] layer被隐藏时会触发此事件
     *
     * @param {boolean} [options.layers.pullToRefresh] 是否支持下拉刷新
     * @param {Array|String} [options.layers.ptrIcon] 下拉时显示的图标。可以传入Array，下标0、1、2分别表示下拉时显示的图标、提示释放的图标、加载中的图标
     * @param {Array|String} [options.layers.ptrText] 下拉时显示的文字。可以传入Array，下标0、1、2分别表示下拉时显示的文字、提示释放的文字、加载中的文字
     * @param {String} [options.layers.ptrColor] 文字颜色
     * @param {Function} [options.layers.ptrOnsuccess] 成功后的回调
     * @param {Function} [options.layers.ptrOnfail] 失败后的回调
     *
     * @param {string} [options.id] layerGroup实例id
     * @param {string} [options.top=0] layerGroup距离屏幕top的坐标
     * @param {string} [options.left=0] layerGroup距离屏幕left的坐标
     * @param {string} [options.width] layer像素宽度，默认全屏
     * @param {string} [options.height] layer像素高度，默认全屏
     *
     * @param {Function} [options.beforerender] webview容器render开始前的回调
     * @param {Function} [options.afterrender] webview容器render成功的回调
     * @param {Function} [options.renderfail] webview容器render失败的回调
     * @returns this
     */
    var LayerGroup = function (options) {
        /*if(!(this instanceof LayerGroup)){
            return new LayerGroup(options);
        }*/
        Control.call(this, options);
        this._init(options);
    };
    
    //继承于control
    lib.inherits(LayerGroup,Control);

    LayerGroup.prototype.constructor = LayerGroup;

    /**
     * 组件的类型
     *
     * @cfg {String} type
     */

    LayerGroup.prototype.type = "layerGroup";
    /**
     * @private
     * 对象初始化, 私有方法;
     * @param {Object} options 创建group的初始化参数,
     * @returns this
     */
    LayerGroup.prototype._init = function(options){
        var me = this;
        var layers = {};
        var activeId = null;
        //结构化layers为object
        if(!me.layers || !me.layers.length){
            return ;
        }

        for(var i=0,len=me.layers.length;i<len;i++){
            if(!me.layers[i].id){
                me.layers[i].id = lib.getUniqueID(); 
            }
            if(me.layers[i].active){
                activeId = me.layers[i].id;
            }
            layers[me.layers[i].id]  = me.layers[i];
        };

        me._layers = layers;
        
        me.activeId = activeId||me.layers[0].id;
        
        
        /* alert(me.get('activeId')); */
        
        //监听事件
        me._initEvent();

        me.render();

        //todo;
        return this;
    };

    /**
     * @private
     * 事件初始化
     * @returns this
     */
    LayerGroup.prototype._initEvent = function (){
        var me = this;
        var selectedFn = function(event){
            if(event['groupId'] == me.id){
                me.onselected && me.onselected(event);
                if(me._layers[event['layerId']].onshow){
                    me._layers[event['layerId']].onshow.call(me);
                }
                if(me['activeId']!==event['layerId'] && me._layers[me['activeId']].onhide){
                    me._layers[me['activeId']].onhide.call(me);
                }
                me.activeId = event['layerId'];
            }
        };

        var scrollFn = function(){
            var oTime = +new Date();
            var _op = 0;
            return function(event){
               var nTime = +new Date();
               var  _op = event['groupPixelOffset'];
               var _stop = (_op==0||_op==1);
               if(!_stop && (nTime-oTime)<100){
                 return
               }
               oTime = nTime;
               var _swipe = event['groupPixelOffset']-_op>0?"left":"right";
               var _dir = event['layerId']==me.activeId?"left":"right"; 
               
                event['swipe']=_stop?"stop": _swipe;
                event['dir']=_stop?"stop": _dir;
                if(event['groupId']==me.id){
                    me.onscroll && me.onscroll.call(me,event);
                }
            }
        };

        document.addEventListener('groupSelected',selectedFn, false);
        document.addEventListener('groupScrolled', scrollFn(), false);

        return null;
        /*document.addEventListener('groupStateChanged', function(event) {
            console.log('groupStateChanged ' + event['groupId'] + '  ' + event['layerId'] + '  ' + event['groupState']);
        }, false);*/
    };

    /**
     * 创建渲染页面
     * @returns this
     */
    LayerGroup.prototype.paint = function(){
        var me = this;
        if(isRuntimeEnv){
            var options = {
                left:me.left,
                top:me.top,
                width: me.width,
                height: me.height,
                active : me.activeId
            }
            layerApi.create(me.id,me.layers,options);
        }else{
            
        }
        return this;
    };

    /**
     * 激活相应layer
     *
     * @param {String} layerId layer id
     * @returns this
     */
    LayerGroup.prototype.active = function( layerId ){
        layerApi.showLayer(this.id, layerId);
        return this;
    };

    /**
     * 删除layer
     * @param {string} layerId group中layer id
     * @returns this
     */
    LayerGroup.prototype.remove = function( layerId ){
        layerApi.removeLayer(this.id,layerId);
        delete this._layers[layerId];
        return this;
    };

    /**
     * 增加layer
     * @param {Object} layerOptions layer Options
     * @param {Number} [index=last] 插入到第index个下标之后
     * @returns {Layer}
     */
    LayerGroup.prototype.add = function( layerOptions, index ){
    
        if(!layerOptions.id) layerOptions.id = lib.getUniqueID();
        
        layerApi.addLayer(this.id, layerOptions, index);
        
        this._layers[layerOptions.id] = layerOptions;
        
        return this;
    };
    
    /**
     * 更新layer url
     * @param {Object} layer Options
     * @param {Number} [index=last] 插入到第index个下标之后
     * @returns {Layer}
     */
    LayerGroup.prototype.updata = function(layerId, layerOptions){
    
        layerApi.updateLayer(this.id,layerId,layerOptions);
        
        lib.extend(this._layers[layerOptions.id],layerOptions);
        return this;
    };

    /**
     * 销毁此layerGroup
     * @returns this
     */
    LayerGroup.prototype.destroy = function( options ){
        Control.prototype.destroy.apply(this, arguments);

        if(isRuntimeEnv){
            
        }else{

        }
    };

    return LayerGroup;
});