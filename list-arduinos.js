/**
 * Find all serial ports that look like Arduinos and print them to the console.
 * 
 * by Evan Raskob info@pixelist.info 2015
 * 
 **/

var serialport = require("serialport");

var rport = /usb|acm|com/i;

serialport.list(function(err, result) {
  var ports,
      length;
  
  var i=0;
  
  while (i < result.length)
  {
    console.log("found potential port:" + result[i]);
    console.log();
    
    var portName = result[i].comName(val.comName);
    
     if (rport.test(portName))
     {
       // found a potential Arduino port
       ports.push(portName);
     }
     // next result
     i++;
  }  
  
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
  }
});
