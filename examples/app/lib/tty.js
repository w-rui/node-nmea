var  serial = require('serialport') // voodootikigod / node-serialport : npm -g install serialport
    ,nmea   = require('nmea');   

var tty = {

  // don't print errors
  start : function(port,callback) {
    nmea.setErrorHandler(function() {});
  
    // open the serial port at the required baud rate and use the line parser
    // note that NMEA output uses \r\n instead of just \n as a line delimiter
    var sp = new serial.SerialPort(port,
                                  { 
                                    baudrate:4800,
                                    parser: serial.parsers.readline("\r\n") 
                                  });
  
    // wait for data
    sp.on('data',function(line) {
      // parse the nmea sentence 
      var s = nmea.parse(line);
      if (s != null) {
        // if it was parseable,make the callback
        if (callback) {
          callback(s,line);
        }
      }
    });
  }
};

module.exports = tty;
