//
// bare-serial-arduino.js (c) 2015 by Evan Raskob e.raskob@rave.ac.uk
//  
// just a simple starting point for connecting to an Arduino using the serial port
// and sending it some data!
// 


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
    
    var cmd = 'c' + color.h + ',' + color.s + ',' + color.v + "\n"; 
    var buffer = new Buffer(cmd, 'ascii');
    
    //var cmd = "c";
    
    /*
    cmd += String.fromCharCode((color.h) & 0xff);
    cmd += String.fromCharCode((color.s) & 0xff);
    cmd += String.fromCharCode((color.v) & 0xff);
    */
    
    // write ascii!
    /*
    var cmd = new Buffer(4, 'binary');
    cmd.writeUInt8(99,0,1);
    cmd.writeUInt32LE(color.h,1,1);
    cmd.writeUInt32LE(color.s,2,1);
    cmd.writeUInt32LE(color.v,3,1);
    cmd.writeUInt32LE(100,4,1); // write stop bit 'd'
    */
    
    /*
    cmd[1] = String.fromCharCode((color.h) & 0xff);
    cmd[2] = String.fromCharCode((color.s) & 0xff);
    cmd[3] = String.fromCharCode((color.v) & 0xff);
    */
    console.log( "sending cmd:" + buffer );
    //console.log( cmd.length );
    
    arduino.write( buffer, function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });
  });


  socket.on('off', function (color) {

    console.log("WEBSOCKETS MSG::::off");
    
    var cmd = 'o'; 
    
    console.log( cmd );

    arduino.write( cmd );
  });


  socket.on('on', function (color) {

    console.log("WEBSOCKETS MSG::::on");

    var cmd = 'n'; 

    console.log( cmd );

    arduino.write( cmd );
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




var serialport = require("serialport"); // serialport library

var rport = /usb|acm|$com/i;  // pattern to match in strings

var portName = "";

var arduino = {}; // the empty arduino object that we'll get from the serial port later



serialport.list(function(err, result) {
  var ports = [],
      length;
  
  //console.log(result);
  
  result.forEach(function(port) {
    
    if ( rport.test(port.comName) ) {
      ports.push(port.comName);
      console.log(port.comName);
    }
  });

  length = ports.length;
 // If no ports are detected when scanning /dev/, then there is
  // nothing left to do and we can safely exit the program
  if ( !length ) {
    // Alert user that no devices were detected
    console.log("No USB devices detected" );
  }
  else
  {
    console.log("Arduino ports found: " + ports);
    portName = ports[0];


  arduino = new serialport.SerialPort(portName, {
     baudRate: 57600,
     // look for return and newline at the end of each data packet:
     parser: serialport.parsers.readline("\r\n")
   });


  arduino.on('open', function() {
    console.log('port open. Data rate: ' + this.options.baudRate);
    console.log(this.options);
  })

  
  arduino.on('data', function(data) {
    console.log("data:");
    console.log(data);
  });


  function showPortClose() {
   console.log('port closed.');
  }

  function showError(error) {
   console.log('Serial port error: ' + error);
  }

  arduino.on('close', showPortClose);
  
  arduino.on('error', showError);

  }
});





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

