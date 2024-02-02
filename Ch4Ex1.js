//This exercise sums numbers in a range. 
function newRange (start,end,step = 1){
    let r = [];
    if (step >0){
        while (start <= end){
            r.push(start);
            start = start + step;
        };
    }else if (step < 0){
        while (start >= end){
            r.push(start);
            start = start + step;
        }
    }
    return r;
};

function newSum(numbers){
    let sum = 0;
    for (let i of numbers){
        sum += i;
    };
    return sum;
};
console.log(newRange(5,2,-1));
console.log(newSum(newRange(13,31)));