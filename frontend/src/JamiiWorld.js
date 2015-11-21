import React, { Component } from 'react';
import $ from 'jquery';
import {Motion, spring} from 'react-motion';
import MeetingRoom from './MeetingRoom';
import MeetingRoomView from './MeetingRoomView';
import Member from './Member';


export default class JamiiWorld extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      member_position: {x:100, y:100},
      is_in_meetingroom: false
    };
  }
  
  componentDidMount(){
    $(window)
      .on('MOVE_TO_MEETINGROOM', {this:this}, this.on_moveToMeetingRoom)
      .on('MOVE_TO_LOBBY', {this:this}, this.on_moveToLobby);
    
    //Initial file fetch (passing in root id)
  }
  componentWillUnmount(){
    $(window)
      .off('MOVE_TO_MEETINGROOM', this.on_moveToMeetingRoom)
      .off('MOVE_TO_LOBBY', this.on_moveToLobby);
  }
  
  on_moveToMeetingRoom(event) {
    const that = event.data.this;
    const pos = {
      x: 50,
      y: 50
    };    
    that.setState({
      member_position: pos,
      is_in_meetingroom:true
    });
  }
  on_moveToLobby(event) {
    const that = event.data.this;
    that.setState({is_in_meetingroom:false});
  }
  
  moveTo(event) {
    var dim = event.target.getBoundingClientRect();
    const pos = {
      x: event.clientX - dim.left,
      y: event.clientY - dim.top
    };
    this.setState({
      member_position: pos,
      is_in_meetingroom: false
    });
  }
  
  render() {
    const meetingRoomView = this.state.is_in_meetingroom ? (<MeetingRoomView />) : null
    
    console.log(meetingRoomView);
    
    return (
      <div style={style.JamiiWorld}>
        <svg 
          width="100%" 
          height="100%" 
          style={style.JamiiWorldSvg}
          onClick={this.moveTo.bind(this)} >
          <MeetingRoom pos={{x:5, y:5}}/>
          <Motion style={{x: spring(this.state.member_position.x), y:spring(this.state.member_position.y)}}>
            {pos => <Member pos={pos}/>}
          </Motion>
        </svg>
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