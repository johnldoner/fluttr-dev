console.log("Hello from IronWorker!");

var ironWorker = require('iron_worker');
 
var client = new ironWorker.Client();
 
client.tasksCreate('hello', {foo: 'bar'}, {}, function(error, body) {
  console.log(body);
});