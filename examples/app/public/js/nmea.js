require(['jquery','bootstrap','examine','/socket.io/socket.io.js'],function(jq,ud,bt,xmn,sio) {

  var gga_count = 0;
  var rmc_count = 0;
  var gsv_count = 0;
  
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
  
  var updateGGA = function(gpgga,raw) {
    var gga;
    var s;
    gga = _.toArray(gpgga);
    $('#nmea .cdata0').each(function(i) {
    if (i < gga.length) {
        s = gga[i].toString().slice(0,22);
        if (s === '') {
          s = '.';
        }
        $(this).text(s);
      }
    });
    
    // raw text list element
    $('#gga').text(raw);
    
    // count indicator
    gga_count++;
    $('#gga-count').text(gga_count.toString());
  }

  var updateRMC = function(gprmc,raw) {
    var rmc;
    var s;
    rmc = _.toArray(gprmc);
    $('#nmea .cdata1').each(function(i) {
      if (i < rmc.length) {
        s = rmc[i].toString().slice(0,22);
        if (s === '') {
          s = '.';
        }
        $(this).text(s);
      }
    });

    // raw text list element
    $('#rmc').text(raw);
    
    // count indicator
    rmc_count++;
    $('#rmc-count').text(rmc_count.toString());    
  }
  
  var updateGSV = function(gpgsv,raw) {
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
    $('#nmea .cdata2').each(function(i) {
      if (i < gsv.length) {
        s = gsv[i].toString().slice(0,20);
        if (s === '') {
          s = '.';
        }
        $(this).text(s);
      }
    });    
    
    j = 0;
    $('#nmea .cdata2').each(function(i) {
      if ((row <= i)&&(i < (row + 4))) {
        s = a[j].toString().slice(0,22);
        if (s === '') {
          s = '.';
        }
        $(this).text(s);
        j++;
      }
    });    
    // raw text list element
    $('#gsv').text(raw);
    
    // count indicator
    gsv_count++;
    $('#gsv-count').text(gsv_count.toString());
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
      switch(a.data.id) {
      case 'GPGGA':
        updateGGA(a.data,a.raw);
        break;
      case 'GPRMC':
        updateRMC(a.data,a.raw);
        break;
      case 'GPGSV':
        updateGSV(a.data,a.raw);
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
