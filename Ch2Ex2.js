//Logs fizz for numbers divisible by 3, buzz for those divisible by 5 but not 3, and fizzbuzz for those divisible by 5 and 3. 
for (i=0; i<=100; i++){
    if (i%3 === 0 && i%5 === 0){
        console.log('FizzBuzz');
    }else if (i%5 === 0){
        console.log('Buzz');
    }else if (i%3 === 0){
        console.log('Fizz');
    }else {
        console.log(i);
    }
};