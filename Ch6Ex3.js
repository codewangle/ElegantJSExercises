//This program makes our group class from the previous exercise iterable. 
/*Exercise outline:
Make the Group class from the previous exercise iterable. Refer to the section
about the iterator interface earlier in the chapter if you aren’t clear on the
exact form of the interface anymore.
If you used an array to represent the group’s members, don’t just return the
iterator created by calling the Symbol.iterator method on the array. That
would work, but it defeats the purpose of this exercise.
It is okay if your iterator behaves strangely when the group is modified during
iteration.
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


class GroupIterator {
    constructor(group){
        this.pos = 0;
        this.group = group;
    }

    next() {
        if (this.pos === this.group.content.length) return {done: true};

        let value = {point: this.pos, value: this.group.content[this.pos]};
        this.pos++;
        return { value, done: false};
    }
}

Group.prototype[Symbol.iterator] = function(){
    return new GroupIterator(this);
};

let group = new Group(['hello', 'to', 'the', 'world']);
for (let el of group){
    console.log(el.point, el.value);
};