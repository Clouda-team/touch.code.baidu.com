var Timer = function(min, sec){
	
	this.min = parseInt(min);
	this.sec = parseInt(sec);
	this.tick = 0;
	
}

Timer.prototype = {
	
	start : function(callback){
	
		var _this = this;
		
		this.tick = setTimeout(function(){
			
			if(_this.sec === 0) {
				
				if(_this.min === 0){
					
					_this.reset();
					return;
					
				} else {
				
					_this.min--;
					_this.sec = 59;
					_this.start(callback);
					
				}
				
			} else {
				
				_this.sec--;
				_this.start(callback);
				
			}
			
		}, 1000);
		
		//console.log(this.min, this.sec);
		if(callback){
			callback(this.min, this.sec);
		}
		
	},
	
	pause : function(){
		
		clearTimeout(this.tick);
		
	},
	
	reset : function(){
		
		this.min = 0;
		
		this.sec = 0;
		
		clearTimeout(this.tick);
		
	}
	
}