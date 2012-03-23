all : 
	cd test && node lint <../lib/nmea001.js
	cd test && mocha --ui tdd -R list nmea.test.js


