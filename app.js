var app = require('express')();
var express=require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use('/', express.static(__dirname + '/public'));
app.get('/', function(req, res){
	res.sendfile('index.html');
});
var users=[];
//socket部分
io.on('connection', function(socket) {
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            //console.log('成功')
            io.sockets.emit('system', nickname,users.length,'login'); //向所有连接到服务器的客户端发送当前登陆用户的昵称 
        };
    });
    //断开连接的事件
    socket.on('disconnect', function() {
    //将断开连接的用户从users中删除
    users.splice(socket.userIndex, 1);
    //通知除自己以外的所有人
    socket.broadcast.emit('system', socket.nickname, users.length,'logout');
});
//
    //接收新消息
    socket.on('postMsg', function(msg) {
        //将消息发送到除自己外的所有用户
        socket.broadcast.emit('newMsg', socket.nickname, msg);
        console.log(msg)
    });



})



http.listen(3000, function(){
	console.log('listening on *:3000');
});
	
