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
				e.target.classList.add("active");
				entry(act);
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
				touch.on('#target', 'touchstart', function(ev){
					ev.preventDefault();
				});

				var initialScale = 1;
				var currentScale;
				
				touch.on('#target', 'pinch', function(ev){  
					currentScale = ev.scale - 1;
					currentScale = initialScale + currentScale;
					currentScale = currentScale > 2.5 ? 2.5 : currentScale;
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
				touch.on('#target', 'touchstart', function(ev){
					ev.preventDefault();
				});

				touch.on('#target', 'hold tap doubletap', function(ev){
					log("当前事件为: " + ev.type);

					var _this = this;
					this.classList.add("shake");
					touch.on(this, "webkitAnimationEnd", function(){
						_this.classList.remove("shake");
					});
				});
			},
			swipe : function(){
				log("向左, 向右swipe滑动");
				touch.on('#target', 'touchstart', function(ev){
					ev.preventDefault();
				});

				var target = document.getElementById("target");
				target.style.webkitTransition = 'left ease 0.3s';

			    touch.on(target, 'swiperight', function(ev){
			    	log("向右滑动.");
					this.style.left = (this.parentNode.offsetWidth - this.offsetWidth) + 'px';	
			    });

			    touch.on(target, 'swipeleft', function(ev){
			    	log("向左滑动.");
			    	this.style.left = '0px';
			    });
			},
			drag : function(){
				log("抓取并移动目标");
				touch.on('#target', 'touchstart', function(ev){
				    ev.preventDefault();
				});

				var target = document.getElementById("target");
				var initialx = target.offsetLeft - target.parentNode.offsetLeft;
				var initialy = target.offsetTop - target.parentNode.offsetTop;
				var maxX = target.parentNode.offsetWidth - target.offsetWidth;
			    var maxY = target.parentNode.offsetHeight - target.offsetHeight;
				var dx, dy;

				touch.on('#target', 'drag', function(ev){
				    
				    dx = initialx + ev.x;
				    dy = initialy + ev.y;
				    
				    log("当前x值为:" + dx + ", 当前y值为:" + dy +".");

				    dx = dx < 0 ? 0 : dx;
				    dx = dx > maxX ? maxX : dx;
					dy = dy < 0 ? 0 : dy;
				    dy = dy > maxY ? maxY : dy;

				    this.style.left = dx + 'px';
				    this.style.top = dy + 'px';
				});

				touch.on('#target', 'dragend', function(ev){
				    initialx += ev.x;
				    initialy += ev.y;
				});
			},
			touch : function(){
				log("识别原生事件");
				touch.on('#target', 'touchstart touchmove touchend', function(ev){
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