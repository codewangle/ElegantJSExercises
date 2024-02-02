//This program creates a group class.
/*Exercise outline:
Write a class called Group (since Set is already taken). Like Set, it has add,
delete, and has methods. Its constructor creates an empty group, add adds
a value to the group (but only if it isn’t already a member), delete removes
its argument from the group (if it was a member), and has returns a Boolean
value indicating whether its argument is a member of the group.
Use the === operator, or something equivalent such as indexOf, to determine
whether two values are the same.
Give the class a static from method that takes an iterable object as argument
and creates a group that contains all the values produced by iterating over it
*/

class Group {
    constructor(array = []){
        this.content = [];
        for (let element of array){
            if (this.content.indexOf(element) === -1){
                this.content.push(element);
            }
        }
    }
    has(element) {
        if (this.content.indexOf(element)=== -1){
            return false;
        }else {
            return true;
        };
    }
    add(element) {
        if (this.has(element)){
            console.log(`This group already has ${element}.`);
        }else {
            this.content.push(element);
        };
    }
    delete(element) {
        if (this.has(element)){
            this.content.splice(this.content.indexOf(element), 1);
        }else {
            console.log(`${element} is not in the group.`);
        };
    }
    static from(iter){
        let group = new Group();
        for (let element of iter){
            group.add(element);
        };
    }

}

let G = new Group([1,3,4,3,3,4,5]);
console.log(G)
G.add(3);
console.log(G.has(1));
console.log(G.has(2));
G.add(7);
G.delete(1);
console.log(G);