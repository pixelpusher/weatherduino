var five = require("johnny-five"); // load library
var board = new five.Board(
  {
    port: "/dev/cu.usbmodemfd121"
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
  });
            
};
        
board.on("ready", setupButton); // this runs when the board first connects