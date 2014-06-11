$(function(){//ready 后


    require(['../src/web/blend','../src/web/dialog/alert','../src/web/slider'], function (blend, alert, Slider) {

        var bullets = $("#myslider").find(".slide-position li");

        window.s = new Slider({
            main : $("#myslider")[0],
            auto: 3000,
            continuous: true,
            callback: function(pos) {
                var i = bullets.length;
                while (i--) {
                    bullets[i].className = ' ';
                }
                bullets[pos].className = 'on';
            }
        });
    },null,true);


});