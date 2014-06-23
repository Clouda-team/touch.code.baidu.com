define(
    function (require) {

        /**
         * @class blend.layerApi
         * @singleton
         * @private
         */
        var layer = {};
        var devPR = window.devicePixelRatio || 2;
        var initLayerId = "0";
      
        /**
         * 创建独立layer
         * @method {Function} prepare

         * @param {Object} options Layer的参数
         * @param {String} options.link 页面url
         * @param {Boolean} options.pullToRefresh 是否可以上拉刷新
         * @returns {String} pagerid
         * @private
         */
        layer.prepare = function(layerId, options){
            var layerId = layerId||uniqid();
            var layerOptions = {};
            ['url','pullToRefresh','reverse','fx','duration','timingFn'].forEach(function(n,i){
                if(options[n]!==undefined){
                    layerOptions[n] = options[n];
                }
            });
            window.lc_bridge.prepareLayer(layerId, JSON.stringify(layerOptions));
            return layerId;
        };

        /**
         * 激活创建的layer
         * @method {Function} resume

         * @param {string} layerId 页面layerId
         * @returns pagerid
         * @private
         */
        layer.resume = function(layerId,options){
            var _options = {
                "fx":"slide",
                "reverse":false,
                "duration":"normal"
            };
            if(options){
                options['fx'] && (_options['fx']=options['fx']);
                options['reverse'] && (_options['reverse']=options['reverse']);
                options['duration'] && (_options['duration']=options['duration']);
            }
            window.lc_bridge.resumeLayer(layerId,JSON.stringify(_options));
            layer.fire('in',false,layerId);
        };
        
        /**
         * 退出激活的layer
         * @method {Function} back
         * @returns null
         */
        layer.back = function( layerId ){
            window.lc_bridge.backToPreviousLayer();
            layer.fire('out',false, layerId||layer.getCurrentId());
        };

        /**
         * 刷新独立打开的layer
         * @method {Function} reload
         *
         * @returns layerId
         * @private
         */
        layer.reload = function(layerId,url){
            if(arguments.length==1||arguments.length==0){
                url = layerId;
                layerId = layer.getCurrentId();
            }
            window.lc_bridge.layerLoadUrl(layerId, url);
            return layerId;
        };
        
        /**
         * 销毁独立打开的layer
         * @method {Function} destroy
         *
         * @returns layerId
         * @private
         */
        layer.destroy = function(layerId){
            if(!layerId) layerId = layer.getCurrentId();
            window.lc_bridge.destroyLayer(layerId);
            //layer.fire("destroy",false,layerId);
            return layerId;
        };
        
        /**
         *
         * 取消拉动刷新
         * @method {Function} destroy
         * @returns layerId
         */
        layer.stopPullRefresh = function(layerId){
            if(!layerId) layerId = layer.getCurrentId();
            window.lc_bridge.layerStopRefresh(layerId);
            return layerId;
        };

        /**
         * 检测layerId是否存在，
         * @param {String} layerId
         * @return {Boolean} 是否存在
         */
        layer.isAvailable = function( layerId ){
            return window.lc_bridge.isLayerAvailable(layerId);
        };

        /**
         * 当前页面所在的layer id
         * @return {String} layerId
         */
        layer.getCurrentId = function(){
            return window.lc_bridge.currentLayerId();
        };

        /**
         * 消除页面的loading状态
         * @return {String} layerId
         */
        layer.layerStopLoading = function(layerId){
            layerId = layerId||layer.getCurrentId();
            return window.lc_bridge.layerStopLoading(layerId);
        };
           

        // layer触发的自定义事件
        var events = {
            "layerCreateSuccess":{
                listener:[],
                callback:function(event){
                    var listeners = events['layerCreateSuccess']['listener'];
                    for(var i=0,len=listeners.length;i<len;i++){
                        if(listeners[i].layerId==event['origin']){
                           listeners[i].callback.call(listeners[i].context,event,listeners[i].layerId); 
                        }
                    }
                }
            },
            "layerLoadFinish":{
                listener:[],
                callback:function(event){
                    var listeners = events['layerLoadFinish']['listener'];
                    for(var i=0,len=listeners.length;i<len;i++){
                        if(listeners[i].layerId==event['origin']){
                           listeners[i].callback.call(listeners[i].context,event,listeners[i].layerId); 
                        }
                    }
                }
            },
            //下拉刷新事件
            "layerPullDown" : {
                listener:[],
                callback:function(event){
                    var listeners = events['layerPullDown']['listener'];
                    for(var i=0,len=listeners.length;i<len;i++){
                        if(listeners[i].layerId==event['origin']){
                           listeners[i].callback.call(listeners[i].context,event,listeners[i].layerId); 
                        }
                    }
                }
            }
        };
        
        
        /**
         *
         * 注册layer事件触发
         * @method {Function} on
         *
         * @param {String} type
         * @param {Function} handler
         * @param {String} layerId
         *
         * @returns layerId
         * @private
         */
        layer.on = function(type,handler,layerId,context){
            //re
            layerId = layerId||layer.getCurrentId();
            context = context||layer;

            if(events[type]){
                var i=0,
                    listeners=events[type]['listener'],
                    len=listeners.length;
                for(;i<len;i++){
                    if(listeners[i].layerId==layerId&&listeners[i].callback==handler&&listeners[i].context==context){
                            break;
                        }
                }
                if(i==len){
                   events[type]['listener'].push({
                     layerId:layerId,
                     context:context,
                     callback:handler
                   });
                }
                if(!events[type]['listened']){
                    document.addEventListener(type, events[type].callback,false)
                    events[type]['listened'] = true;
                }
            }else{
                //console.log("不支持此事件");
                events[type] = {
                    listener:[],
                    callback:function(event){
                        var parseData = JSON.parse(event.data);
                        var listeners = events[type]['listener'];
                        event.origin = event['sender']||parseData.origin;
                        event.data = parseData.data;
                        event.reciever = event.target= parseData.target;
                        for(var i=0,len=listeners.length;i<len;i++){
                            listeners[i].callback.call(listeners[i].context,event,listeners[i].layerId);
                        }
                    }
                }
                layer.on(type,handler,layerId,context)
            }
        };
        
        /**
         *
         * 移除layer事件
         * @method {Function} off
         *
         * @param {String} type
         * @param {Function} handler
         * @param {String} layerId
         *
         * @returns layerId
         * @private
         */
        layer.off = function(type,handler,layerId,context){
            layerId = layerId||layer.getCurrentId();
            context = context||layer;
            if(events[type]){
                if(!handler){
                    document.removeEventListener(type,events[type].callback);
                    events[type]['listened'] = false;
                    events[type]['listener'] = [];
                }else{
                    var i=0,
                        listeners=events[type]['listener'],
                        isAll = handler=="all",
                        len=listeners.length;
                    
                    for(;i<len;i++){
                        if(listeners[i].layerId==layerId&&listeners[i].context==context&&(isAll||listeners[i].callback==handler)){
                            listeners.splice && listeners.splice(i, 1);
                            break;
                        }
                    }
                    
                    if(listeners.length==0&&events[type]['listened']){
                        document.removeEventListener(type,events[type].callback);
                        events[type]['listened'] = false;
                    }
                }
            }else{
                console.log("无此事件绑定");
            }
        };

        /**
         * 触发事件
         * @method {Function} fire
         * @param {String} type 事件类型名字
         * @param {Object||String} message 发送的数据信息可以字符串或者json数据
         * @param {String} targetId 发送的目标layerId,如为false侧是广播,如此参数=="top"侧向原始layer发送;
         *
         * @returns
         */
        layer.fire = function(type,targetId,message){
             if(!targetId){
                targetId = "";
             }else if(targetId=="top"){
                targetId = initLayerId;
             }
             var sender = layer.getCurrentId();
             var messData = {};
             messData.data = message||"";
             messData.target = targetId;
             messData.origin = sender;
             window.lc_bridge.layerPostMessage(sender, targetId, type,JSON.stringify(messData));
        };

        /**
         * 发送消息
         * @method {Function} postMessage
         *
         * @param {Object||String} message 发送的数据信息可以字符串或者json数据
         * @param {String} targetId 发送的目标layerId,如为false侧是广播,如此参数=="top"侧向原始layer发送;
         *
         * @returns
         */
        layer.postMessage = function(message,targetId){
             layer.fire('message',targetId,message)
        };
        
        
        return layer;
    }
);