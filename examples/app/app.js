var express  = require('express')
  , socketio = require('socket.io')
  , routes   = require('./routes')
  , tty      = require('./lib/tty.js')

var app = module.exports = express.createServer();
var io  = socketio.listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

io.configure('production',function() {
  io.set('log level',1);
});

io.configure('development',function() {
  io.set('log level',2);
})

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


var client = null;
 
tty.start('/dev/ttyS0',
  // callback s==data object,r= raw sentence
  function(s,r) {
    // send latest data to client
    if (client !== null) {
      client.send(JSON.stringify({data:s,raw:r}));
    }
  }
);

io.sockets.on('connection',function(socket) {
  console.log('connect');
  client = socket;
  
  socket.on('disconnect',function() {
    console.log('disconnect');    
  });
});

