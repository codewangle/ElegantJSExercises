//This program replaces all single quotes with double quotes but keeps single quotes for contractions. 
/*Exercise outline:
Imagine you have written a story and used single quotation marks throughout
to mark pieces of dialogue. Now you want to replace all the dialogue quotes
with double quotes, while keeping the single quotes used in contractions like
aren’t.
Think of a pattern that distinguishes these two kinds of quote usage and
craft a call to the replace method that does the proper replacement.
*/

let single = /(^|[\s\n])(')(.*?)(')([.\s\n,]|$)/g;

let quote = "'I'm the cook,' he said, 'it's my job.'"; 
let quote2 = quote.replace(single, '$1"$3"$5' ); 
console.log(quote2);