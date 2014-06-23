(function(){

	touch.on(document, "DOMContentLoaded", function(){
		var state = "";
		var codeArea = document.querySelector("#code .viewport");
		var playArea = document.querySelector("#playarea");
		var logger = document.querySelector("#logger");
		var prefix = "#codes #";
		var suffix = "-code";

		function log(msg){
			logger.innerText = msg;
		}

		var nl = document.querySelector("#nav #nl");
		touch.on(nl, 'touchstart', 'li', function(e){
			var act = e.target.innerText.trim().toLowerCase();
			if(act.indexOf("&") > 0){
				act = 'tap';
			}
			if(!e.target.classList.contains("active")){
				nl.querySelector(".active").classList.remove("active");
				setTimeout(function(){
					e.target.classList.add("active");
					entry(act);
				},10);
			}
		});

		var action = {
			rotate : function(){
				log("利用startRotate, 单指触发滚动事件");
				//rotation
				var angle = 0;
				touch.on('#target', 'touchstart', function(ev){
					ev.startRotate();
					ev.preventDefault();
				});
				
				touch.on('#target', 'rotate', function(ev){
					var totalAngle = angle + ev.rotation;
					if(ev.fingerStatus === 'end'){
						angle = angle + ev.rotation;
						log("此次滚动角度为:" + ev.rotation + "度, 方向:" + ev.direction + ".");
					}
					this.style.webkitTransform = 'rotate(' + totalAngle + 'deg)';
				});
			},
			scale : function(){
				log("双指放大与缩小目标.");
				
				var target = document.getElementById("target");
				target.style.webkitTransition = 'all ease 0.05s';
				
				touch.on('#target', 'touchstart', function(ev){
					ev.preventDefault();
				});

				var initialScale = 1;
				var currentScale;
				
				touch.on('#target', 'pinchend', function(ev){
					
					currentScale = ev.scale - 1;
					currentScale = initialScale + currentScale;
					currentScale = currentScale > 2 ? 2 : currentScale;
					currentScale = currentScale < 1 ? 1 : currentScale;
					this.style.webkitTransform = 'scale(' + currentScale + ')';
					log("当前缩放比例为:" + currentScale + ".");
				});

				touch.on('#target', 'pinchend', function(ev){
					initialScale = currentScale;
				});
			},
			tap : function(){
				log("识别tap, doubletap和hold事件.");
				// touch.on('#target', 'touchstart', function(ev){
					// ev.preventDefault();
				// });

				touch.on('#target', 'hold tap doubletap', function(ev){
					
					log("当前事件为: " + ev.type);

					var _this = this;
					this.classList.add("bounce");
					touch.on(this, "webkitAnimationEnd", function(){
						_this.classList.remove("bounce");
					});
				});
			},
			swipe : function(){
				var w = 168;
				var tw = playArea.offsetWidth;
				
				var lf = document.getElementById("target").offsetLeft;
				var rt = tw - w - lf;
				
				log("向左, 向右swipe滑动");
				touch.on('#target', 'touchstart', function(ev){
					ev.preventDefault();
				});

				var target = document.getElementById("target");
				target.style.webkitTransition = 'all ease 0.2s';

			    touch.on(target, 'swiperight', function(ev){
					this.style.webkitTransform = "translate3d(" + rt + "px,0,0)";
			    	log("向右滑动.");
			    });

			    touch.on(target, 'swipeleft', function(ev){
			    	log("向左滑动.");
					this.style.webkitTransform = "translate3d(-" + this.offsetLeft + "px,0,0)";
			    });
			},
			drag : function(){
				log("抓取并移动目标");
				
				touch.on('#target', 'touchstart', function(ev){
				    ev.preventDefault();
				});

				var target = document.getElementById("target");
				var dx, dy;

				touch.on('#target', 'drag', function(ev){
					
				    dx = dx || 0;
					dy = dy || 0;
				    
					var offx = dx + ev.x + "px";
					var offy = dy + ev.y + "px";
					this.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
					
				});

				touch.on('#target', 'dragend', function(ev){
					dx += ev.x;
				    dy += ev.y;
					log("当前x值为:" + dx + ", 当前y值为:" + dy +".");
				});
			},
			touch : function(){
				log("识别原生事件");
				touch.on('#target', 'touchstart', function(ev){
					ev.preventDefault();
				});
				touch.on('#target', 'touchstart touchmove touchend', function(ev){
					var _this = this;
					if(!this.classList.contains("bounce")){
						if(ev.type === "mousedown" || ev.type === "touchstart"){
							this.classList.add("bounce");
							touch.on(this, "webkitAnimationEnd", function(){
								_this.classList.remove("bounce");
							});
						}
					}
					
					log("当前为原生事件: " + ev.type);
				});
			}
		}
		
		function entry(act){
			if(state === act){ return; }
			state = act;
			playArea.innerHTML = "";
			var target = document.createElement("img");
			target.id = "target";
			target.draggable = false;
			target.src = "images/cloud.png";
			playArea.appendChild(target);
			action[act]();
			codeArea.innerHTML = document.querySelector(prefix + act + suffix).innerHTML.trim();
			runhijs();
			setTimeout(function(){
				target.classList.add("show");
			}, 10);
		}

		//init
		(function(){
			entry("rotate");
			nl.querySelector("li").classList.add("active");	
		})();

	});

})();