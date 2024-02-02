//This program creats a minimum function
function newMin(a,b){
    if (a<b){
        return a;
    }else if (a>b){
        return b;
    }else if (a === b){
        return a || b;
    }
};
console.log(newMin(2,3), newMin(2,2));