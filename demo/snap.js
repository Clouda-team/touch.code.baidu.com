touch.on(document, "DOMContentLoaded", function(){
	
	var h = screen.height,
		w = screen.width;
	var main = document.querySelector("#main"),	
		mid = document.querySelector("#mid"),
		lf = document.querySelector("#lf"),
		rt = document.querySelector("#rt");
	
	[main, mid, lf, rt].forEach(function(item){
		item.style.height = h + "px";
	});
	
	main.style.width = w + "px";
	mid.style.width = w + "px";
	lf.style.width = w/2 + "px";
	rt.style.width = w/2 + "px";
	
});

touch.on(document, "DOMContentLoaded", function(){
	
	var list = document.querySelector("#list");
	var main = document.querySelector("#main");
	var mid = document.querySelector("#mid");
	var w = screen.width,
		w2 = w/2;
	var state = 0;
	var offx;
	
	var moveit = function (offx){
		mid.style.webkitTransitionTimingFunction = "ease";
		mid.style.webkitTransition =  "400ms";
		setTimeout(function(){
			var trans = "translateX(" + offx.toString() + "px)";
			mid.style.webkitTransform = trans;
		},1);
	};
	
	touch.on(mid, 'touchstart', function(e){
		e.preventDefault();
	});
	
	
	touch.on("#icon", "touchstart", function(e){
		if(state === 0){
			state = 1;
			moveit(w2);
			move("#icon").rotate(180).duration(400).end();
			e.stopImmediatePropagation();
		}
	});
	
	touch.on("#mid", "touchstart", function(e){
		if(state === 1){
			state = 0;
			moveit(0);
			move("#icon").rotate(0).duration(400).end();
		}
	});
	
});


touch.on(document, "DOMContentLoaded", function(){
	
	var isWIN = (navigator.platform.indexOf('Win32') != -1);
	
	var list = document.querySelector("#list"),
		main = document.querySelector("#main"),
		ctnt = document.querySelector("#ctnt");
	
	var offy = 0;
	var maxOffy = 100;
	var vState = 0;
	
	var movey = function (offy, timing){
		ctnt.style.webkitTransitionTimingFunction = "ease-out";
		var dur = isWIN ? "0ms" : "200ms";
		if(timing){
			ctnt.style.webkitTransitionTimingFunction = "ease";
			dur = "700ms";
		}
		if(timing && isWIN){
			dur = "300ms";
		}
		ctnt.style.webkitTransitionDuration = dur;
		setTimeout(function(){
			var trans = "translateY(" + offy.toString() + "px)";
			ctnt.style.webkitTransform = trans;
		}, 10);
	};
	
	//circle
	var cvs = document.querySelector("#circle");
	if (cvs.getContext) {
		var ctx = cvs.getContext('2d');
	}
	
	var unit = Math.PI * 2 / 360;
	
	function dragCircle(deg){
		ctx.beginPath(); 
		ctx.arc(15, 15, 12, 0, deg, false); 
		ctx.lineWidth = 2; 
		ctx.strokeStyle = "dodgerblue"; 
		ctx.lineCap = "round";
		ctx.stroke();
	}
	
	
	var btm = screen.availHeight - ctnt.offsetHeight - list.childNodes.length * 2;
	touch.on(ctnt, 'drag', function(e){
		
		var x = Math.abs(e.x),
			y = Math.abs(e.y);
		if(y > x){
			e.stopPropagation();
		}
		
		if(vState === 0){
			offy = 0;
			if(e.y > maxOffy){
				movey(maxOffy);
				return ;
			}
			var deg = e.y * 3.6 * unit;
			cvs.width = cvs.width;
			dragCircle(deg);
			
		} else if(vState === 1){
			//offy = offy;
		}
		movey(offy + e.y);
	});
	
	touch.on(ctnt, 'dragend', function(e){
		setTimeout(function(){
			if(e.y > 0 && offy >= 0){
				offy = 0;
				movey(0, true);
				cvs.width = cvs.width;
				vState = 0;
			} else {
				offy += e.y;
				if(offy < btm){
					offy = btm;
					movey(btm);
					vState = 1;
				} else if( offy > 0){
					offy = 0;
					movey(0, true);
					vState = 0;
				} else {
					vState = 1;
				}
			}
		},0);
		
	});
	
});