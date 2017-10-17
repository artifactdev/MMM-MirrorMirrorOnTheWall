'use strict';
const awsIot = require('aws-iot-device-sdk');

var app = {};
app.TOPIC_MODULE = 'MagicMirror:change-module';

// Setup our AWS IoT device and receive messages
app.setup = function() {
  app.device = awsIot.device({
    keyPath: __dirname + '/certs/MagicMirror.private.key',
    certPath: __dirname + '/certs/MagicMirror.cert.pem',
    caPath: __dirname + '/certs/root-CA.crt',
    clientId: 'MagicMirror' + (new Date().getTime()),
    region: 'us-east-1',
  });

  /**
   * AWS IoT - Connecting MagicMirror as a device to our AWS IoT topics
   */
  console.log('Attempt to connect to AWS ');
  app.device.on('connect', function() {
    console.log('Connected to AWS IoT');

    app.device.subscribe(app.TOPIC_MODULE);
    console.log('Subscribed: ' + app.TOPIC_MODULE);

  });

  // Listeners
  app.device.on('message', function(topic, payload) {
    var JSONpayload = JSON.parse(payload.toString());

    // If successfull, let's let our application know
    for (var i = 0; i < app.callbacks.length; i++) {
      app.callbacks[i](topic, JSONpayload);
    }
});
};

// Callbacks that will be invoked when a message is received
app.callbacks = [];

app.onMessage = function(callback) {
  app.callbacks.push(callback);
};

module.exports = app;
