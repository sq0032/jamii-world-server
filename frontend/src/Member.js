import React, { Component } from 'react';



export default class Member extends Component {
  render() {
    const fill = role.fill[this.props.role];
    
    return (
      <svg x={this.props.pos.x} y={this.props.pos.y}>
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