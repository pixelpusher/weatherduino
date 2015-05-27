//
// arduino-lamp-server.js (c) 2015 by Evan Raskob e.raskob@rave.ac.uk
//  
// This sets up a web server connected to an Arduino with a NeoPixel ring
// working like a budget Philips Lumen system, using an HTML/JS front end
// that uses websockets to communicate back to this NodeJS server.
// 


/////////////////////////////////////////////////////////////
// include Arduino-communications library --------------------------------------
// from Nick Rothwell at https://github.com/cassiel/arduino-polyglot
/////////////////////////////////////////////////////////////
var commsLib = require("./node_lib/comms");

// these map character commands to local functions, for instance '!' to a print
var arduinoCallbacks = 
{
  '!': function(data) 
  {
    return console.log("CALLBACK: received ! from Arduino");
  },
  'L': function(data) 
  {
    console.log("CALLBACK: received L from Arduino");
    console.log(data);
    return; 
  }
  
};

// this is the communication object that represents the Arduino attached via USB (serial)

var arduino = new commsLib.Comms(
  "", // default to first arduino
  { baudrate: 28800 }, 
  arduinoCallbacks
);

// end including Arduino-communications library ---------------------------------


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
///////  WEB SERVER CODE STARTS HERE
/////////////////////////////////////////////////////////////

// SERVER IS ON PORT 8080 in the current directory (webduino folder)

// http://localhost:8080/FILENAME.html

// port server should run on, must be >= 8000
var port = 8080;

// start the server
var connect = require('connect');
var serveStatic = require('serve-static');
var server = connect();

// print out the directory we're in:
console.log("Server directory:" + __dirname);

// start the app that will server pages in the folder
var app = server.use(serveStatic(__dirname)).listen(port);

// start websockets listening to our app
var io = require('socket.io').listen(app);

// print out some info
console.log("http server on " + port);

console.log(getIPAddresses());


/////////////////////////////////////////////////////////////
///////  WEB SERVER CODE ENDS HERE
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
///////  WEB SOCKETS CODE STARTS HERE
/////////////////////////////////////////////////////////////

//
// This next code runs automatically when a web browser connects to the server
// This defines the web browser to server API
//

io.sockets.on('connection', function (socket) 
{
  
  console.log("connected to client");
  // for testing - just show us the IP address the server is running on
  // console.log( getIPAddresses() );

  
  socket.on('color', function (color) {
    
    console.log("WEBSOCKETS MSG::::color: ");
    console.log(color);
    
    // transmit color codes to the Arduino
    arduino.xmit('c', [color.h, color.s, color.v]);
  });


  socket.on('off', function (color) {

    console.log("WEBSOCKETS MSG::::off");
    
    arduino.xmit('o', [0]); // send a 0
    
    arduino.xmit('L', [1]);
  });


  socket.on('on', function (color) {

    console.log("WEBSOCKETS MSG::::on");

    arduino.xmit('n', [0]); // send a 0
    arduino.xmit('L', [0]);
  });
  

  socket.on('disconnect', function() {
    io.sockets.emit('disconnect', 'true');
  });
});



io.sockets.on('error', function (data) {
  console.log("sockets error: "  + data);
}
);

/////////////////////////////////////////////////////////////
///////  WEB SOCKETS CODE ENDS HERE
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////




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

