"use strict";
/* 
 * a quick and dirty way to run Crockford's JSLint from a command line using node
 *
 * download jslint.js from https://github.com/douglascrockford/JSLint
 * edit it and at the bottom add this line to expose it to the node 'require' mechanism:
 * module.exports.JSLINT = JSLINT;
 *
 * run this file using node '>node node-lint.js <file-to-lint.js'
 *
 * you can edit the variable 'options' in this file to change the lint options.
 * you can edit the way it prints errors
 */
var fs     = require('fs');
var JSLINT = require('./jslint.js').JSLINT;
// ===============================================================
// format numbers
// ===============================================================
function lpad(n,size) {
	var s = n.toString();
	var i = size - s.length;
	for(i;i>0; i--) {
		s = ' ' + s;
	}
	return s; 
}
// ===============================================================
// execute jslint on a string
// ===============================================================
function execLint(data) {
	var error;
	var msg;
	var i;
	var result;

	var options = {
		anon:true,
		indent:4,
		node:true,
		plusplus:true,
		vars:true,
		white:true,
		bitwise:true
	};

	// invoke JSlint on the input string
	result = JSLINT(data,options);
	if (result) {
		// no errors
		console.log("OK");
	}
	else {
		// output the error information
		for(i=0; i<JSLINT.errors.length;++i) {
			// get the error
			error = JSLINT.errors[i];
			if (error === null) {
				// sometimes the errors array has a null as the last element
				break;
			}

			/* example JSLINT error object
			{ id: '(error)',
			  raw: 'Expected \'{a}\' at column {b}, not column {c}.',
			  evidence: '\t\tfor(var i=0;i<JSLINT.errors.length;++i) {',
			  line: 26,
			  character: 9,
			  a: 'for',
			  b: 13,
			  c: 9,
			  d: undefined,
			  reason: 'Expected \'for\' at column 13, not column 9.' }
			*/
			// print the error information
			msg = lpad(error.line,4) + ":" + lpad(error.character,3) + ":" + error.reason;
			console.log(msg);
		}
		process.exit(1);
	}
}

// ===============================================================
// read and process the input file
// usage : node lint.js <javascript-file.js
// ===============================================================
var jsdata = "";

// create the stream to read in the file
var s = process.stdin;

s.setEncoding("ascii");

// accumulate data until end of file
s.on("data", function (data) {
	jsdata += data;
});

// on end of file, run it throught jslint
s.on("end", function() {
	execLint(jsdata);
});

// read the stream
s.resume();

