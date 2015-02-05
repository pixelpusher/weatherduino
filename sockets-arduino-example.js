/* 
 This server connects to web pages
 over a node websocket using socket.io.  It also
 connects to an arduino so you can have something physical
 triggering animations or other visual actions on your phone
 or computer.

 With node.js installed, start the server with the command:
 "node sockets-arduino-example.js"
 
* by Evan Raskob info@pixelist.info 2015
*/

///////////////////////////////////////////////////////////////
// connect to Arduino first
//
var five = require("johnny-five"); // load arduino library

var board = new five.Board(
  {
    //port: "/dev/cu.usbmodemfd121"
    port: "/dev/cu.usbmodemfa131"
    //port: "/dev/cu.usbserial-A8008kUM"
  }
); // this is the arduino


var setupButton = function() {

  // Create an Led on pin 13
  var led = new five.Led(13);

  // Strobe the pin on/off, defaults to 100ms phases
  //led.strobe();


  var button = new five.Button(
    {
      pin: 5,
      isPullup: true
    }
  );


  button.on("down", function() {    
    led.on();
    console.log("button pushed");
    io.sockets.emit('message', 'hello'); // this might be dangerous...
  });
  
  // homework -----------
  // How about adding in a Sensor https://github.com/rwaldron/johnny-five/wiki/Sensor
  // and taking the data from that sensor and sending it to your
  // web client to change the position of a rectangle
  // io.sockets.emit('position', some_number); 
  // ...

};


board.on("ready", setupButton); // this runs when the board first connects

//
//end arduino code
///////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
// server code
// port server should run on, must be >= 8000
var port = 8080;

// start the server

var connect = require('connect');
var serveStatic = require('serve-static');
var server = connect();

// print out the directory we're in:
console.log("Server directory:" + __dirname);

// we'll use the current directory as the root of the web server.

// start the app that will server pages in the current directory
var app = server.use(serveStatic(__dirname)).listen(port);

// start websockets listening to our app so we can speak with clients
var io = require('socket.io').listen(app);

// print out some info
console.log("http server on " + port);

// for testing - just show us the IP address the server is running on
console.log(getIPAddresses());


//
// This next code runs automatically when a web browser connects to the server
//

io.sockets.on('connection', function (socket) 
{

  
  /*
//
// send some values to all connected browsers:
//
io.sockets.emit('voteData', 
                { 'field': value,
                  'another' : somethingElse                  
                });
*/
  
  socket.on('something', function (data) {
    console.log(data)
  });

  socket.on('button', function (state) {
    //console.log("max msp state change:");

    switch(state)
    {
        
      case 0: 
        break;

      case 1:
        break;


      case 2: 
        break;
    }
  });

  socket.on('disconnect', function() {
    io.sockets.emit('disconnect', 'true');
  });
});



io.sockets.on('error', function (data) {
  console.log("sockets error: "  + data);
}
);



//
// for testing: get all IP addresses for this host
//
function getIPAddresses() 
{
  var ipAddresses = [];

  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        ipAddresses.push(alias.address);
      }
    }
  }

  return ipAddresses;
}
