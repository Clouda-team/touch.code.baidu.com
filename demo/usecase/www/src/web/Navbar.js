define(
    function (require) {
        var lib = require('./lib');
        var runtime = require('./runtime');
        var Component = require('./Component');
        var blend = require('./blend');



        var Navbar = function(options){

            Component.apply(this, arguments);
            this.init(options);

            console.log("navbar done");
        };

        Navbar.prototype.type = "navbar";


        Navbar.prototype.init = function(options){
            options = options ? options : {};

            $(options.dom).hide();

            if(blend.inRuntime()){
                var nativeObj = runtime.createNavbar(options);
                nativeObj.bindEvent("ontouch", this.ontouchHandler);

                this.main =  nativeObj;
            }else{
                this.render();
            }
            return this.main;
        };

        Navbar.prototype.paint = function(){
            for(var i = 0, len = this.navbar.length; i < len; i++){
                this.add(this.navbar[i]);
            }

            console.log((this.main));
            lib.$(this.main).appendTo("body");

            lib.$(this.main).css({
                "position" : "fixed",
                "top":this.top,
                "background-color":"red"
            });
            //todo：这里的return是不是要跟上面的nativeObj统一？
        };

        Navbar.prototype.add = function(item){
            console.log("add");

            if(blend.inRuntime()){
                this.nativeObj.add(item);
            }else{
                var iconString =  item['icon'] ? "<img src='" + item['icon'] + "' />" : "";
                var id = lib.getUniqueID();


                $('<a>')
                    .attr({'id':'test-btn' + id, "class": "ui-btn-active", href : item['url']})
                    .css({
                        "display" : "inline-block",
                        "border" : "1px #000 solid",
                        "padding" : 2,
                        "width" : item['width'] ? item['width'] : ""
                    })
                    .html( iconString +  item['text'])
                    .appendTo(this.main);
            }
        };

        Navbar.prototype.remove = function(id){
            this.main.remove(id);
        };

        Navbar.prototype.ontouchHandler = function(){

        };

        Navbar.prototype.bindEvent = function(){


        };
        Navbar.prototype.remove = function(){


        };

        lib.inherits(Navbar, Component);
        
        return Navbar;
    }
);