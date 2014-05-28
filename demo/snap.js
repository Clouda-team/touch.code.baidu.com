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
	
	var moveit = function (offx){
		mid.style.webkitTransition =  "300ms";
		setTimeout(function(){
			var trans = "translateX(" + offx.toString() + "px)";
			mid.style.webkitTransform = trans;
		},1);
	};
	
	var getInterval = function (offset){
		
		var n,
			unit = 50;
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
		console.log(state, e.x, offx);
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
	
	var list = document.querySelector("#list");
	
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
	
	render(lib1);
	
});