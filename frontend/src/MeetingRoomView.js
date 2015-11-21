import React, { Component, PropTypes } from 'react';

import actions from './actions';


const style = {
  base: {
    position: "absolute",
    width: "45%",
    backgroundColor: "#ddd",
    top: "20px",
    right: "20px",
    bottom: "20px",
    border: "3px solid #555",
    borderRadius: "20px",
    padding: "20px"
  },
  closeBtn: {
    position: "absolute",
    right: "10px",
    top: "10px"
  }
};

export default class MeetingRoomView extends React.Component{
  constructor(props){
    super(props);
    
    this.handleClick = this.handleClick.bind(this);
    this.handleClickCloseBtn = this.handleClickCloseBtn.bind(this);
    this.handleClickLikeBtn = this.handleClickLikeBtn.bind(this);
    this.state = {
    };
  }
  handleClick(){
    console.log("click rect");
  }
  handleClickCloseBtn(){
    actions.moveToLobby();
  }
  handleClickLikeBtn(){
//    actions.likeHex(this.props.hex);
  }
  render(){
    return (
      <div style={style.base}>
        <button 
          style={style.closeBtn}
          onClick={this.handleClickCloseBtn}
        >
          Close
        </button>
      </div>
    );
  }
};

MeetingRoomView.propTypes = { 
};

MeetingRoomView.defaultProps = { 
};

