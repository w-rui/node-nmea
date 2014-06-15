var Helper = require("../Helper.js");

/** GLL encoder object
 * $GPGLL,4740.92036,N,12224.30174,W,045143.00,A,D*76

 GLL  = Geographic Position - Latitude, Longitude and time.

 
 1    = Latitude of fix
 2    = N or S
 3    = Longitude of fix
 4    = E or W
 5    = Status (A=data valid or V=data not valid)
 6    = Mode (A=Autonomous, D=DGPS, E=DR, Only present in NMEA version 3.00)
 7    = Checksum

 input: {
            TODO: add input parameters
        }
 */

exports.Encoder = function(id) {
    this.id = id;
    this.encode = function(id, data) {
        /*
        var a = [];
        var gll;

TODO: complete encoder
        a.push('$' + id);
    
        a.push(Helper.encodeLatitude(data.lat, 3));
        a.push(Helper.encodeLongitude(data.lon, 3));

        gll = a.join();
        return gll;
        */
        throw new Error("Encoder not available");
    };
};

/** GPGLL parser object */
exports.Decoder = function(id) {
    this.id = id;

    this._status = function(char){
        switch(char){
            case "A" : return "data valid "
            case "V" : return "data not valid"
        }
    };

    this._mode = function(char){
        switch(char){
            case "A" : return "Autonomous"
            case "D" : return "DGPS"
            case "E" : return "DR";
        }
    };

    this.parse = function(tokens) {
        var rmc;
        if(tokens.length < 8) {
            throw new Error('GLL : not enough tokens');
        }

        gll = {
            id : tokens[0].substr(1),
            latitude : Helper.parseLatitude(tokens[1], tokens[2]),
            longitude : Helper.parseLongitude(tokens[3], tokens[4]),
            utc_time : tokens[5],
            status : this._status(tokens[6]),
            mode : this._mode(tokens[7])
        };
        return gll;
    };
};