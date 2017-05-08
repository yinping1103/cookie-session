var express=require('express');
var parseurl=require('parseurl');
var session=require('express-session');
var uuid=require('uuid');
var cookieParser=require('cookie-parser');
var clone=require('clone');


var app=express();

/*
app.use(session({//使用session函数作为中间件，设置相应的选项值
    secret:'keyboard cat',//secret是必含选项，用于对sessionid对应的cookie签名
    resave:false,//该选项 即使在请求发生后session未被修改也强制将session存储回到session store中，每次请求都重新设置session cookie，
    //假设cookie是6000毫秒过期，每次请求都会再设置6000毫秒。
    saveUninitialized:true//是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid。
    //强制将一个未初始化的session存储到store中，一个session当它是新创建时是未初始化的，而不是修改的时候是未初始化的
    //Forces a session that is "uninitialized" to be saved to the store.
    //A session is uninitialized when it is new but not modified. Choosing false is useful for
    //implementing login sessions, reducing server storage usage, or complying with laws that
    //require permission before setting a cookie.
    //Choosing false will also help with race conditions where a client makes multiple parallel requests without a session.

}))
*/
function my_session(){//自定义中间件
    var data={};
    console.log("in my session");//此句会在程序开始运行时执行，也就是说没有请求发来 就执行了
    return function(req,res,next){//return 函数将在所有中间件执行结束之后执行
	var id=req.signedCookies.session_id||uuid.v4();//如果req.signedCookies.session_id为真则id赋值为这个值，
  //如果为假，调用uuid.v4（），随机生成唯一标识码
	res.cookie('session_id',id,{//将session_id的值设置为id，并设置如下选项值
	    maxAge:600000,//以毫秒为单位，设置相对于当前时间的到期时间
	    path:'/',//路径 默认为‘/’
	    httpOnly:true,//cookie只可以通过web服务器获取的标志
	    signed:true//指示cookie是否可以被签名
	});
	req.session=clone(data[id]||{});//如果data[id]存在 则将data[id]赋值给req.session否则req.session的值为空
	res.on('finish',function(){
	    console.log("savesession : ",req.session);//这部分会在后面的next（）后的console.log("this is in my_session return");之后打印出
	    data[id]=clone(req.session);
	});
	next();
	console.log("this is in my_session return");
    }
}
app.use(cookieParser('asdasqweqwe'));
app.use(my_session());
app.use(function(req,res,next){
    var views=req.session.views;
//    console.log("check req session: "+ JSON.stringify(req.session));
//    console.log("check req session.cookie: "+ JSON.stringify(req.session.cookie));
//    console.log("check views: "+JSON.stringify(req.session.views));
    if(!views){
	views=req.session.views={};//如果原session中没有定义views，此处定义它
    }
//    console.log("check views after no views : "+JSON.stringify(req.session.views));
//    console.log("req.session after : "+JSON.stringify(req.session));
//    console.log("req.session.secret: "+JSON.stringify(req.session.secret));
    //get the url pathname
    var pathname=parseurl(req).pathname;//获得请求的路径
//    console.log("this is pathname: "+pathname);
    //count the views
    views[pathname]=(views[pathname]||0)+1;//views用于存储记录不同的访问路径访问次数，如果没有访问过当前网页 ，对其定义后加一
    console.log("req.sessionID: "+req.sessionID);
    var num=req.session.num;//用于记录该中间件被调用的次数
    if(!num){
	num=req.session.num=0;

    }
    req.session.num=num+1;
    console.log("this is the "+req.session.num+" call");
    next();
})

app.use(function(req,res,next){
//    console.log("this is the first time");
    console.log("...............");
    console.log("i am a middleware , i will be exected when there is request coming");
    console.log("i can do nothing ,just call next()");
    console.log("please remember next!!!");
    next();
})

app.use(function(req,res,next){
  //  console.log("this is the second time");
    console.log("...............");
    console.log("i am another middleware , i will be exected when there is request coming");
    console.log("so boring!");
    console.log("idiot shit go to the hell!!!");
    next();
})

app.get('/foo',function(req,res,next){//当foo页面检测到请求时，将对应话打印到页面上
    res.send('you viewed this page'+req.session.views['/foo']+'times');
})

app.get('/bar',function(req,res,next){//当bar页面检测到请求时，将对应话打印到页面上
    res.send('you viewed this page'+req.session.views['/bar']+'times');
})

app.get('/',function(req,res,next){//当根目录检测到请求时，将对应话打印到页面上
    res.send('hi');
})

app.listen(3000);
