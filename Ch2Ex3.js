//This program creates a chessboard.
let dimX = 13, dimY = 8;
let board = '';
for (i = 0; i <= dimX*dimY; i++){
    if (i%dimX ===0){
        board += '\n';
    };
    if (i%2 ===0){
        board += ' ';
    }else {
        board += '\#';
    };
};
console.log(board);