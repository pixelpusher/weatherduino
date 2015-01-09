var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var mic = new five.Sensor("A3");
  var led = new five.Led(5);
  var base = 530;

  mic.on("data", function() {
    if (this.value > base) {
      led.on();
    } else {
      led.off();
    }
  });
});