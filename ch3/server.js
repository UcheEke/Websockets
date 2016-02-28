var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port : 8181});


var uuid = require('node-uuid');
var clients = [];

console.log("Websocket Server running on port 8181");
console.log("Awaiting client connections ...")

wss.on('connection', function(ws){
    console.log('client connected');
    var client_uuid = uuid.v4();
    clients.push({"id": client_uuid, "ws": ws});
    console.log('client [%s] connected', client_uuid);

    ws.on('message', function(message){
        for (var i=0; i < clients.length; i++) {
            var clientSocket = clients[i].ws;
            if (clientSocket.readyState === 1){
                console.log('client [%s]: %s', clients[i].id, message);
                clientSocket.send(JSON.stringify({
                    "id" : client_uuid,
                    "message" : message
                }));
            }
        }
    });

    ws.on('close', function(){
        for (var i=0; i < clients.length; i++){
            if (clients[i].id == client_uuid){
                console.log('Client [%s] disconnected', client_uuid);
                clients.splice(i,1)
            }
        }
    })
});