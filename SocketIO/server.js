var express = require('express');			// include express.js
var app = express();								// make an instance of express.js
var http = require('http').Server(app);	// include http and make a server instance with the express instance
var io = require('socket.io')(http);		// include socket.io and make a socket server instance with the http instance

// send the index page if you get a request for / :
app.get('/', sendIndex);

// callback function for 'get /' requests:
function sendIndex(request, response){
	response.sendFile(__dirname + '/index.html');
}

io.on('connection', function(socket){
  console.log('a user connected');
  console.log(socket.handshake.address);
  // send something to the web client with the data:
	socket.emit('message', "Hello, " + socket.handshake.address);
	
	// if the client sends you data, act on it:
	socket.on('message', function(data) {
		console.log('received from client: ' +data);
	});
	
	// send the time out an open socket:
	function sendTime() {
		var message = "Time and date from the server: " + new Date();
			socket.emit('message',message);
	}

	// when a socket's open, send the time once a second:
	setInterval(sendTime, 1000); 
});

// listen for incoming server messages:
http.listen(8080, function(){
  console.log('listening on port 8080');
});