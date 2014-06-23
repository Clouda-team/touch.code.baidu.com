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