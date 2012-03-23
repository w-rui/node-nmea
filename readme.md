node-nmea
=========

An extensible parser and encoder for NMEA-0183 sentences. 

If you aren't familiar with NMEA-0183, look it up on Wikipedia.

NMEA-0183 is an ASCII output format supported by most GPS units and is 
used to output the geographical position (latitude/longitude etc) and a lot of other information about the GPS unit. 
If you have a GPS attached to your server or a GPS feed from some other source, 
and want to parse its output, this module will help you do that. If you have some geographic coordinates
and you want to output NMEA-0183 data to another program (e.g. a map program) this library has functions to encode the data properly.

A couple of good references for NMEA-0183 sentence formats are
[Peter Bennett NMEA FAQ](http://vancouver-webpages.com/peter/nmeafaq.txt) and [GPS-NMEA sentence information](http://aprs.gids.nl/nmea/).

Features
========

* runs under node.js
* parses individual NMEA-0183 sentences

    (it doesn't read the serial or USB input. you have to get the sentences from somewhere yourself)

    has built-in support for several of the most common NMEA sentences

    lets you add sentence parsers for those not built-in (there are literally dozens of standard and proprietary sentence types)
* takes geographic location input and encodes it into valid NMEA-0183 sentences
 
