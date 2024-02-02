//This program continues calling a function that fails 80% of the time until it succeeds. 
/*Exercise outline:
Say you have a function primitiveMultiply that in 20 percent of cases multiplies two numbers and in the other 80 percent of cases raises an exception
of type MultiplicatorUnitFailure. Write a function that wraps this clunky
function and just keeps trying until a call succeeds, after which it returns the
result.
Make sure you handle only the exceptions you are trying to handle.
*/

class MultiplyError extends Error{};

function primitiveMultiply(a,b){
    if (Math.random() > .2){
        throw new MultiplyError('Multiply failed... math hard. :C'); 
    }
    return a*b; 
}
while (true){
    try {
        console.log(primitiveMultiply(2,5));
        break;
    } catch (error){
        if (error instanceof MultiplyError){
            console.log(error);
            continue;
        }else {
            throw error; 
        };
    }
};