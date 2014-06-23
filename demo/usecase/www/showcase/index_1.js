requirejs(['../third_party/zepto','../src/hybrid/blend','../src/hybrid/Layer'], function (nothing, main, layer,LayerGroup) {
    var host = "file:///sdcard/baidu/yuedu/www/";
    var layerApi = main.api.layer;
    var _layer;
    $('a').click(function(e){
        e.preventDefault();
        var $t = $(this);
        e.preventDefault();
        _layer && _layer.destroy();
        _layer = new layer({
            "id":"info",
            "url": host + 'showcase/content.html',
            "active":true
            ,"afterrender":function(){

            }
            ,"onload":function(event){

            }
            ,"changeUrl":function(event){
               
            }
        });
    });

    //留言
    var postLayer = null;
    $("#facebook").on("touchend",function(){
        postLayer && postLayer.destroy()
        postLayer = new layer({
            "id":"postLayer",
            "url": host + 'postLayer.html',
            "active":true,
            "duration":"quick"
        });
    });

    //刷新传递
    var fc = $("#FC");
    /*alert(layerApi.getCurrentId());*/
    layerApi.on('message',function(event){
        if(event.origin=="postLayer"){
            postLayer.destroy();
            postLayer = null;
            var data = event.data;
            if(data){
                fc.show();
                $("<div>").html(data).appendTo(fc);
            }
            
        }
    });
    
    var component = main.api.component;
    var options = {
        left:0,
        top:0,
        width:200,
        height:200
    };
    var data = [
        {
            "url":"http://img.baidu.com/img/iknow/wenku/shangouandroid640254.jpg"
        },
        {
            "url":"http://img.baidu.com/img/iknow/wenku/xinao640x254news.jpg"
        },{
            "url":"http://img.baidu.com/img/iknow/wenku/zhichangshengji640x254.jpg"
        },{
            "url":"http://img.baidu.com/img/iknow/wenku/texiaoyao640X254.jpg"
        },{
            "url":"http://img.baidu.com/img/iknow/wenku/jingpinxin640x254.jpg"
        }
    ];
    
    component.slider("111",options,data);

    //window.nuwa_runtime.removeSplashScreen();
});