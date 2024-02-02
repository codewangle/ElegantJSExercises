//This program follows the textbook and creates a programming language out of javascript

function skipSpace(program){
    let match = /^\s+/.exec(program);
    let comment = /^[#][^#]*[#]/.exec(program);
    if (comment){
        program = program.slice(comment[0].length);
        let match2 = /^\s+/.exec(program);
        if (match2){
            return skipSpace(program);
        }else{
            return program;
        }
    }
    if (match){
        program = program.slice(match[0].length);
        let comment2 = /^[#][^#]*[#]/.exec(program);
        if (comment2){
            return skipSpace(program);
        }else{
            return program;
        }
    }else return program;
}

function parseExpression(program){
    program = skipSpace(program);
    let match, expr;
    if (match = /^"([^"]*)"/.exec(program)){
        expr = {type: "value", value: match[1]};
    }else if (match = /^\d+[.]?(\d+)?\b/.exec(program)){
        expr = {type: "value", value: Number(match[0])};
    }else if (match = /^[^\s(),#"]+/.exec(program)) {
        expr = {type: "word", name: match[0]};
    }else {
        throw new SyntaxError("Cringe alert: " + program);
    }
    return parseApply(expr, program.slice(match[0].length))
}

function parseApply(expr, program){
    if (program[0] != "("){
        return {expr: expr, rest: program};
    }

    program = skipSpace(program.slice(1));
    expr = {type: "apply", operator: expr, args: [] };
    while (program[0] != ")"){
        let arg = parseExpression(program);
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);
        if (program[0] == ","){
            program = skipSpace(program.slice(1));
        }else if (program[0] != ")"){
            throw new SyntaxError("Cringe alert: the arguements are comma seperated dumbass" + program);
        }
    }
    return parseApply(expr, program.slice(1));
}

function parse(program){
    let {expr, rest} = parseExpression(program);
    if (skipSpace(rest).length > 0){
        throw new SyntaxError("Cringe alert: text after program");
    }
    return expr;
}

function evaluate(expr, scope){
    if (expr.type == 'value'){
        return expr.value;
    }else if (expr.type == 'word'){
        if (expr.name in scope){
            return scope[expr.name];
        }else {
            throw new ReferenceError( `Undefined binding ${expr.name}`);
        }
    } else if (expr.type == "apply"){
        let {operator, args} = expr;
        if (operator.type == 'word' && operator.name in specialForms){
            return specialForms[operator.name](expr.args, scope);
        }else {
            let op = evaluate(operator, scope);
            if (typeof op == 'function'){
                return op(...args.map(arg => evaluate(arg, scope)));
            }else{
                throw new TypeError("Applying a non-function");
            }
        }
    }
}

const specialForms = Object.create(null);
/*specialForms["+"] = (args, scope) => {
    let sum = [];
    for (let i of args){
        sum.push(evaluate(i, scope)) 
    };
    return sum.reduce((current, el)=> current + el,0);
}*/
specialForms.set = (args, scope) => {
    if (args.length !=2 || args[0].type != "word"){
        throw new SyntaxError("Expecting two arguments and a word binding.");
    }

    scope[args[0].name] = evaluate(args[1], scope);
    return console.log(args[0].name + " : " + evaluate(args[1], scope))
}
specialForms.if = (args,scope)=>{
    if (args.length !=3){
        throw new SyntaxError("Expecting three arguments for comparison.");
    }
    if (evaluate(args[0], scope) != false){
        return evaluate(args[1], scope);
    }else {
        return evaluate(args[2], scope);
    }
}
specialForms.while = (args, scope) => {
    if (args.length != 2){
        throw new SyntaxError("Expected two arguments for while.");
    }
    while (evaluate(args[0], scope) !== false){
        evaluate(args[1], scope);
    }
    return false;
}
specialForms.do = (args, scope)=>{
    let value = false;
    for (let arg of args){
        value = evaluate(arg, scope);
    }
    return value; 
};
const topScope = Object.create(null);
topScope.true = true;
topScope.false = false;

for (let op of ['+', '-', '*', '/', '==', '<', '>']){
    topScope[op] = Function('a, b', `return a ${op} b;`);
}
topScope.post = value => {
    console.log(value);
    return value;
};

function run(program) {
    return evaluate(parse(program), Object.create(topScope));
};

specialForms.fun = (args, scope) => {
    if (!args.length){
        throw new SyntaxError("Function needs a body");
    }
    let body = args[args.length - 1];
    let params = args.slice(0, args.length-1).map(expr =>{
        if (expr.type != 'word'){
            throw new SyntaxError("Parameter names must be words");
        }
        return expr.name;
    });
    return function(){
        if (arguments.length != params.length){
            throw new TypeError("Wrong number of arguments");
        }  
        let lscope = Object.create(scope);
        for (let i=0; i< arguments.length; i++){
            lscope[params[i]] = arguments[i];
        }
        return evaluate(body, lscope);
    };
}

topScope['array'] = (...values)=>{
    let arr = [];
    if (!values.length){
        return arr;
    }
    console.log(values);
    for (let arg of values){
        arr.push(arg);
    }
    return arr;
};

topScope['length'] = (args)=>{
    if (!Array.isArray(args)){
        throw new SyntaxError("Expected an array arguement.");
    };
    let length = 0;
    for (let i of args){
        length += 1;
    };
    return length;
};

topScope['element'] = (array, n)=>{
    return array[n];
};



specialForms.define = (args, scope)=>{
    if (args.length != 2){
        throw new SyntaxError("Expecting two arguments.");
    };
    if (args[0].type != 'word'){
        throw new SyntaxError("Expecting a word binding.");
    };
    let oScope = Object.getPrototypeOf(scope);
    if (!scope[args[0].name]){
        if (!oScope[args[0].name]){
            throw new ReferenceError("This binding does not exist.");
        }else {
            oScope[args[0].name] = evaluate(args[1], scope);
            return evaluate(args[1], scope);
        }
    }else if (scope[args[0].name]){
        scope[args[0].name] = evaluate(args[1], scope);
        return evaluate(args[1], scope);
    }
}

run(`#this is a comment to see if our method worked#do(
    set(arr, array(1, 2, 3)),
    post(length(arr)), #feioj iowej #
    post(element(arr, 1)),
    define(arr, "world"),
    post(arr)
    )`);
