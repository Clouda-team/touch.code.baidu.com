define(

    /**
     * layerapi，封装一些管理基本事件。
     * 本api依赖于 crema css， index.html页面需要有 div.pages 容器。 
     * refresh 需要设定refresh的容易：page-content
     * @class Layer
     * @extends WebControl
     * @static
     * @inheritable
     */

    function (require) {
        var api = {};

        var layers = {};

        api.prepare = function(id , options, context){

            context.state = "getting";
            
            $.ajax({
                url:options.url,
                type:"get",
                success:function(data){
                
                    //动画中渲染页面会有bug发生，所以需要等待渲染好页面
                    context.main.innerHTML = data;
                    context.state = "";
                    options.onsuccess&&options.onsuccess(data);

                    context.fire("afterrender");
                 
                },
                error:function(err){
                    context.state = "";
                    options.onfail && options.onfail(err);

                    me.fire('renderfailed');
                }
            });
            
            //设置管理layers
            layers.id = context;

            //2. set position
            $(context.main).css({top:options.top||0,left:options.left||0,right:options.right||0,bottom:options.bottom||0});
            
        };

        api.resume = function(id , options, context){

            //TODO 将来把 id的管理移入api

            if ( !context.state ) {//state 空，说明context可用
                // context.
                if ( !$("#"+context.main.id).length ) {
                    $(context.main).appendTo(".pages");
                }
            }else{ //等待fire
                context.on("afterrender",function(){
                    if ( !$("#"+context.main.id).length ) {
                        $(context.main).appendTo(".pages");
                    }
                });

            }
        };
        
        //for unbind
        var pullEvents = {};

        api.startPullRefresh = function(context){
            //0.初始化dom,挂载在page-content上
            var container = $(context.main).find(".page-content");
            if (!container.length){
                console.log("pull to refresh should has .page-content");
                return ;
            }
            container.addClass("pull-to-refresh-content");
            if (!$(".pull-to-refresh-layer",context.main).length){
                $(".page-content",context.main).prepend('<div class="pull-to-refresh-layer"> <div class="preloader"></div> <div class="pull-to-refresh-arrow"></div> </div>');
            }
            
            var isTouched, isMoved, touchesStart = {}, isScrolling, touchesDiff, touchStartTime, refresh = false, useTranslate = false, startTranslate = 0;
            pullEvents.handleTouchStart = function(e)  {
                if (isTouched) return;
                isMoved = false;
                isTouched = true;
                isScrolling = undefined;
                touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = (new Date()).getTime();
            };
            //private function
            var afterRefresh = function (container) {
                
                container.removeClass('refreshing').addClass('transitioning');
                context.transitionEnd(function () {
                    container.removeClass('transitioning pull-up');
                });
            };

            pullEvents.handleTouchMove = function(e) {
                if (!isTouched) return;
                var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                if (typeof isScrolling === 'undefined') {
                    isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
                }
                if (!isScrolling) {
                    isTouched = false;
                    return;
                }
                if (!isMoved) {
                    
                    container.removeClass('transitioning');
                    startTranslate = container.hasClass('refreshing') ? 44 : 0;
                    // if (container[0].scrollHeight === container[0].offsetHeight ) {
                        useTranslate = true;
                    // }
                    // else {
                    //     useTranslate = false;
                    // }
                }
                isMoved = true;
                touchesDiff = pageY - touchesStart.y;
                if (touchesDiff > 0 && container[0].scrollTop <= 0 || container[0].scrollTop < 0) {
                    if (useTranslate) {
                        e.preventDefault();
                        container[0].style.webkitTransform = 'translate3d(0,' + (Math.pow(touchesDiff, 0.85) + startTranslate) + 'px,0)';
                    }
                    if ((useTranslate && Math.pow(touchesDiff, 0.85) > 44) || (!useTranslate && touchesDiff >= 88)) {
                        refresh = true;
                        container.addClass('pull-up');
                    }
                    else {
                        refresh = false;
                        container.removeClass('pull-up');
                    }
                }
                else {
                    container.removeClass('pull-up');
                    refresh = false;
                    return;
                }
            };
            pullEvents.handleTouchEnd = function(e) {
                if (!isTouched || !isMoved) {
                    isTouched = false;
                    isMoved = false;
                    return;
                }
                container.addClass('transitioning');
                // container.css("webkitTransform",'');
                container[0].style.webkitTransform = '';
                if (refresh) {
                    container.addClass('refreshing');

                    context.fire('layerPullDown');//发送事件

                    context.once('layerPullEnd',function(){//监听本次结束
                        afterRefresh(container);
                    });
                }
                isTouched = false;
                isMoved = false;
            };

            context.on("touchstart", pullEvents.handleTouchStart);
            context.on("touchmove", pullEvents.handleTouchMove);
            context.on("touchend", pullEvents.handleTouchEnd);

        
        };

        api.endPullRefresh = function(context){//关闭refresh提示
            context.fire('layerPullEnd');
        };
        api.stopPullRefresh = function(context){
            
            $(context.main).removeClass("pull-to-refresh-content");
            context.off("touchstart", pullEvents.handleTouchStart);
            context.off("touchmove", pullEvents.handleTouchMove);
            context.off("touchend", pullEvents.handleTouchEnd);
        };


        return api;
    }
);