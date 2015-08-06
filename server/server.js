var mosca = require('mosca')

var pubsubsettings = {
  type: 'mongo',        
  url: 'mongodb://localhost:27000/mqtt',
  pubsubCollection: 'mqttCollection',
  mongo: {}
};

var moscaSettings = {
  port: 1883,
  backend: pubsubsettings,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://localhost:27000/mqtt'
  },
  http: {
	port:3000,
	bundle: true  }
};

var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);     
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.payload);
  console.log('Published topic: ', packet.topic);
});

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running')
}
