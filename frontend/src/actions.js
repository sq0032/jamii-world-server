var $ = require('jquery');
//var jmEvent = require('./type');


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

module.exports = actions;
