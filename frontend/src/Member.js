import React, { Component } from 'react';

export default class Member extends Component {
  render() {
    return (
      <svg x={this.props.pos.x} y={this.props.pos.y}>
        <circle
          cx="8" cy="10"
          r="8" fill="blue">
        </circle>
        <rect
          y="20"
          x="2"
          width="12"
          height="30" 
          style={style.Member}/>
      </svg>
    );
  }
}

const style = {
  Member: {
    fill:"blue",
  }
};