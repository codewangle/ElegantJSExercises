//This program reverses an array. 
/* Exercise outline:
Arrays have a reverse method that changes the array by inverting the order in
which its elements appear. For this exercise, write two functions, reverseArray
and reverseArrayInPlace. The first, reverseArray, takes an array as argument
and produces a new array that has the same elements in the inverse order. The
second, reverseArrayInPlace, does what the reverse method does: it modifies
the array given as argument by reversing its elements. Neither may use the
standard reverse method.
Thinking back to the notes about side effects and pure functions in the
previous chapter, which variant do you expect to be useful in more situations?
Which one runs faster?
*/

function reverseArray(array){
    newArray = [];
    for (let i of array){
        newArray.unshift(i);
    }
    return newArray;
};

function reverseArrayInPlace(array){
    newArray = [];
    for (let i = 0; i<= Math.ceil(array.length/2-1); i++){
        if (i === array.length-i-1){
            break;
        }
        let holder = array[i];
        array[i] = array[array.length-1-i];
        array[array.length-1-i] = holder;
    }
};

let r = [1,2,3,4,5,6,7,8,124,231,251,12,3];
console.log(reverseArray(r));
console.log(r);
reverseArrayInPlace(r);
console.log(r);