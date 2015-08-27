var mosca = require('mosca');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongourl = 'mongodb://localhost:27000/mqtt';

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
	bundle: true  
	}
};


var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);     


});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.payload.toString());
  console.log('Published topic: ', packet.topic);

  if(packet.topic.indexOf('$SYS') < 0){
    MongoClient.connect(mongourl, function(err,db){
	if(err){
		console.log('Unable to connect to the MongoDB instance');
	}
	else
	{
		console.log('Connection established to ',mongourl);

		var collection = db.collection('sensorData');

		var datapoint = {topic: packet.topic, payload: packet.payload.toString(), date: new Date() };
		collection.insert(datapoint, function(err,result){
			if(err){
				console.log(err);
			} else {
				console.log('Inserted document with topic %s with id :',packet.topic, result);
			}
  		});
	//	db.close();	
	}
    });
  }



});

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running')


}





