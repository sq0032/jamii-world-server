import React, { Component } from 'react';
import $ from 'jquery';
import {Motion, spring} from 'react-motion';
import MeetingRoom from './MeetingRoom';
import MeetingRoomView from './MeetingRoomView';
import Member from './Member';
import Chatbar from './Chatbar';
import actions from './actions';



export default class JamiiWorld extends Component {
  constructor(props){
    super(props);
    
    this.state = {
//      user: {username:"aaa", x:120, y:120},
      user: null,
      error_message: '',
      members: [],
      is_in_meetingroom: false,
      message: ''
    };
  }
  
  componentDidMount(){
//    actions.connectServer();
    $(window)
      .on('UPDATE_MEMBER_POSITION', {this:this}, this.on_UpdateMemberPosition)
      .on('LOGIN_SUCCESS', {this:this}, this.on_loginSuccess)
      .on('LOGIN_FAIL', {this:this}, this.on_loginFail)
      .on('MOVE_TO_MEETINGROOM', {this:this}, this.on_moveToMeetingRoom)
      .on('MOVE_TO_LOBBY', {this:this}, this.on_moveToLobby);
    
    //Initial file fetch (passing in root id)
  }
  componentWillUnmount(){
    $(window)
      .off('UPDATE_MEMBER_POSITION', this.on_UpdateMemberPosition)
      .off('LOGIN_SUCCESS', this.on_loginSuccess)
      .off('LOGIN_FAIL', this.on_loginFail)
      .off('MOVE_TO_MEETINGROOM', this.on_moveToMeetingRoom)
      .off('MOVE_TO_LOBBY', this.on_moveToLobby);
  }
  
  on_UpdateMemberPosition(event){
    const that = event.data.this;
    const members = event.members.filter(function(member){
      return member.username!=that.state.user.username;
    });
    
    that.setState({
      members: members
    });
  }

  on_loginSuccess(event){
    const that = event.data.this;
    console.log(event.user);
    that.setState({
      user: event.user
    });
  }
  
  on_loginFail(event){
    const that = event.data.this;
    that.setState({
      error_message: event.message
    });    
  }
  
  on_moveToMeetingRoom(event) {
    const that = event.data.this;
    const user = {
      username: that.state.user.username,
      x: event.pos.x+50,
      y: event.pos.y+50
    };    
    that.setState({
      user: user,
      is_in_meetingroom:true
    });
    
    actions.moveTo(user);
  }
  
  on_moveToLobby(event) {
    const that = event.data.this;
    that.setState({is_in_meetingroom:false});
  }
  
  moveTo(event) {
    var dim = event.target.getBoundingClientRect();
    const user = {
      username: this.state.user.username,
      x: event.clientX - dim.left,
      y: event.clientY - dim.top
    };
    this.setState({
      user: user,
      is_in_meetingroom: false
    });
    
    actions.moveTo(user);
  }
  
  login(event){
//    console.log(this.refs.username.value);
    if(this.refs.username.value!=''){
      actions.login(this.refs.username.value);
    }
  }
  
  handleChatKeyPress (event){
    console.log(event.key);
    if (event.key=='Enter'){
      actions.sendMessage(this.state.message, this.state.user);
      this.setState({message: ''});
    } else {
      const message = this.state.message + event.key;
      this.setState({message: message});
    }
  }
  
  renderMembers(){
    const Members = this.state.members.map(function(member){
      return (
        <Motion style={{x: spring(member.x), y:spring(member.y)}} key={member.username}>
          {pos => <Member role='member' pos={pos} username={member.username}/>}
        </Motion>
      );
    });
    return Members;
  }
  
  render() {
    console.log(this.state.user);
      const meetingRoomView = this.state.is_in_meetingroom ? (<MeetingRoomView />) : null;
      console.log(meetingRoomView);
      const Members = this.renderMembers();

      return (
        <div style={style.JamiiWorld}>
          <div style={style.JamiiWorldSvg}>
            <svg 
              width="100%"
              height="100%"

              onClick={this.moveTo.bind(this)} >
              <MeetingRoom name="Meeting Room #1" link="https://appear.in/jamii_meeting_room_1" pos={{x:5, y:5}}/>
              <MeetingRoom name="Meeting Room #2" link="https://appear.in/jamii_meeting_room_2" pos={{x:5, y:165}}/>
              <Motion style={{x: spring(this.state.user.x), y:spring(this.state.user.y)}}>
                {pos => <Member role='user' pos={pos} username={this.state.user.username}/>}
              </Motion>
              {Members}
            </svg>
          </div>
          <div style={style.Chatbar}>
            <input onKeyPress={this.handleChatKeyPress.bind(this)} value={this.state.message} placeholder="Say something here" type="text" style={{width:"100%", height:"30px"}}></input>
          </div>
          {meetingRoomView}
        </div>
      );
    }
}

const style = {
  JamiiWorld: {
//    position: "relative",
//    width: "100%",
//    height: "100%",
    position: "absolute",
    top: "0px",
    bottom: "0px",
    left: "0px",
    right: "0px",
    border: "0px",
    padding: "5px"
//    marginBottom: "50px"
  },
  JamiiWorldSvg: {
//    position: "relative",
    border: "5px solid black",
//    marginBottom: "50px"
    position: "absolute",
//    height: "100%",
    top: "5px",
    left: "5px",
    right: "5px",
    bottom: "40px",
//    width: "500px",
//    border: "5px solid black"
  },
  Chatbar: {
    position: "absolute",
    bottom: "5px",
    left: "5px",
    right: "5px",
//    height: "50px"
    
    
  }
};