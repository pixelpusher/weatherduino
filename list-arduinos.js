var serialport = require("serialport");
//var __ = require("./lib/fn.js");
var rport = /usb|acm|com/i;

// adapted from the board.js file in Johnny-five
// https://github.com/rwaldron/johnny-five/wiki/Board


serialport.list(function(err, result) {
  var ports,
      length;
  
  console.log(result);
  //!rport.test(val.comName)
  
/*
  ports = result.filter(function(val) {
    var available = true;

    // Match only ports that Arduino cares about
    // ttyUSB#, cu.usbmodem#, COM#
    if ( !rport.test(val.comName) ) {
      available = false;
    }

    return available;
  }).map(function(val) {
    return val.comName;
  });

  length = ports.length;
*/
  // If no ports are detected when scanning /dev/, then there is
  // nothing left to do and we can safely exit the program
  if ( !length ) {
    // Alert user that no devices were detected
    console.log("No USB devices detected" );
  }
  else
  {
    console.log("Arduino ports found: " + ports);
  }
});