touch.on(document, 'DOMContentLoaded', function(){
	
	var $ = function(id){
		return document.getElementById(id);
	}
	
	var play = $("play"),
		code = $("code");
	
	function refreshDemo(){
		play.innerHTML = '<img class="target" src="images/cloud.png">';
		code.innerHTML = "";
	}
	
	var demos = {
		rotate : function(){
			refreshDemo();
			var target = play.querySelector(".target");
		},
		scale : function(){
			refreshDemo();
			var target = play.querySelector(".target");
			
			touch.on(target, 'touchstart', function(ev){
				ev.originEvent.preventDefault();
			});

			var initialScale = 1;
			touch.on(target, 'pinch', function(ev){  
				var currentScale = ev.scale - 1;
				currentScale = initialScale + currentScale;
				if(ev.fingerStatus === 'end'){
					initialScale += (ev.scale - 1);
					initialScale = initialScale > 2.5 ? 2.5 : initialScale;
				}
				currentScale = currentScale > 2.5 ? 2.5 : currentScale;
				currentScale = currentScale < 1 ? 1 : currentScale;

				this.style.webkitTransform = 'scale(' + currentScale + ')';
			});
		},
		tap : function(){
			refreshDemo();
			var target = play.querySelector(".target");
			
			
		},
		swipe : function(){
			refreshDemo();
			var target = play.querySelector(".target");
		},
		drag : function(){
			refreshDemo();
			var target = play.querySelector(".target");
		},
		touch : function(){
			refreshDemo();
			var target = play.querySelector(".target");
		}
	}
	
	/* 
	var navlist = document.querySelector("#navlist");
	var arrow = document.querySelector("#nav #arrow");
	navlist.classList.add("hide");
	
	navlist.show = function(){
		navlist.classList.remove("hide");
		arrow.classList.add("up");
	}
	navlist.hide = function(){
		navlist.classList.add("hide");
		arrow.classList.remove("up");
	}
	
	touch.on('#nav #entry', 'touchstart', function(){
		var isHide = navlist.classList.contains("hide");
		isHide ? navlist.show() : navlist.hide();
	});
	
	//rotation
	var angle = 30;
	touch.on('#rotation .target', 'touchstart', function(ev){
		ev.startRotate();
		ev.originEvent.preventDefault();
	});
	
	touch.on('#rotation .target', 'rotate', function(ev){
		var totalAngle = angle + ev.rotation;
		if(ev.fingerStatus === 'end'){
			angle = angle + ev.rotation;
		}
		this.style.webkitTransform = 'rotate(' + totalAngle + 'deg)';
	});
	
	
	//scale
	touch.on('#scale .target', 'touchstart', function(ev){
		ev.originEvent.preventDefault();
	});
	
	var initScale = 1;
	touch.on('#scale .target', 'pinch', function(ev){
		
		var scale = initScale + ev.scale - 1
		if(ev.fingerStatus === 'end'){
			initScale += (ev.scale - 1);
			initScale = initScale > 2.5 ? 2.5 : initScale;
		}
		
		scale = scale > 2.5 ? 2.5 : scale;
		scale = scale < 1 ? 1 : scale;
		
		this.style.webkitTransform = 'scale(' + scale + ')';
	}); */
	
	//rotation
	var angle = -30;
	document.querySelector('#demo .target').style.webkitTransform = 'rotate(-30deg)';
	
	touch.on('#demo .target', 'touchstart', function(ev){
		ev.startRotate();
		ev.originEvent.preventDefault();
	});
	
	touch.on('#demo .target', 'rotate', function(ev){
		var totalAngle = angle + ev.rotation;
		if(ev.fingerStatus === 'end'){
			angle = angle + ev.rotation;
		}
		this.style.webkitTransform = 'rotate(' + totalAngle + 'deg)';
	});
	
});