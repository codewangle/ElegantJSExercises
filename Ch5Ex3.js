//This program creates an every method that takes an array and predicate function as parameters.
/*Exercise outline:
Implement every as a function that takes an array and a predicate function
as parameters. Write two versions, one using a loop and one using the some
method.
*/

function newEvery(array, funct){
    let current = true;
    for (let element of array){
        if (current && funct(element)){
            current = true;
        }else {
            return false;
        }
    };
    return true;
}

function someEvery(array, funct){
    if (!(array.some((el)=>{
        a = funct(el);
        return !a;
    }))){
        return true;
    }else {
        return false;
    };
}

let test = [11, 14, 101,17 ,25];
console.log(someEvery(test, (a)=> a%2 == 1));
console.log(newEvery(test, (a)=> a%2 == 1));

