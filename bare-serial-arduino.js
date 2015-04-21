//
// bare-serial-arduino.js (c) 2015 by Evan Raskob e.raskob@rave.ac.uk
//  
// just a simple starting point for connecting to an Arduino using the serial port
// and sending it some data!
// 


var serialport = require("serialport");
var rport = /usb|acm|$com/i;

var portName = "";
var arduino = {}; // the empty arduino object that we'll get from the serial port later



serialport.list(function(err, result) {
  var ports = [],
      length;
  
  console.log(result);
  
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
     baudRate: 9600,
     // look for return and newline at the end of each data packet:
     parser: serialport.parsers.readline("\r\n")
   });


  arduino.on('open', function() {
    console.log('port open. Data rate: ' + this.options.baudRate);
    changeHue();
  })

  
  arduino.on('data', function(data) {
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

  // send some data to the Arduino, then do it again:

  function changeHue()
  {
    arduino.write('h');

    setTimeout(changeHue, 1500);
  }


  }
});





