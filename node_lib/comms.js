// from Nick Rothwell at https://github.com/cassiel/arduino-polyglot
// arduino version hacked by evan raskob e.raskob@rave.ac.uk

(function() {
  var serialport, Comms;
  
  var rport = /usb|acm|$com/i;  // pattern to match in strings

  serialport = require("serialport");

  if (serialport) console.log("serialport");
  
  
  Comms = (function() {
    function Comms(port, options, callbacks) {
    
      var handleByte, inMessage, opener;
      this.port = port; // arduino by default if nothing passed in
      this.options = options;
      this.callbacks = callbacks;
      this.__opened = false;
      this.__onDataFunction = function(data) {
        var b, j, len1, results1;
        results1 = [];
        for (j = 0, len1 = data.length; j < len1; j++) {
          b = data[j];
          results1.push(handleByte(b));
        }
        return results1;
      };

      this.__onErrorFunction = function(data) {
        console.log('Serial port error: ' + error);
      };
      
      // search for port
      if (!this.port)
      {
        // load arduino by default
        serialport.list(function(err, result) {

          console.log("SERIAL LIST");

          var ports = [],
              length;

          if ( err ) {
            err = err.message || err;
            console.log("Serial list error: " + err);
          }

          result.forEach(function(port) {

            console.log("Serial port found:" + port.comName);      
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
            this.port = ports[0];
            this.__serialPort = new serialport.SerialPort(this.port, this.options);
            this.__serialPort.on("open", opener.bind(this));
            this.__serialPort.on("data", this.__onDataFunction);
            this.__serialPort.on("error", this.__onErrorFunction);
          }
        // end serial port list
        });
      }
      else
      {
        console.log("opening port : " + this.port);
        this.__serialPort = new serialport.SerialPort(this.port, this.options);
        this.__serialPort.on("open", opener.bind(this));
        this.__serialPort.on("data", this.onDataFunction);
        this.__serialPort.on("error", this.onErrorFunction);
      }

      opener = function() {
        console.log("open");
        return this.__opened = true;
      };
      
      
      inMessage = [];
      handleByte = function(b) {
        var cmd, data, i, j, len, ref;
        inMessage.push(b);
        if (b === 0x80) {
          console.log(inMessage.map(function(i) {
            return ("0" + i.toString(16)).slice(-2);
          }).join(" "));
          if (inMessage.length > 0 && inMessage[0] > 0x80) {
            cmd = inMessage[0] & 0x7F;
            data = [];
            len = (inMessage.length - 2) / 2;
            for (i = j = 0, ref = len - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
              data.push((inMessage[1 + i * 2] << 4) | inMessage[2 + i * 2]);
            }
            console.log("data", data);
          }
          return inMessage = [];
        }
      };
      
    }

    Comms.prototype.rawWrite = function(a) {
      var buf;
      if (this.__opened) {
        buf = new Buffer(a);
        this.__serialPort.write(buf, function(err, results) {
          if (err) {
            return console.log("err: " + err);
          }
        });
        return this.__serialPort.drain();
      } else {
        return console.log("port not open yet");
      }
    };

    Comms.prototype.xmit = function(ch, bytes) {
      var a, b, j, len1;
      a = [(ch.charCodeAt(0)) | 0x80];
      for (j = 0, len1 = bytes.length; j < len1; j++) {
        b = bytes[j];
        a.push(b >> 4);
        a.push(b & 0x0F);
      }
      a.push(0x80);
      console.log(a);
      return this.rawWrite(a);
    };

    return Comms;

  })();

  module.exports = {
    Comms: Comms
  };


}).call(this);
