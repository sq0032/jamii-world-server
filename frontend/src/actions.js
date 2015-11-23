var $ = require('jquery');
//var jmEvent = require('./type');

//********Real-time response functionality***********
var io = require('socket.io-client');
window.app = window.app || {};
var url = window.location.host.split(':')[0];
window.app.socket = io.connect("http://"+url+":3000");
window.app.socket.on("connect", function(){
    console.log( "Connected!" );
});

var actions = {};

//Board actions
actions.moveToMeetingRoom = function(pos){
    console.log('MOVE_TO_MEETINGROOM');
    $(window).trigger({
      type: 'MOVE_TO_MEETINGROOM',
      pos: pos
    });
};

actions.moveToLobby = function(){
    console.log('MOVE_TO_LOBBY');
    $(window).trigger({
      type: 'MOVE_TO_LOBBY',
    });
};

actions.moveTo = function(user){
    window.app.socket.emit('move', user);
}

actions.connectServer = function(){

};

actions.login = function(username){
  window.app.socket.emit('login', username);
//    window.app.socket.emit('move', user);  
};

actions.loginSuccess = function(response){
    $(window).trigger({
      type: 'LOGIN_SUCCESS',
      user: JSON.parse(response),
    });
}

actions.loginFail = function(response){
    $(window).trigger({
      type: 'LOGIN_FAIL',
      message: response,
    });
}

actions.poke = function(username){
  const data = {
    username: username
  }
  window.app.socket.emit('poke', data);
}

actions.poked = function(data){
  console.log('action poked');
  $(window).trigger({
    type: 'POKED',
    username: data.username
  });
}

actions.sendMessage = function(message, user){
  const data = {
    message: message,
    username: user.username
  }
  window.app.socket.emit('send_message', data);
//  actions.receiveMessage(data);
}

actions.receiveMessage = function(data){
  $(window).trigger({
    type: 'RECEIVE_MESSAGE',
    message: data.message,
    username: data.username,
  });
}

//actions.move = function(){}

actions.updateMemberPosition = function(response){
    var members = [];
    for (let index in response){
      members.push(JSON.parse(response[index]));
    }
  
    $(window).trigger({
      type: 'UPDATE_MEMBER_POSITION',
      members: members,
    });
};

window.app.socket.on("UPDATE_MEMBER_POSITION", (response)=>{
  actions.updateMemberPosition(response);
});

window.app.socket.on("LOGIN_SUCCESS", (response)=>{
  actions.loginSuccess(response);
});

window.app.socket.on("LOGIN_FAIL", (response)=>{
  actions.loginFail(response);
});

window.app.socket.on("LOGIN_FAIL", (response)=>{
  actions.loginFail(response);
});

window.app.socket.on("RECEIVE_MESSAGE", (response)=>{
  actions.receiveMessage(response);
});

window.app.socket.on("POKED", (response)=>{
  actions.poked(response);
});

module.exports = actions;
