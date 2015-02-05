/*
 * Demo of how to make a toggle button using
 * NodeJS, Johnny-Five and Arduino
 *
 * by Evan Raskob info@pixelist.info 2015
 */


var five = require("johnny-five"); // load library
var board = new five.Board(
  {
    //port: "/dev/cu.usbmodemfd121"
    //port: "/dev/cu.usbserial-A8008kUM"
    port: "/dev/cu.usbmodemfa131"
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
  
  var buttonState = false;
  
  button.on("down", function() {    
    
    buttonState = !buttonState;
    if (buttonState)
    {
        console.log("button TRUE!");
        led.on();
    }
    else
    {
      console.log("button FALSE");
      led.off();
    }
      console.log("button pushed");
  });
            
};
        
board.on("ready", setupButton); // this runs when the board first connects