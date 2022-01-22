var isCompletedPrevious = false;

var socket;

function main(){
    localsocket = network.createSocket()
    localsocket.connect(16834, "127.0.0.1", function(){
        park.postMessage({
            text: "Successfully connected to LiveSplit!",
            type: "money",
        })
        socket = localsocket;
    
        start() // this is bad, since the timer will start delayed from the first level loaded
    
        var cheatsN = enabledCheats()
        if(cheatsN > 0){
            park.postMessage({
                text: cheatsN + " cheat" + (cheatsN == 1 ? " is" : "s are") + " enabled!",
                type: "research",
            })
        } else {
            park.postMessage({
                text: "No cheat is enabled!",
                type: "award",
            })
        }
    })

    context.subscribe("interval.tick", function(){
        var isCompleted = scenario.status == "completed"
        if(!isCompletedPrevious && isCompleted) split();
        isCompletedPrevious = isCompleted
    })

    /*
    context.subscribe("game.load_scenario", start)
    context.subscribe("script.unload", stop)
    */
}

function send(command){
    if(socket) socket.write(command + "\r\n")
}

function start(){
    send("starttimer")
}
function split(){
    send("split")
}
function stop(){
    send("reset")
}

function enabledCheats(){
    var cheatsE = []
    for(var cheat in cheats){
        if(cheats[cheat] != false) cheatsE.push(cheat)
    }
    return cheatsE;
}

registerPlugin({
    name: 'AutoSplitter',
    version: '0.1',
    authors: ['SpeckyYT'],
    type: 'local',
    licence: 'MIT',
    targetApiVersion: 34,
    main: main,
});
