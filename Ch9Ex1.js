//This exercise is a practice in regular expressions.
/*Exercise outline:
For each of the following items, write a regular expression to test whether any
of the given substrings occur in a string. The regular expression should match
only strings containing one of the substrings described. Do not worry about
word boundaries unless explicitly mentioned. When your expression works, see
whether you can make it any smaller.
1. car and cat
2. pop and prop
3. ferret, ferry, and ferrari
4. Any word ending in ious
5. A whitespace character followed by a period, comma, colon, or semicolon
6. A word longer than six letters
7. A word without the letter e (or E)
*/

let cart = /car?t?/;
let popprop = /pr?op/;
let ferr = /ferr[eya]t?r?i?/;
let ious = /\b\w*ious\b/
let five = /\s[.,;]/;
let lsix = /\b\w{7,}\b/;
let noe = /\b[^eE]+\b/;

console.log(noe.test('dllllaaaEar ,'));