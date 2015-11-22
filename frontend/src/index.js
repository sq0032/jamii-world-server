import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import JamiiWorld from './JamiiWorld';

var io = require('socket.io-client');
window.app = window.app || {};
var url = window.location.host.split(':')[0];
window.app.socket = io.connect("http://"+url+":3000");
window.app.socket.on("connect", function(){
    console.log( "Connected!" );
});

ReactDOM.render(<JamiiWorld />, document.getElementById('root'));
