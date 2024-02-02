//This program computes the dominant writing direction in a string.
/*Exercise outline:
Write a function that computes the dominant writing direction in a string of
text. Remember that each script object has a direction property that can be
"ltr" (left to right), "rtl" (right to left), or "ttb" (top to bottom).
The dominant direction is the direction of a majority of the characters that
have a script associated with them. The characterScript and countBy functions defined earlier in the chapter are probably useful here.
*/

const SCRIPTS = require('./scripts.js');

require('./scripts.js');

function characterCode(string){
    let codes = [];
    for (let char of string){
        codes.push(char.codePointAt(0));
    }
    return codes;
}

function characterScript(code){
    for (let scripts of SCRIPTS){
        if (scripts.ranges.some(([from, to])=>{
            return code >= from && code < to;
        })){
            return scripts;
        };
    };
    return null;
}

function countBy(codeArray) {
    let tally = {};
    for (let code of codeArray){
         if (characterScript(code) != null && tally[characterScript(code).direction]){
             tally[characterScript(code).direction] += 1;
         }else if (characterScript(code) != null){
             tally[characterScript(code).direction] = 1;
         }; 
    };
    return tally;
}

let st = '英国的狗说"woof", 俄罗斯的狗说"тяв"اَلْعَرَبِيَّةُ ۳Ӌѫ،هۤеٕ҂ݒƩۜÐߔה̠ ӝ ٧ Й ֶ Ԁ ٲ ٤ Ҕ ւ צ ؖ Ӌ ӳ ϡ ϕ ѱ ح т А ؀ է آ ҵ қ Ө ӭ ֕ ّ Ԧ ր ԕ ӧ ٠ ؽ ң ς ל ֍ է Ӊ ؁ ӗ ג й я ؊ З Ҙ Ԙ ١ ֓ ؼ Ͻ ׽ ѫ Ւ أ ׏ թ ׿ ׀ Ѣ ح ٻ ֜ ٲ Ѳ Ћ н ׿ Ӝ Հ Ԅ ұ Ӻ ׮ Ѷ Ү Ѻ П Ц ٶ Ә ז ؜ ٵ ў ׇ ѱ ԫ ٷ ҝ ӯ ׿ ֮ ٷ ѻ ӝ ץ Ҭ ֋ ٭ ٙ Ы Ґ ϫ ٨ ق ز ϗ Ӕ ӆ מ Զ ѽ ׶ Ԍ ׏ ѡ Ϝ Ђ Ϛ ص ׈ ع ٦ ٹ Ӈ χ մ ӄ ќ Р ը ՟ ֥ ѿ ־ ؈ ҷ آ Զ ӵ ־ ֭ Х Ю ڀ п ֱ ֨ Ӝ ֥ С ӹ װ ڀ Ҝ ؐ ա Ֆ ֽ ϭ ؈ ԇ Ӕ Ջ ٯ ә ֏ н ؀ я ؉ م Ϸ Ը ғ ϕ ե ӑ إ ؾ Ҷ ѿ Ϩ ٲ Ϟ ت Ͽ ϥ Ӕ ը ٹ ў Ѷ ԋ Ԕ з Ѭ ';

let count = 0;
let major;
let tally = countBy(characterCode(st));
for (let key of Object.keys(tally)){
    if (tally[key]> count){
        count = tally[key];
        major = key;
    };
};

console.log(tally, major);