//This program creates a group class that has persistent data. 
/*Exercise outline:
Write a new class PGroup, similar to the Group class from Chapter 6, which
stores a set of values. Like Group, it has add, delete, and has methods.
Its add method, however, should return a new PGroup instance with the given
member added and leave the old one unchanged. Similarly, delete creates a
new instance without a given member.
The class should work for values of any type, not just strings. It does not
have to be efficient when used with large amounts of values.
The constructor shouldn’t be part of the class’s interface (though you’ll definitely want to use it internally). Instead, there is an empty instance, PGroup.
empty, that can be used as a starting value.
Why do you need only one PGroup.empty value, rather than having a function
that creates a new, empty map every time?
*/

class PGroup {
    constructor(array){
        this.content = array;

    }
    add(element){
        if (this.has(element)) {return this;};
        return new PGroup(this.content.concat(element));
    };
    delete(element){
        if (!this.has(element)){return this;};
        return new PGroup(this.content.filter((el)=> el!=element));
    };
    has(element){
        return this.content.some((el)=>el == element);
    };
    static empty = new PGroup([]);
}

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(a.has('a'));
console.log(b.has('a'));
console.log(b.has('b'));