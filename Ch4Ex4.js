//This program creates an operator that compares objects by their properties. 
/*Exercise outline:
Write a function deepEqual that takes two values and returns true only if they
are the same value or are objects with the same properties, where the values
of the properties are equal when compared with a recursive call to deepEqual.
To find out whether values should be compared directly (use the === operator
for that) or have their properties compared, you can use the typeof operator.
If it produces "object" for both values, you should do a deep comparison.
But you have to take one silly exception into account: because of a historical
accident, typeof null also produces "object".
The Object.keys function will be useful when you need to go over the properties of objects to compare them.
*/

function deepEqual(a, b){
    if (typeof a === 'object' && typeof b === 'object' && (a != null && b != null)){
        if (Object.keys(a).length === Object.keys(b).length){
            for (let i of Object.keys(a)){
                if (!Object.keys(b).includes(i)){
                    return false;
                }else {
                    if (typeof a[i] === 'object' && typeof b[i]=== 'object' && (a[i] != null && b[i] != null)){
                        return deepEqual(a[i], b[i]);
                    }else if (a[i] != b[i]){
                        return false;
                    };
                };
            };
            return true;

        }else {
            return false;
        }
    }else {
        return a == b; 
    }
}
console.log(deepEqual(1, '1'));
console.log(deepEqual({value: {nvalue: 0, nvalue2: 3}, value2:   2, value4: 5, value3: 0}, {value: {nvalue:0, nvalue2: 3}, value2: 2, value3: 0, value4: 5}));