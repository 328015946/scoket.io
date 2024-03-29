window.onload = function() {
    //实例并初始化我们的hichat程序
    var hichat = new HiChat();
    hichat.init();
};

//定义我们的hichat类
var HiChat = function() {
    this.socket = null;
};

//向原型添加业务方法
HiChat.prototype = {
    init: function() {//此方法初始化程序
        var that = this;
        //建立到服务器的socket连接
        this.socket = io.connect();
        //监听socket的connect事件，此事件表示连接已经建立
        this.socket.on('connect', function() {
            //连接到服务器后，显示昵称输入框
            document.getElementById('info').textContent = '输入你的名字';
            document.getElementById('nickWrapper').style.display = 'block';
            document.getElementById('nicknameInput').focus();
        });

//昵称设置的确定按钮
document.getElementById('loginBtn').addEventListener('click', function() {
    var nickName = document.getElementById('nicknameInput').value;
    //检查昵称输入框是否为空
    if (nickName.trim().length != 0) {
        //不为空，则发起一个login事件并将输入的昵称发送到服务器
        that.socket.emit('login', nickName);
    } else {
        //否则输入框获得焦点
        document.getElementById('nicknameInput').focus();
    };
}, false);
//昵称处理
    this.socket.on('nickExisted', function() {
     document.getElementById('info').textContent = '名字已经被占有'; //显示昵称被占用的提示
 });

//登录成功后出来函数
this.socket.on('loginSuccess', function() {
     document.title = '欢迎| ' + document.getElementById('nicknameInput').value;
     document.getElementById('loginWrapper').style.display = 'none';//隐藏遮罩层显聊天界面
     document.getElementById('messageInput').focus();//让消息输入框获得焦点
 });


this.socket.on('system', function(nickName, userCount, type) {
    var msg = nickName + (type == 'login' ? '加入聊天' : '离开聊天');
    //指定系统消息显示为红色
    that._displayNewMsg('系统消息:', msg, 'red');
    document.getElementById('status').textContent ="目前在线人数:"+userCount;
});


this.socket.on('newMsg', function(user, msg) {
    that._displayNewMsg(user, msg);
});
document.getElementById('sendBtn').addEventListener('click', function() {
    var messageInput = document.getElementById('messageInput'),
        msg = messageInput.value;
    messageInput.value = '';
    messageInput.focus();
    if (msg.trim().length != 0) {
        that.socket.emit('postMsg', msg); //把消息发送到服务器
        that._displayNewMsg('me', msg); //把自己的消息显示到自己的窗口中
    };
}, false);

    },

 _displayNewMsg: function(user, msg, color) {
    var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
            msgToDisplay.className="tips";
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    }
};

