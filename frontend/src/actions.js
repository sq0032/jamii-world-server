var $ = require('jquery');
//var jmEvent = require('./type');

//********Real-time response functionality***********


var actions = {};

//Board actions
actions.moveToMeetingRoom = function(){
    console.log('MOVE_TO_MEETINGROOM');
    $(window).trigger({
      type: 'MOVE_TO_MEETINGROOM',
    });
};

actions.moveToLobby = function(){
    console.log('MOVE_TO_LOBBY');
    $(window).trigger({
      type: 'MOVE_TO_LOBBY',
    });
};

actions.connectServer = function(){

};

actions.login = function(username){
    const data = {
        username: username
    }
          
    const url = "/login";
    $.ajax({
        method: 'POST',
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json'
    })
    .done(function( response ){
//      console.log(`login success ${response}`);
//      console.log(response);
//      var user = null;
//      var user = JSON.parse(response[username]);
      
      window.test = response;
      $(window).trigger({
        type: 'LOGIN_SUCCESS',
        user: JSON.parse(response[username]),
      });
    })
    .fail(function( response ){
      $(window).trigger({
        type: 'LOGIN_FAIL'
      });
    });
};

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
  actions.loginSuccess(response);
});

module.exports = actions;
