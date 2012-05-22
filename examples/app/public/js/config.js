// Set the require.js configuration for your application.
require.config({
  // Initialize the application with the main application file
  deps : [],

  baseUrl : '/js',
  
  paths : {
    // JavaScript folders
    jquery : 'jquery',
    underscore : 'underscore',
    examine : 'examine',
    socketio : '/socket.io/socket.io.js'
  }
});
