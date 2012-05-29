var  serial = require('serialport'), // voodootikigod / node-serialport : npm -g install serialport
     nmea   = require('nmea');   

// don't print errors
nmea.setErrorHandler(function() {});

// open the serial port at the required baud rate and use the line parser
// note that NMEA output uses \r\n instead of just \n as a line delimiter
var sp = new serial.SerialPort("/dev/ttyS0",
                              { 
                                baudrate:4800,
                                parser: serial.parsers.readline("\r\n") 
                               });

// wait for data
sp.on('data',function(line) {
  "use strict";
  // parse the nmea sentence 
  var s = nmea.parse(line);
  if (s !== null) {
    // if it was parseable, print the raw line and the decoded object data
    console.log(line);
    console.log(s);    
  }
});

