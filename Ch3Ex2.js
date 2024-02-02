// This function is an exercise in recursion.
function newIsEven(n){
    if (n===0){
        return true;
    }else if (n ===1){
        return false;
    }else if (n< 0){
        return null;
    };
    return newIsEven(n-2);
};

console.log(newIsEven(50), newIsEven(73), newIsEven(-1));