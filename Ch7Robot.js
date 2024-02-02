//This program is a project from elegant javascript that creates a robot that picks up and delivers parcels in a small town. 

let roads = ["Alice's House-Bob's House", "Alice's House-Cabin",
"Alice's House-Post Office", "Bob's House-Town Hall",
"Daria's House-Ernie's House", "Daria's House-Town Hall",
"Ernie's House-Grete's House", "Grete's House-Farm",
"Grete's House-Shop", "Marketplace-Farm",
"Marketplace-Post Office", "Marketplace-Shop",
"Marketplace-Town Hall", "Shop-Town Hall"
];

// Creates our graph object. This gives an object whose keys our nodes on the map and whose values are arrays that list the connected nodes. 
function residenceGraph(roads){
    let splitRoads = [];
    let graph = {};
    for (let road of roads){
        splitRoads.push(road.split('-'));
    };
    for (let pair of splitRoads){
        if (graph[pair[0]]){
            graph[pair[0]].connected.push(pair[1]);
        }else {
            graph[pair[0]] = {};
            graph[pair[0]].connected = [pair[1]];
        };
        if (graph[pair[1]]){
            graph[pair[1]].connected.push(pair[0]);
        }else {
            graph[pair[1]] = {};
            graph[pair[1]].connected = [pair[0]];
        }
    }
    return graph;
}

// These functions are used to generate random parcel distribution. 
function randomBool(){
    if (Math.random()>0.5){
        return true;
    }else {
        return false;
    }
}
function randomDest(graph){
    let names = Object.keys(graph);
    let nameInd = names.indexOf()
    let dest = names[Math.round(Math.random()*(names.length-1))];
    return dest;
}
function randomParcelDist(graph, n=0){
    let res = Object.keys(graph);
    for (let name of res){
        graph[name].parcel = {exists: false};
    };
    for (let name of res){
        graph[name].parcel = {exists: randomBool()};
        if (graph[name].parcel.exists){
            graph[name].parcel.destination = randomDest(graph);
            graph[name].parcel.delivered = false;
        };
        if (n!=0 && allParcel(graph).filter(x => x==false).length == n){
            for (let name of res){
                if (!graph[name].parcel){
                    graph[name].parcel = {exists: false};
                };
            };
            return graph;
        };
    };
    return graph;
}
function allParcel(graph){
    let names = Object.keys(graph);
    let parcels = [];
    for (let name of names){
        parcels.push(graph[name].parcel.delivered);
    }
    return parcels;
}

// Our robot class. This bot picks up, moves, and delivers parcels. 
class Robot {
    constructor(start, graph){
        this.location = start;
        this.graph = JSON.parse(JSON.stringify(graph));
        this.route = {};
        this.parcelCount = 0;
    }
    pickUpParcel(){
        if (this.graph[this.location].parcel.exists){
            this.route[this.location] = this.graph[this.location].parcel.destination;
            this.graph[this.location].parcel.exists = false;
            delete this.graph[this.location].parcel.destination;
            this.parcelCount += 1;
        };
    }
    deliverParcel(){
        for (let from of Object.keys(this.route)){
            if (this.route[from] === this.location){
                this.graph[this.location].parcel[from + ' package'] = `^_^ hello from ${from}`;
                this.graph[from].parcel.delivered = true; 
                delete this.route[from];
                this.parcelCount -= 1;
            };
        };
    }
    move(end){
        if (end === undefined){
            end = this.location;
        };
        if (this.graph[end].connected.some((elem)=> elem === this.location)){
            this.location = end;
            return true;
        }else {
            console.log('There is no road to get there from our current position. Beep-boop');
            return false;
        };
    }
    randomWalk(){
        this.pickUpParcel();
        let parcelBools = allParcel(this.graph);
        for (let i = 0; ; i++){
            let nConnected = this.graph[this.location].connected.length;
            this.move(this.graph[this.location].connected[Math.floor(Math.random()*nConnected)]);
            this.pickUpParcel();
            this.deliverParcel();
            console.log(this.location);
            if (parcelBools.some((elem)=> elem == false)){
                parcelBools = allParcel(this.graph);
            }else {
                return i;
            };
        };
    }
    mailRoute(){
        let count = 0;
        let mRoute = ['Cabin', "Alice's House", 'Post Office', 'Marketplace', 'Farm', "Grete's House", "Ernie's House", "Daria's House", 'Town Hall', 'Shop', 'Town Hall', "Bob's House"];
        let rRoute = [];
        this.location = 'Cabin';
        for (let i = mRoute.length-2; i > -1; i--){
            rRoute.push(mRoute[i]);
        };
        mRoute = mRoute.concat(rRoute);
        for (let node of mRoute){
            this.pickUpParcel();
            this.deliverParcel();
            console.log(this.location);
            this.move(node);
            count++;
        };
        return count;
    }
    graphMetric(start, end){
        let work = [{at: start, route: []}];
        for (let i = 0; i< work.length; i++){
            let {at, route} = work[i];
            for (let place of this.graph[at].connected){
                if (place == end){
                    return route.concat(place);
                };
                if (!work.some((element)=> element.at == place)){
                    work.push({at: place, route: route.concat(place)});
                };
            };
        };
    }
}


// This is the last route finder for the robot. 
function pathFinder(robot, directions, graph){
    let count = 0;
    let visited = [...new Set(directions)];
    for (let i of directions){
        if (visited.length ==0){
            break;
        }
        robot.pickUpParcel();
        robot.deliverParcel();
        if (visited.some((place)=> place== robot.location)){ visited.splice(visited.indexOf(robot.location),1)};
        while (robot.parcelCount > 0){
            let newDirection = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            // this for loop changes course from the original route. it will set the robot's course on one of the shortest paths between the possible paths to a parcel
            for (let address of Object.keys(robot.route)){
                if (newDirection.length >= robot.graphMetric(robot.location, robot.route[address], graph).length ){
                    newDirection = robot.graphMetric(robot.location, robot.route[address], graph);
                };
            };
            for (let point of newDirection){
                if (robot.move(point)){
                    console.log(robot.location, 'first for loop');
                    count++;
                };
                console.log(visited);
                if (visited.some((place)=> place== robot.location)){ visited.splice(visited.indexOf(robot.location),1)};
                let p = robot.parcelCount;
                robot.pickUpParcel();
                robot.deliverParcel();
                if (p != robot.parcelCount){
                    break;
                };
            };

        };
        if (visited.length === 0){
            break;
        }else if (!graph[robot.location].connected.some((el)=> el == i) && count !=0){
            console.log(visited);
            let reroute = robot.graphMetric(robot.location, visited[0], graph);
            console.log(reroute);
            for (let i of reroute){
                if (robot.move(i)){
                    console.log(robot.location, 'reroute loop');
                    robot.pickUpParcel();
                    robot.deliverParcel();
                    count++;
                };
                if (visited.some((place)=> place== robot.location)){ visited.splice(visited.indexOf(robot.location),1)};
            };
            continue;
        };
        if (robot.move(i)){
            console.log(robot.location, 'main while');
            if (visited.some((place)=> place== robot.location)){ visited.splice(visited.indexOf(robot.location),1)};
            robot.pickUpParcel();
            robot.deliverParcel();
            count++;
        };
    };
    while (robot.parcelCount > 0){
        let newDirection = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        // this for loop changes course from the original route. it will set the robot's course on one of the shortest paths between the possible paths to a parcel
        for (let address of Object.keys(robot.route)){
            if (newDirection.length >= robot.graphMetric(robot.location, robot.route[address], graph).length ){
                newDirection = robot.graphMetric(robot.location, robot.route[address], graph);
            };
        };
        for (let point of newDirection){
            if (robot.move(point)){
                console.log(robot.location, 'second while');
                count++;
            };
            if (visited.some((place)=> place== robot.location)){ visited.splice(visited.indexOf(robot.location),1)};
            let p = robot.parcelCount;
            robot.pickUpParcel();
            robot.deliverParcel();
            if (p != robot.parcelCount){
                break;
            };
        };

    };
    let parBool = [];
    for (let i of Object.keys(graph)){
        parBool.push(graph[i].parcel.delivered);
    };
    return count; /*, !parBool.some((el)=> el == false)]*/
}


let mRoute = ['Cabin', "Alice's House", 'Post Office', 'Marketplace', 'Farm', "Grete's House", "Ernie's House", "Daria's House", 'Town Hall', 'Shop', 'Town Hall', "Bob's House"];


// initializing graph and robot
let roadGraph = randomParcelDist(residenceGraph(roads),5);
let mrRobot = new Robot('Cabin', roadGraph); 



console.log(roadGraph);
console.log(mrRobot.location);
let count3 = pathFinder(mrRobot, mRoute, mrRobot.graph);
console.log(mrRobot.graph);
console.log(count3);


module.exports =  {roads, Robot, residenceGraph, randomBool, randomDest, randomParcelDist, pathFinder,allParcel, mRoute};