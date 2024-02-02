//This program creates a vector class for 2d vectors. 

class Vector2D {
    constructor (x,y){
        this.x = x;
        this.y = y;
    }
    length(){
        let mag = Math.sqrt(this.x**2 + this.y**2);
        return mag;
    }
    dot(a, b){
        return a.x*b.x + a.y*b.y;
    }
    plus(b){
        let c = new Vector2D(this.x + b.x, this.y + b.y );
        return c;
    }
    minus(b){
        let c = new Vector2D(this.x - b.x, this.y - b.y);
        return c;
    }
};

function direction(angle){
    let degree = angle*360/(2*Math.PI);
    if (angle > 0 && angle < Math.PI/4){
        return `${degree} degrees north of east`;
    }else if (angle > Math.PI/4 && angle < Math.PI/2){
        return `${90-degree} degrees east of north`;
    }else if (angle > Math.PI/2 && angle < 3*Math.PI/4){
        return `${degree-90} degrees west of north`;
    }else if (angle > 3*Math.PI/4 && angle < Math.PI){
        return `${180- degree} degrees north of west`;
    }else if (angle > Math.PI && angle < 5*Math.PI/4){
        return `${degree-180} degrees south of west`;
    }else if (angle > 5*Math.PI/4 && angle < 3*Math.PI/2){
        return `${270 - degree} degrees west of south`;
    }else if (angle > 3*Math.PI/2 && angle < 7*Math.PI/4){
        return `${degree - 270} degrees east of south`;
    }else if (angle > 7*Math.PI/4 && angle < 2*Math.PI){
        return `${360- degree} degrees south of east`;
    }else if (angle === 0 || angle === 2*Math.PI){
        return `due east`;
    }else if (angle === Math.PI/4){
        return 'due north-east';
    }else if (angle === Math.PI/2){
        return 'due north';
    }else if (angle === 3*Math.PI/4){
        return 'due north-west';
    }else if (angle === Math.PI){
        return `due west`;
    }else if (angle === 5*Math.PI/4){
        return 'due south-west';
    }else if (angle === 3*Math.PI/2){
        return 'due south';
    }else if (angle === 7*Math.PI/4){
        return 'due south-east';
    };
}

let displacement = new Vector2D(3,4);
let position = new Vector2D(14,3);
let distance = position.minus(displacement);
let ang = Math.atan(distance.y/distance.x);
if (distance.x < 0 && distance.y <0 || (distance.x < 0 && distance.y > 0)){
    ang += Math.PI;
}else if (distance.x*distance.y < 0){
    ang += 2*Math.PI; 
};
console.log(`The distance from the origin is ${displacement.length()}!`);
console.log(`Our friend is at position (${position.x}, ${position.y}) which is ${distance.length()} units away from us!`);
console.log(`We must head ${direction(ang)}!`);