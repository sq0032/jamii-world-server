import React, { Component } from 'react';
import actions from './actions';
import $ from 'jquery';

var sound_poke = new Audio("./audio/sounds-954-all-eyes-on-me.mp3");
sound_poke.preload = 'auto';
sound_poke.load();

var sound_talk = new Audio("./audio/sounds-1055-your-turn.mp3");
sound_talk.preload = 'auto';
sound_talk.load();

export default class Member extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      message: ''
    };
  }
  
  componentDidMount(){
//    actions.connectServer();
    $(window)
      .on('RECEIVE_MESSAGE', {this:this}, this.on_receiveMessage)
      .on('POKED', {this:this}, this.on_poked);
    
    //Initial file fetch (passing in root id)
  }
  componentWillUnmount(){
    $(window)
      .off('RECEIVE_MESSAGE', this.on_receiveMessage)
      .off('POKED', this.on_poked);
  }
  
  on_receiveMessage(event) {
    const that = event.data.this;
    if (that.props.username == event.username){
      sound_talk.play();
      that.setState({message : event.message});
    }
  }
  
  on_poked(event) {
    const that = event.data.this;
    if (that.props.username == event.username){
      sound_poke.play();
    }
  }
  
  poke(event) {
    console.log(`pork ${this.props.username}`);
    event.preventDefault();
    event.stopPropagation();
    sound_poke.play();
    actions.poke(this.props.username);
  }
  
  render() {
    const fill = role.fill[this.props.role];
    const message = this.state.message == '' ? null : `says: ${this.state.message}`;
    return (
      <svg onClick={this.poke.bind(this)} x={this.props.pos.x} y={this.props.pos.y}>
        <text x="30" y="15" fill="gray">{message}</text>
        <circle cx="8" cy="10" r="8" fill={fill}></circle>
        <rect y="20" x="2" width="12" height="30" fill={fill} />
        <text x="0" y="60" fill={fill}>{this.props.username}</text>
      </svg>
    );
  }
}

const style = {
  Member: {
    fill:"blue",
  }
};

const role = {
  fill: {
    user: 'blue',
    member: '#555555'
  }
}