var express=require('express');
var cookieParser=require('cookie-parser');
var app=express();
app.use(cookieParser("saddsafwerqsdaf"));//用于处理每一个请求的cookie
app.get('/read',function(req,res,next){//发送json类型的响应应答，与res.send相同
	res.json(req.cookies);
}) ;

app.get('/abc',function(req,res,next){
	res.json(req.cookies);
}) ;
app.get('/write',function(req,res,next){
	res.cookie('a','221');//设置名为a的cookie的值为221.
	res.cookie('b','456',{httpOnly:true,signed:true});//设置名为b的cookie的值问456，根据提供的options设置http头部分的set-cookie内容
	//res.cookie('my_cookie','hello',{path:'/abc'});
	//res.cookie('my_cookie','hello',{expires:new Date(Date.now()+2*60*1000)});
	//res.cookie('my_cookie','hello',{maxAge:2*60*1000});
//	res.json(req.cookies);
	res.json(req.signedCookies);//以json格式返回响应，其中相应内容为由请求发送的签名cookie，未签名准备使用
});
app.listen(3000);
