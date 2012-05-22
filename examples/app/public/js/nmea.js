require(['jquery','bootstrap','examine','/socket.io/socket.io.js'],function(jq,ud,bt,xmn,sio) {

  var gprmcHeaders =   
  [ 'id:',
    'time:',
    'valid:',
    'latitude:',
    'longitude:',
    'speed:',
    'course:',
    'date:',
    'variation:',
    'datetime:' 
  ];
  
  var gpggaHeaders = 
  [
    'id:',
    'time:',
    'latitude:',
    'longitude:',
    'fix:',
    'satellites:',
    'hdop:',
    'altitude:',
    'abvGeoid:',
    'dgpsUpd:',
    'dgpsRef:'
  ];

  var gpgsvHeaders = 
  [
    'id',
    'messages',
    'msg num',
    'total sats',
    'sat',
    'sat',
    'sat',
    'sat',
    'sat',
    'sat',
    'sat',
    'sat',
    'sat',
    'sat',
    'sat',
    'sat'
  ];
  
  var updateGGA = function(gpgga) {
    var gga;
    var s;
    gga = _.toArray(gpgga);
    $('#nmea .cdata0').each(function(i) {
    if (i < gga.length) {
        s = gga[i] || '.';
        $(this).text(s);
      }
    });
  }

  var updateRMC = function(gprmc) {
    var rmc;
    var s;
    rmc = _.toArray(gprmc);
    $('#nmea .cdata1').each(function(i) {
      if (i < rmc.length) {
        s = rmc[i] || '.';
        $(this).text(s);
      }
    });
  }
  
  var updateGSV = function(gpgsv) {
    var gsv = [];
    var sat;
    var s;
    var a;
    var r; 
    var j;
    a = _.toArray(gpgsv);
    // get first 4 elements which are static
    gsv = a.slice(0,4);
    // next 4 are objects
    a = [];
    for(j=0;j<gpgsv.sat.length;j++) {
      s  = gpgsv.sat[j].prn;
      s += ':';
      s += gpgsv.sat[j].el;
      s += ':';
      s += gpgsv.sat[j].az;
      s += ':';
      s += gpgsv.sat[j].ss;
      a.push(s);
    }
    row = 4 + (gpgsv.mnum - 1) * 4;
    console.log('gsv',gsv.length);
    $('#nmea .cdata2').each(function(i) {
      if (i < gsv.length) {
        s = gsv[i] || '.';
        $(this).text(s);
      }
    });    
    
    j = 0;
    $('#nmea .cdata2').each(function(i) {
      if ((row <= i)&&(i < (row + 4))) {
        s = a[j] || '.';
        $(this).text(s);
        j++;
      }
    });    
  }
      
  $(document).ready(function() {
    var socket;
    
    // populate the first column of labels
    $('#nmea .clabel0').each(function(i) {
      if (i < gpggaHeaders.length) {
        $(this).text(gpggaHeaders[i]);
        $(this).addClass('label');
      }
    });
    // populate the second column of labels
    $('#nmea .clabel1').each(function(i) {
      if (i < gprmcHeaders.length) {
        $(this).text(gprmcHeaders[i]);
        $(this).addClass('label');
      }
    });
    // populate the third column of labels
    $('#nmea .clabel2').each(function(i) {
      if (i < gpgsvHeaders.length) {
        $(this).text(gpgsvHeaders[i]);
        $(this).addClass('label');
      }
    });
    
    // start the socket updates
    socket = io.connect();
    
    socket.on('connect',function() {
      $('#status').removeClass('label-warning');
      $('#status').addClass('label-success');
      $('#status').text('connected');
    });
    
    socket.on('message',function(msg) {
      var a = JSON.parse(msg);
      switch(a.id) {
      case 'GPGGA':
        updateGGA(a);
        break;
      case 'GPRMC':
        updateRMC(a);
        break;
      case 'GPGSV':
        updateGSV(a);
        break;
      default:
        break;
      }
    });
    
    socket.on('disconnect',function() {
      $('#status').removeClass('label-success');
      $('#status').addClass('label-warning');
      $('#status').text('not connected');
    })
  });
});
