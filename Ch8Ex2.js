//This program attempts to retrieve locked information from an object and returns the object unaltered.
/*Exercise outline:
It is a box with a lock. There is an array in the box, but you can get at it only
when the box is unlocked. Directly accessing the private _content property is
forbidden.
Write a function called withBoxUnlocked that takes a function value as argument, unlocks the box, runs the function, and then ensures that the box
is locked again before returning, regardless of whether the argument function
returned normally or threw an exception.
For extra points, make sure that if you call withBoxUnlocked when the box
is already unlocked, the box stays unlocked.
*/

const box = {
    locked: true,
    unlock() { this.locked = false; },
    lock() { this.locked = true; },
    _content: [],
    get content() {
        if (this.locked) throw new Error("Locked!");
        return this._content;
    }
};

function withBoxUnlocked(test){
    let ID = 0; 
    try {
        if (box.locked){
            box.unlock();
            ID = 1;
            test();
            box.lock();
        } else {
            test();
        };
    } catch(error) {
        if (!box.locked && ID == 1){
            box.lock();
            console.log('Error: what a fucked up day!: ' , error);
        }else {
            console.log('Error: what a fucked up day!: ' , error);
        };
    };
}  

function helloWorld(){
    box._content.push('IS EPIC');
    console.log(`hello world! This ${box.content}`);
}

function brokenWorld(){
    box._content.push('IS EPIC');
    cosole.log('hello world! This ${box.content}');
}

withBoxUnlocked(helloWorld);
console.log(box.locked);
withBoxUnlocked(brokenWorld);
console.log(box.locked);