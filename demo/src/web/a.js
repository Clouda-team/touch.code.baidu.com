window.i = i
window.t = t;
window.a = a
window.e = e;

var si = setInterval(function(){
    i.halt();
    setTimeout(function(){
    var e = t.get("now"), i = t.get("total"), n = t.get("win"); t._loginCallback(function() {
            if (t.cfg.activityStatus == "1" && t.cfg.useTCode) {
                t._ajaxFun({url: t.cfg.grabTCodeUrl,data: {activityId: t.cfg.activityId}});
                var e = ua;
                UA_Opt.Token = (new Date).getTime() + ":" + Math.random();
                UA_Opt.reload();
                t._ajaxFun({url: t.cfg.lotteryUrl,data: {ua: e,source: "wap"}}, function(e) {
                    try {
                        o = false;
                        if (e.isSuccess && e.isWin) {
                            t.fire("grapT", {result: "T",data: e})
                        } else {
                            t.fire("grapT", {result: "F"})
                        }
                    } catch (i) {
                        o = false;
                        t.fire("grapT", {result: "F"})
                    }
                })
            } else {
                t.fire("grapT", {result: "F"})
            }
        })
    } 
    ,500);
},1500);