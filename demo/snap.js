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
		mid.style.webkitTransition =  "200ms";
		setTimeout(function(){
			var trans = "translateX(" + offx.toString() + "px)";
			mid.style.webkitTransform = trans;
		},1);
	};
	
	var getInterval = function (offset){
		
		var n,
			unit = 80;
		if( offset <= (unit * -1) ) {
			n = -2;
		} else if( offset > (unit * -1) && offset <= 0) {
			n = -1;
		} else if( offset > 0 && offset <= unit) {
			n = 1;
		} else if(offset > unit){
			n = 2;
		}
		return n;
	}
	
	var onDragMid = function(e){
		if(state === 0){
			offx = 0;
		} else if(state === 1){
			offx = w2;
		} else if(state === 2){
			offx = -w2;
		}
		//if(Math.abs(e.x)< 20) return ;
		offx += e.x;
		mid.style.webkitTransition =  "0ms";
		var trans = "translateX(" + offx.toString() + "px)";
		mid.style.webkitTransform = trans;
	};
	
	
	var onDragMidEnd = function (e){
		
		var i = getInterval(e.x);
		if(state === 0){
			if(i === -2){
				state = 2; 
				moveit(-w2);
			} else if ( i === 2){
				state = 1; 
				moveit(w2);
			} else {
				moveit(0);
			}
		} else if (state === 1){
			if( i === -2) {
				state = 0;
				moveit(0);
			} else {
				moveit(w2);
			}
		} else if( state === 2){
			if (i === 2) {
				state = 0;
				moveit(0);
			} else {
				moveit(-w2);
			}
		}
		
	}
	
	touch.on(mid, 'touchstart', function(e){
		e.preventDefault();
	});
	touch.on(mid, "drag", onDragMid);
	touch.on(mid, "dragend", onDragMidEnd)
	
});


touch.on(document, "DOMContentLoaded", function(){
	
	var isWIN = (navigator.platform.indexOf('Win32') != -1);
	
	var list = document.querySelector("#list"),
		main = document.querySelector("#main");
	
	var offy = 0;
	var maxOffy = 120;
	var vState = 0;
	
	var movey = function (offy, timing){
		list.style.webkitTransitionTimingFunction = "ease-out";
		var dur = isWIN ? "0ms" : "200ms";
		if(timing){
			list.style.webkitTransitionTimingFunction = "ease";
			dur = "600ms";
		}
		if(timing && isWIN){
			dur = "300ms";
		}
		list.style.webkitTransitionDuration = dur;
		setTimeout(function(){
			var trans = "translateY(" + offy.toString() + "px)";
			list.style.webkitTransform = trans;
		}, 10);
	};
	
	//data
	var lib1 = ['polymer', 'pnotify', 'prettify','qwery', 'q.js'];
	var lib2 = ['react', 'ractive.js', 'raphael', 'restangular', 'require.js', 'respond.js', 'reveal.js','SyntaxHighlighter', 'swfobject', 'svg.js', 'superagent', 'sugar', 'string.js','socket.io', 'snap.js', 'seajs','sass.js', 'sammy.js'];
	var libs = lib1.concat(lib2);
	
	function render(libs){
		var str = libs.map(function(item){
			return '<li name=' + item + ' >' + item + '</li>'
		});
		list.innerHTML = str.join("");
	}
	
	render(libs);
	
	
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
	
	
	var btm = screen.availHeight - list.offsetHeight - list.childNodes.length * 3;
	touch.on(list, 'drag', function(e){
		
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
			if(e.y > 0){
				var deg = e.y * 3.6 * unit;
				cvs.width = cvs.width;
				dragCircle(deg);
			}
		} else if(vState === 1){
			//offy = offy;
		}
		
		movey(offy+e.y);
		
	});
	
	touch.on(list, 'dragend', function(e){
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
		},10);
		
	});
	
});