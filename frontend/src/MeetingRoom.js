import React, { Component } from 'react';
import actions from './actions';

export default class MeetingRoom extends Component {
  moveToMeetingRoom(event) {
    event.preventDefault();
    event.stopPropagation();
    actions.moveToMeetingRoom(this.props.pos);
    window.open(this.props.link, '_blank');
  }
  render() {
    return (
      <svg>
        <rect x={this.props.pos.x}
              y={this.props.pos.y}
              width="150" 
              height="150"
              style={style.MeetingRoom}
              onClick={this.moveToMeetingRoom.bind(this)}>
        </rect>
        <text x={this.props.pos.x+25} y={this.props.pos.y+25} fill="black">{this.props.name}</text>
      </svg>
    );
  }
}

const style = {
  MeetingRoom: {
    fill:"blue",
    stroke:"pink",
    strokeWidth:"5",
    fillOpacity:"0.1",
    strokeOpacity:"0.9",
    cursor: "pointer"
  }
};