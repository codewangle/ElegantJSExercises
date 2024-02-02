//This program writes an asynchronous function that locates the position of an object that is passed around in a node. 
/*Exercise outline:
The village crows own an old scalpel that they occasionally use on special
missions—say, to cut through screen doors or packaging. To be able to quickly
track it down, every time the scalpel is moved to another nest, an entry is
added to the storage of both the nest that had it and the nest that took it,
under the name "scalpel", with its new location as the value.
This means that finding the scalpel is a matter of following the breadcrumb
trail of storage entries, until you find a nest where that points at the nest itself.
Write an async function locateScalpel that does this, starting at the nest
on which it runs. You can use the anyStorage function defined earlier to access
storage in arbitrary nests. The scalpel has been going around long enough that
you may assume that every nest has a "scalpel" entry in its data storage.
Next, write the same function again without using async and await.
Do request failures properly show up as rejections of the returned promise
in both versions? How?
*/

var bigOak = require("./crow-tech").bigOak;
var defineRequestType = require("./crow-tech").defineRequestType;
let net = require("./crow-tech").nt;
let stor = require("./crow-tech").st;

var Timeout = class Timeout extends Error {}

function storage(nest, name) {
    return new Promise(resolve => {
      nest.readStorage(name, result => resolve(result));
    });
}

function requestType(name, handler) {
    defineRequestType(name, (nest, content, source,
                             callback) => {
      try {
        Promise.resolve(handler(nest, content, source))
          .then(response => callback(null, response),
                failure => callback(failure));
      } catch (exception) {
        callback(exception);
      }
    });
}

function request(nest, target, type, content) {
    return new Promise((resolve, reject) => {
      let done = false;
      function attempt(n) {
        nest.send(target, type, content, (failed, value) => {
          done = true;
          if (failed) reject(failed);
          else resolve(value);
        });
        setTimeout(() => {
          if (done) return;
          else if (n < 3) attempt(n + 1);
          else reject(new Timeout("Timed out"));
        }, 250);
      }
      attempt(1);
    });
}

function findRoute(from, to, connections) {
    let work = [{at: from, via: null}];
    for (let i = 0; i < work.length; i++) {
      let {at, via} = work[i];
      for (let next of connections.get(at) || []) {
        if (next == to) return via;
        if (!work.some(w => w.at == next)) {
          work.push({at: next, via: via || next});
        }
      }
    }
    return null;
}

function routeRequest(nest, target, type, content) {
    if (nest.neighbors.includes(target)) {
        return request(nest, target, type, content);
    } else {
        let via = findRoute(nest.name, target, nest.state.connections);
        if (!via) throw new Error(`No route to ${target}`);
        return request(nest, via, "route", {target, type, content});
    };
};

requestType("route", (nest, {target, type, content}) => {
    return routeRequest(nest, target, type, content);
});

requestType("storage", (nest, name) => storage(nest, name));

  

function anyStorage(nest, source, name) {
    if (source == nest.name) return storage(nest, name);
    else return routeRequest(nest, source, "storage", name);
};

const $storage = Symbol("storage"), $network = Symbol("network")

function ser(value) {
  return value == null ? null : JSON.parse(JSON.stringify(value))
}

const connections = [
    "Church Tower-Sportsgrounds", "Church Tower-Big Maple", "Big Maple-Sportsgrounds",
    "Big Maple-Woods", "Big Maple-Fabienne's Garden", "Fabienne's Garden-Woods",
    "Fabienne's Garden-Cow Pasture", "Cow Pasture-Big Oak", "Big Oak-Butcher Shop",
    "Butcher Shop-Tall Poplar", "Tall Poplar-Sportsgrounds", "Tall Poplar-Chateau",
    "Chateau-Great Pine", "Great Pine-Jacques' Farm", "Jacques' Farm-Hawthorn",
    "Great Pine-Hawthorn", "Hawthorn-Gilles' Garden", "Great Pine-Gilles' Garden",
    "Gilles' Garden-Big Oak", "Gilles' Garden-Butcher Shop", "Chateau-Butcher Shop"
  ]

function storageFor(name) {
    let storage = Object.create(null)
    storage["food caches"] = ["cache in the oak", "cache in the meadow", "cache under the hedge"]
    storage["cache in the oak"] = "A hollow above the third big branch from the bottom. Several pieces of bread and a pile of acorns."
    storage["cache in the meadow"] = "Buried below the patch of nettles (south side). A dead snake."
    storage["cache under the hedge"] = "Middle of the hedge at Gilles' garden. Marked with a forked twig. Two bottles of beer."
    storage["enemies"] = ["Farmer Jacques' dog", "The butcher", "That one-legged jackdaw", "The boy with the airgun"]
    if (name == "Church Tower" || name == "Hawthorn" || name == "Chateau")
      storage["events on 2017-12-21"] = "Deep snow. Butcher's garbage can fell over. We chased off the ravens from Saint-Vulbas."
    let hash = 0
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i)
    for (let y = 1985; y <= 2018; y++) {
      storage[`chicks in ${y}`] = hash % 6
      hash = Math.abs((hash << 2) ^ (hash + y))
    }
    if (name == "Big Oak") storage.scalpel = "Gilles' Garden"
    else if (name == "Gilles' Garden") storage.scalpel = "Woods"
    else if (name == "Woods") storage.scalpel = "Chateau"
    else if (name == "Chateau" || name == "Butcher Shop") storage.scalpel = "Butcher Shop"
    else storage.scalpel = "Big Oak"
    for (let prop of Object.keys(storage)) storage[prop] = JSON.stringify(storage[prop])
    return storage
}

class Network {
    constructor(connections, storageFor) {
      let reachable = Object.create(null)
      for (let [from, to] of connections.map(conn => conn.split("-"))) {
        ;(reachable[from] || (reachable[from] = [])).push(to)
        ;(reachable[to] || (reachable[to] = [])).push(from)
      }
      this.nodes = Object.create(null)
      for (let name of Object.keys(reachable))
        this.nodes[name] = new Node(name, reachable[name], this, storageFor(name))
      this.types = Object.create(null)
    }

    defineRequestType(name, handler) {
      this.types[name] = handler
    }

    everywhere(f) {
      for (let node of Object.values(this.nodes)) f(node)
    }
}

class Node {
  constructor(name, neighbors, network, storage) {
    this.name = name
    this.neighbors = neighbors
    this[$network] = network
    this.state = Object.create(null)
    this[$storage] = storage
  }

  send(to, type, message, callback) {
    let toNode = this[$network].nodes[to]
    if (!toNode || !this.neighbors.includes(to))
      return callback(new Error(`${to} is not reachable from ${this.name}`))
    let handler = this[$network].types[type]
    if (!handler)
      return callback(new Error("Unknown request type " + type))
    if (Math.random() > 0.03) setTimeout(() => {
      try {
        handler(toNode, ser(message), this.name, (error, response) => {
          setTimeout(() => callback(error, ser(response)), 10)
        })
      } catch(e) {
        callback(e)
      }
    }, 10 + Math.floor(Math.random() * 10))
  }

  readStorage(name, callback) {
    let value = this[$storage][name]
    setTimeout(() => callback(value && JSON.parse(value)), 20)
  }

  writeStorage(name, value, callback) {
    setTimeout(() => {
      this[$storage][name] = JSON.stringify(value)
      callback()
    }, 20)
  }
}
let loc
let network = new Network(connections, storageFor);
async function locateScalpel(start){
    while (true){
        let current = await storage(network.nodes[start], "scalpel");
        if (start == current){ 
            return current;
        }else {
            start = current;
        };
    };
};

function locateScalpel2(start){
    function next(start){
        let current = storage(network.nodes[start], "scalpel");
        return current.then(result=>{
            if (start == result){
                return result;
            }else {
                start = result;
                return next(start);
            };
        }).catch((reason)=>{
            reject(new Error("Error: CAW! " + reason));
        });
    };
    return next(start);
};

loc =  locateScalpel("Big Oak");
loc.then(result => console.log(result), reject => console.log(reject));
let loc2 = locateScalpel2("Big Oak");
loc2.then(result => console.log(result), reason=> console.log(reason));