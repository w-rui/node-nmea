define(['underscore'],function() {
  var e = {};
  e.obj = function(obj) {
    var s = [];
    if (typeof(obj) !== 'object') {
      s.push(obj.toString());
      return s;
    }
    
    s.push('{');
    for(var i in obj) {
      if (obj.hasOwnProperty(i)) {
        s.push('  ' + i + ':' + obj[i]);
      }
      else {
        s.push('*  ' + i + ':' + obj[i]);
      }
    }
    s.push('}');
    return s;
  };

  e.arr = function(a) {
    s = _.map(a,function(m,v) {
      return e.obj(v);
    });
    s.splice(0,0,'[');
    s.push(']');
    return s;
  };
  
  return e;
});
