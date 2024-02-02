//This program creates functions that create lists from arrays and arrays from list.
/* Exercise outline:
Write a function arrayToList that builds up a list structure like the one
shown when given [1, 2, 3] as argument. Also write a listToArray function
that produces an array from a list. Then add a helper function prepend, which
takes an element and a list and creates a new list that adds the element to the
front of the input list, and nth, which takes a list and a number and returns
the element at the given position in the list (with zero referring to the first
element) or undefined when there is no such element.
If you haven’t already, also write a recursive version of nth.
*/

function arrayToList(array){
    let nArray = [...array];
    function returnList(nArray, j = {},l={}){
       if (nArray.length === 0){
            return l;
        }else {
            j.value = nArray[nArray.length-1];
            j.rest = l;
            nArray.pop();
            l = j; 
            return returnList(nArray, {}, l);
        };
        
    };
    return returnList(nArray);

};

function listToArray(list, array = []){
    if (list.value){
        array.push(list.value);
        return listToArray(list.rest, array);
    }else {
        return array;
    };
};

function prepend(element, list){
    let l = {};
    l.value = element;
    l.rest = list;
    list = l;
    return list;
};

function nth(pos, list, count = 0){
    if (count === pos){
        return list.value;
    }else {
        count += 1;
        return nth(pos, list.rest, count);
    }
};

r = [1,2,3,4,5,6,7,8,9,10];
console.log('here is the original array', r);
console.log('here it is as a list', arrayToList(r));

m = arrayToList(r);
console.log('here is that list back as an array using list to array', listToArray(m));

console.log('here is the list prepended with the element 5', prepend(5,m));

console.log('here is the nth position of the list', nth(8,m));