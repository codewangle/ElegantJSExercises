//This program writes an expression that matches only javascript-style numbers.
/*Exercise outline:
Write an expression that matches only JavaScript-style numbers. It must support an optional minus or plus sign in front of the number, the decimal dot,
and exponent notation—5e-3 or 1E10—again with an optional sign in front of
the exponent. Also note that it is not necessary for there to be digits in front
of or after the dot, but the number cannot be a dot alone. That is, .5 and 5.
are valid JavaScript numbers, but a lone dot isn’t.
*/

let numberCheck = /(\+?|\-?)(\d+|\.?\d+)(\.)?(\d+)?(e|E)?\-?(\d+)?/g;

let n = "efaojd oeijfi jeoiaw fije iojeo ij -231 oijfo 3 2 iofj e-3.42 feioei 5.3e10,-2E-15, .5, 5.";
let match = n.match(numberCheck);
console.log(match);