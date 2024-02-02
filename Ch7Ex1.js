//This is an exercise that compares the efficieny of robot methods
/*Exercise outline:
Write a function compareRobots that takes two robots (and their starting
memory). It should generate 100 tasks and let each of the robots solve each
of these tasks. When done, it should output the average number of steps each
robot took per task.
For the sake of fairness, make sure you give each task to both robots, rather
than generating different tasks per robot.
*/

const rob = require('./Ch7Robot.js');


global.pathFinder = rob.pathFinder;
console.log(global);

function compareRobots(method1, method2){
    let perf1 = [], perf2 = [];
    for (let i=0; i<100; i++){
        let roadGraph = rob.randomParcelDist(rob.residenceGraph(rob.roads),5);
        let robot1 = new rob.Robot('Cabin', roadGraph);
        let robot2 = new rob.Robot('Cabin', roadGraph);
        if (method1 == 'pathFinder' || method2 == 'pathFinder'){
            if (method1 == 'pathFinder'){
                let m1 = global['pathFinder'];
                perf1.push(m1(robot1, rob.mRoute, roadGraph));
                perf2.push(robot2[method2]());
                continue;
            }else {
                let m2 = global[method2];
                perf1.push(m2(robot2, roadGraph));
                perf2.push(robot1[method1]());
                continue;
            };

        };
        perf1.push(robot1[method1]());
        perf2.push(robot2[method2]());
    };
    return [perf1.reduce((a,b)=> a+b)/perf1.length, perf2.reduce((a,b)=>a +b)/perf2.length];   
}

let [perf1, perf2] = compareRobots('pathFinder', 'mailRoute');
console.log(perf1, perf2);