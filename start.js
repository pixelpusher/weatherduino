var five  = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

    var led = new five.Led(13);
  	var button = new five.Button(2);

    led.strobe(100);

  // Button Event API

  // "down" the button is pressed
  button.on("down", function() {
	console.log("down");
  });
  
  
  // "hold" the button is pressed for specified time.
  //        defaults to 500ms (1/2 second)
  //        set
  button.on("hold", function() {
    console.log("hold");
  });

  // "up" the button is released
  button.on("up", function() {
    console.log("up");
    
    
    led.strobe(100);
    
  });
  
});
