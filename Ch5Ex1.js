//This program uses the reduce method to flatten an array of array. 'Honey it's time for your array flattening....'
/*Exercise outline:
Use the reduce method in combination with the concat method to “flatten”
an array of arrays into a single array that has all the elements of the original
arrays.
*/

function arrayFlattening(array){
    return array.reduce((a,b)=> {
        return a.concat(b);
    });
}

let arrayOfArrays = [[1,2,3],['un','deux','trois'],[{value : 1, rest: null}],[]]; 
console.log(arrayFlattening(arrayOfArrays));