//This exercise counts beans.
function countBs(bean, char){
    let count = 0;
    for (i =0; i < bean.length; i++){
        if (bean[i] === String(char)){
            count += 1;
        }
    }
    return count;
};

console.log(countBs('bbiofejifjbbBfeiojab', 'b'),countBs('BBB', 'B'));
