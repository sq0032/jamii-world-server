import React, { Component } from 'react';
import $ from 'jquery';
import {Motion, spring} from 'react-motion';
import MeetingRoom from './MeetingRoom';
import MeetingRoomView from './MeetingRoomView';
import Member from './Member';
import actions from './actions';



export default class JamiiWorld extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      user: null,
      error_message: '',
      members: [],
      is_in_meetingroom: false
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
    if (!this.state.user){
      return (
        <div>
          <input type="text" name="username" placeholder="username" ref="username" />
          <button onClick={this.login.bind(this)}>Submit</button>
          <p style={{color:"red"}}>{this.state.error_message}</p>
        </div>
      );
    } else {
      const meetingRoomView = this.state.is_in_meetingroom ? (<MeetingRoomView />) : null;
      console.log(meetingRoomView);
      const Members = this.renderMembers();

      return (
        <div style={style.JamiiWorld}>
          <svg 
            width="100%" 
            height="100%" 
            style={style.JamiiWorldSvg}
            onClick={this.moveTo.bind(this)} >
            <MeetingRoom name="Meeting Room #1" link="https://appear.in/jamii_meeting_room_1" pos={{x:5, y:5}}/>
            <MeetingRoom name="Meeting Room #2" link="https://appear.in/jamii_meeting_room_2" pos={{x:5, y:165}}/>
            <Motion style={{x: spring(this.state.user.x), y:spring(this.state.user.y)}}>
              {pos => <Member role='user' pos={pos} username={this.state.user.username}/>}
            </Motion>
            {Members}
          </svg>
            {meetingRoomView}
        </div>
      );
    }
  }
}

const style = {
  JamiiWorld: {
//    position: "relative",
//    width: "100%",
//    height: "100%",
    position: "absolute",
    top: "10",
    bottom: "10",
    left: "10",
    right: "10",
    border: "5px solid black",
  },
  JamiiWorldSvg: {
//    position: "absolute",
//    height: "100%",
//    top: "50",
//    bottom: "40",
//    left: "0",
//    right: "0",
//    width: "500px",
//    border: "5px solid black"
  }
};