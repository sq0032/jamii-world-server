var express = require('express');
var socket_io = require('socket.io');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require("redis");
var client = redis.createClient('6379', 'redis');

var routes = require('./routes/index');
var users = require('./routes/users');

// Express
var app = express();

// Socket.io
var io = socket_io();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

app.post('/login', function(req, res){
  var user = {
    username: req.body.username,
    x: 150,
    y: 150
  };
  
  client.hset("user11", user.username, JSON.stringify(user));
  client.hget("user11", user.username, function(err, obj){
    console.log(obj);
    res.json(obj);
  });
//  console.log(typeof(user.username));
//  client.hexists("users", user.username, function(err, reply){
//    console.log(reply);
//  }); 
//  res.json(req.body);
//  res.send('good');
});
var num = 0;

app.get('/redis', function(req, res){
  var user = {
    name: "user"+num,
    x: 100+num,
    y: 150+num*2
  };
  console.log(user.name);
  console.log(JSON.stringify(user));
  client.hset("user11", user.name, user, redis.print);
  client.hgetall("user11", function(err, obj){
    console.log(typeof(obj));
    res.send(obj);
  });
  num = num+1;
});

//app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

io.on("connect", function(socket){
  console.log("A user connected");
  socket.emit('news', { hello: 'world' });
  
  socket.on("login", function(username){
      //Checkt if user has logged in
      client.hexists("user10", username, function(err, reply){
        if (reply==0){
          client.set(username, socket.id);
          var user = {
            username: username,
            x: 150,
            y: 150
          };
          client.hset("user10", username, JSON.stringify(user));
          client.hget("user10", username, function(err, obj){
            socket.emit("LOGIN_SUCCESS", obj);
          });
          client.hgetall("user10", function(err, obj){
            console.log(obj);
            io.emit('UPDATE_MEMBER_POSITION', obj);
          });          
          socket.username = username;
        } else {
          socket.emit("LOGIN_FAIL", "user exists");
        }
        console.log(reply);
      });
  });
  
  socket.on("move", function(user){
    if (!socket.username){
      socket.username = username;
    }
    client.hset("user10", user.username, JSON.stringify(user));
    client.hgetall("user10", function(err, obj){
      console.log(obj);
      io.emit('UPDATE_MEMBER_POSITION', obj);
    });
  });

  /*
    data:{
      message: message,
      username: user.username
    }
  */
  socket.on("poke", function(data){
    io.emit("POKED", data)
  })
  
  socket.on("send_message", function(data){
    io.emit("RECEIVE_MESSAGE", data)
  })
  
  socket.on('disconnect', function (data) {
    if (socket.username){
      client.hdel("user10", socket.username);
      client.hgetall("user10", function(err, obj){
        io.emit('UPDATE_MEMBER_POSITION', obj);
      });
    }
  });
});

module.exports = app;
