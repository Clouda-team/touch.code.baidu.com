
var pointerList = document.getElementById('pointer-list');
function query(id){
  return document.getElementById(id);
}
 
var logEl = document.getElementById('console');
var timeout = 0;
var log = function(text, context){
   clearTimeout(timeout);
   var desText = '';
   if(context && context.parentNode && context.parentNode.querySelector){
       var des = context.parentNode.querySelector('.description');
       desText = des.innerHTML;
   }
   timeout = window.setTimeout(function(){
       logEl.innerHTML = desText + text;
   }, 200);
}


var menuList = document.querySelector('.menu-list');
var isMenuOpen = false;

log('', document.getElementById('rotation'));
pointerList && touch.on(pointerList, 'tap', "li", function(ev){
   var originEv = ev.originEvent;
   isMenuOpen = false;
   var name = originEv.target.getAttribute('name');
   var hover = document.getElementById('hover');
   var menuBtn = null;
   
   if(hover){
	   hover.id = "";
   }
   originEv.target.id = "hover";
  
   
   var docPanel = document.getElementById('doc');
   var demoPanel = document.getElementById('pannels');
   
   if(isTouch){
	   menuBtn = document.querySelector('.menu-btn');
	   menuBtn.innerHTML = originEv.target.innerText + ' <span class="arrow"></span>';
   }
   
   var cur = document.getElementsByName('cur');
   if(cur && cur.length> 0){
	   cur = cur[0];
	   cur.removeAttribute('name');
   }
   var panel = query(name);
   panel.setAttribute('name', 'cur');
   menuList.style.display = 'none';
   log('', panel.querySelector && panel.querySelector('.target'));
   
});

touch.on('#doc', 'tap', function(ev){
   var tgt = ev.originEvent.target;
   if(tgt.className.indexOf('nav-item') > -1){
      var parentNode = tgt.parentNode.parentNode;
      var cur = parentNode.querySelector('.cur');
      cur.className = cur.className.replace('cur', '');
      tgt.className = tgt.className + ' cur';
      
      if(tgt.className.indexOf('i1') > -1){
         query('changelog').style.display = 'block';
         query('docapi').style.display = 'none'
      }else if(tgt.className.indexOf('i2') > -1){
          query('docapi').style.display = 'block';
          query('changelog').style.display = 'none';
      }
   }
});

touch.on('#navigation', 'tap', 'li', function(ev){
	var tgt = this;
	  var navCur = query('nav-cur');
	  var name = tgt.getAttribute('name');
	  navCur.id = '';
	  tgt.id = 'nav-cur';
	  if(name == 'n1'){
		 query('doc').style.display = 'none';
		 query('content').style.display = 'block';
	  }else {
		  query('doc').style.display = 'block';
		  query('content').style.display = 'none';
		  if(name == 'n2'){
			  query('changelog').style.display = 'none';
			  query('docapi').style.display = 'block'
		  }else if(name == 'n3'){
			 query('changelog').style.display = 'block';
			 query('docapi').style.display = 'none'
		  }
	  }
   
});

if(isTouch){
  touch.on('.menu-btn', 'tap', function(ev){
    isMenuOpen = !isMenuOpen;
    if(isMenuOpen){
      menuList.style.display = 'block';
    }else{
      menuList.style.display = 'none';
    }
  });
}

document.body.addEventListener('touchstart', function(ev){
    return;
    var childs = menuList.childNodes;
    var target = ev.target;
    var len = childs.length;
    var existed = false;
    for(var i=0; i < len; i++){
        if(target === childs[i]){
            existed = true;
            break;
        }
    }
    if(!existed){
        isMenuOpen = false;
        menuList.style.display = 'none';
    }
})

var pannels = query('pannels');
touch.on('#pannels', 'tap', function(ev){
  ev = ev.originEvent;
  var className = ev.target.className;
  className = className.split(' ')[0];
  if(className && className.indexOf('title') > -1){
     var parentNode = ev.target.parentNode;
     //隐藏tab
     var tabs = parentNode.querySelectorAll('.tab');
     for(var i=0; i < tabs.length; i++){
         tabs[i].style.display = 'none';
     }
     //打开相应tab
     var index = className.substring(className.length - 1);
     var tab = parentNode.querySelector('.t'+index);
     tab.style.display = 'block';
     var sl = parentNode.querySelector('.selected');
     if(sl){
         sl.className = sl.className.replace('selected', '');
     }
    ev.target.className = ev.target.className + ' selected';
  }
});

//rotation
(function(){
  var angle = 30;
  touch.on('#rotation .target', 'touchstart', function(ev){
    ev.startRotate();
    ev.originEvent.preventDefault();
    //ev.originEvent.stopPropagation();
  });
  touch.on('#rotation .target', 'rotate', {interval: 10}, function(ev){
    var totalAngle = angle + ev.rotation;
    if(ev.fingerStatus === 'end'){
      angle = angle + ev.rotation;
    } 
    
    this.style.webkitTransform = 'rotate(' + (totalAngle) + 'deg)';
    
    log('当前角度：' + totalAngle, this );
  });
})();

//scale
(function(){
  touch.on('#scale .target', 'touchstart', function(ev){
    ev.originEvent.preventDefault();
    //ev.originEvent.stopPropagation();
  });
  
  var initialScale = 1;
  touch.on('#scale .target', 'pinch', {interval: 10},function(ev){  
    var currentScale = ev.scale - 1;
    currentScale = initialScale + currentScale;
    if(ev.fingerStatus === 'end'){
        initialScale += (ev.scale - 1);
        initialScale = initialScale > 2.5 ? 2.5 : initialScale;
    }
    currentScale = currentScale > 2.5 ? 2.5 : currentScale;
    currentScale = currentScale < 1 ? 1 : currentScale;
    
    this.style.webkitTransform = 'scale(' + currentScale + ')';
    
    log('当前缩放比率：' + currentScale, this );
  });
})();

//tap & hold & doubletap
(function(){
  var animated = true;
  document.querySelector('#tap .target').addEventListener("webkitAnimationEnd", function(){
    this.className = this.className.replace('hold-ani', '');
    animated = true;
  }, false);
    
  touch.on('#tap .target', 'hold tap doubletap', function(ev){
    ev.originEvent.preventDefault();
    //ev.originEvent.stopPropagation();
    if(animated){
      animated = false;
      this.className = this.className + ' hold-ani';
    }
    log('当前操作为：' + ev.type, this);
	console.log(ev.type)
	console.trace();
  });
})();

//swipe
(function(){
    var swipeFactor = 5;
    
    touch.on('#swipe .target', 'touchstart', function(ev){
        ev.originEvent.preventDefault();
        //ev.originEvent.stopPropagation();
    });
    var swipeHandler = function(ev){
        ev.factor = ev.factor > 2 ? 2 : ev.factor;
        this.style.webkitTransition = 'margin-left ease '+ ev.factor +'s';
        
        if(ev.direction === 'right'){
            this.style.marginLeft = (this.parentNode.offsetWidth - this.offsetWidth) + 'px';
        }else if(ev.direction === 'left'){
            this.style.marginLeft = '0px'
        }
        log('操作方向：' + ev.direction + '</br>' + '加速度因子：' + ev.factor, this);
    };
    touch.on('#swipe .target', 'swipe', {swipeFactor: swipeFactor}, swipeHandler);
    
    
    var factorView = document.querySelector('#factor-view');
    var dis = 192;
    touch.on('#factor', 'touchstart', function(ev){
        ev.originEvent.preventDefault();
        //ev.originEvent.stopPropagation();
    });
    touch.on('#factor', 'swipestart swiping swipeend', {interval: 10}, function(ev){
        var d = 0;
        d = dis + ev.distanceX;
        if(ev.swipe === 'end'){
           dis += ev.distanceX;
        }
        
        d  = d <=0? 0 : d;
        d = d > 385 ? 385 : d;
        this.style.left = d + 'px';
        
        var factor = Math.round(d / 38);
        this.innerHTML = factor;
        
        touch.off('#swipe .target', 'swipeleft swiperight', swipeHandler );
        touch.on('#swipe .target', 'swipeleft swiperight', {swipeFactor: factor}, swipeHandler);
    });
})();


//drag
(function(){
    touch.on('#drag .target', 'touchstart', function(ev){
        ev.originEvent.preventDefault();
        ////ev.originEvent.stopPropagation();
    });
    var initial = 0;
    touch.live('#drag .target', 'drag', {interval: 10}, function(ev){
        var d = initial + ev.distanceX;
        
        if(ev.fingerStatus === 'end'){
           initial += ev.distanceX;
        }
        
        var max = this.parentNode.offsetWidth - this.offsetWidth;
        d = d < 0 ? 0 : d;
        d = d > max ? max : d;
        this.style.marginLeft = d + 'px';
        
        log('拖拽方向：' + ev.direction + '</br>x方向拖拽距离：' + ev.distanceX, this);
    });
})();
 
if(document.querySelector){
   var tt = document.querySelector('#touch .target');
   tt.addEventListener( 'webkitTransitionEnd', function( event ) { 
      this.className = this.className.replace(/shake/g, '');
   }, false );
}

touch.live('#touch .target', 'touchstart touchmove touchend', function(ev){
  if(ev.type === 'touchstart' || ev.type === 'mousedown'){
     this.className = this.className + ' shake';
  }
  log('原生事件类型:'+ev.type, this);
});

!isTouch && baidu.more.copyClipBoard('cdn-text','copyMask','cdn-btn','复制成功','alert');
