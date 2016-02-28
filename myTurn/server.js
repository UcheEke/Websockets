var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port : 8181});

console.log("Starting server on port 8181 ...");
console.log("Awaiting connections ...");

var greetings = ["Hello", "Hi", "Greetings", "Aloha", "Wassup"];
var subjects = ["World", "You", "Everybody", "Everyone", "Y'all", "You Guys"];

var generateGreeting = function(){
    var randomChoice = function(list){
        return list[Math.floor(Math.random()*list.length)];
    };
    return randomChoice(greetings) + " " + randomChoice(subjects) + "!";
};

var randomMSDelay = function(min, max){
  return Math.floor(Math.random()*(max - min + 1) + min);
};

wss.on('connection', function(ws){
    console.log('Connection established with client');
    var greetingUpdater;
    var counter = 0;

    var randomGreetingGenerator = function(){
        var greeting = generateGreeting();
        var delay = randomMSDelay(1000,3000);
        greetingUpdater = setTimeout(function(){
            randomGreetingGenerator();
        }, delay);
        console.log(counter++, greeting.toString(), delay);
        if (ws.readyState === 1) {
            ws.send(greeting);
        }
    };

    randomGreetingGenerator();
});