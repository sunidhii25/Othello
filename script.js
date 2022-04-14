let board = document.getElementById('board');

//making a 2-D array which stores the values/symbols
let map = [];

function createMap() {
    for (let x = 0; x < 8; x++) {
        map[x] = [];
        for (let y = 0; y < 8; y++) {
            addCell(x, y);
        }
    }
}

function addCell(x, y) {
    map[x][y] = 0;
}




//setting up the board
function setupGrid() {
    map[3][4] = 1;    //wb
                      //bw
    map[4][3] = 1;
    map[4][4] = 2;
    map[3][3] = 2;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {

            let a = document.createTextNode(map[i][j]);
            let ele = document.createElement('span');
            ele.append(a);
            ele.classList.add('boxes');
            ele.style.gridRowStart = i + 1;
            ele.style.gridRowEnd = i + 1;
            ele.style.gridColumnStart = j + 1;
            ele.style.gridColumnEnd = j + 1;
            ele.style.margin = "auto";
            ele.style.fontSize = "30px"
            board.appendChild(ele);
        }
    }
}



//making a move and checking if its a wrong move
function makeMove(symbol, x, y) {
    if (x < 0 || y < 0 || x > 7 || y > 7 || map[x][y] != 0)
        return false;

    let xDir = [0, 0, 1, - 1, -1, -1, 1, 1];
    let yDir = [- 1, 1, 0, 0, -1, 1, -1, 1];

    let flag = 0;

    let canMakeMove = false;

    for (let dir = 0; dir < xDir.length; dir++) {
        let r = xDir[dir], c = yDir[dir];
        let i = x + r, j = y + c;
        let otherSymbolCount = 0;
        while (i >= 0 && j >= 0 && i < 8 && j < 8) {
            if (map[i][j] == 0) {
                flag = 1;
                break;
            }
            else if (map[i][j] == symbol) {
                flag = 2;
                break;
            }
            else
                otherSymbolCount++;

            i = i + r;
            j = j + c;
        }

        if (flag == 2 && otherSymbolCount > 0) {
            makeChange(symbol, x, y, r, c);
            canMakeMove = true;
        }

    }
    return canMakeMove;
}

function makeChange(symbol, x, y, r, c) {  //original coodinates   //jis direction mei hume change krna h
    let i = x + r;
    let j = y + c;
    while (i >= 0 && j >= 0 && i < 8 && j < 8 && map[i][j] != symbol) {
        if (map[i][j] == 0)
            break;

        map[i][j] = symbol;
        i = i + r;
        j = j + c;
    }


    map[x][y] = symbol;
}



//updating each cell
function updateBoxes() {
    let k = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {

                if (map[i][j] == 1) {
                    boxes[k].innerHTML = '<div id="blackCircle"></div>';
                }
                else if (map[i][j] == 2) {
                    boxes[k].innerHTML = '<div id="whiteCircle"></div>'
                }
                else {
                    boxes[k].innerHTML = '<div id="emptyBox"></div>';
            }
            k++;

        }
    }
}



//Count the number of whites and blacks and determine the winner
function calculateWinner() {
    let symbol1 = 0;
    let symbol2 = 0;

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map.length; j++) {
            if (map[i][j] == 1) {
                symbol1++;
            }
            else if (map[i][j] == 2) {
                symbol2++;
            }
        }
    }
    if (symbol1 > symbol2) {
        return 1;
    }
    else if (symbol2 > symbol1) {
        return 2;
    }
    else
        return -1;
}



// resetting the whole grid
function resetGrid() {

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            map[i][j] = 0;
        }
    }
    map[3][4] = 1;
    map[4][3] = 1;
    map[4][4] = 2;
    map[3][3] = 2;
    turn=1;
    turnOrWinner.innerHTML = "Black's turn";
    updateBoxes();
}


// checking if a player can move
function canMoveThere(symbol, x, y) {
    let xDir = [0, 0, 1, - 1, -1, -1, 1, 1];  //8 dirs
    let yDir = [- 1, 1, 0, 0, -1, 1, -1, 1];

    let flag = 0;  

    let canMakeMove = false;

    for (let dir = 0; dir < xDir.length; dir++) {
        let r = xDir[dir], c = yDir[dir];
        let i = x + r, j = y + c;
        let otherSymbolCount = 0;
        while (i >= 0 && j >= 0 && i < 8 && j < 8) {
            if (map[i][j] == 0) {
                flag = 1;
                break;
            }
            else if (map[i][j] == symbol) {
                flag = 2;
                break;
            }
            else
                otherSymbolCount++;

            i = i + r;
            j = j + c;
        }

        if (flag == 2 && otherSymbolCount > 0) {
            return true;
        }

    }
    return false;
}

//black turn but still it cant move 
//puri grid pr khi move possible h ya nhi
function canPlayerMove(symbol) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (map[i][j] == 0) {
                let ans = canMoveThere(symbol, i, j)
                if (ans == true) {
                    return true;
                }
            }
        }
    }
    return false;
}





// main game

var firstPlayerSymbol = 1;   //black
var secondPlayerSymbol = 2;  //white
var turn = 1; 
var boxes = document.getElementsByClassName('boxes');
let endCount = 0;
let flag = false;

createMap();
setupGrid();  //<span> 0 ,1 , 2</span>
updateBoxes();    //cirles  //black-1


let turnOrWinner = document.getElementById('result');
turnOrWinner.innerHTML = "Black" + "'s turn";

for (let i = 0; i < boxes.length; i++) {

    boxes[i].addEventListener('click', function () {

        let row = Math.floor((i) / 8);
        let col = Math.floor((i) % 8);
        let canMakeMove = makeMove(turn, row, col);
        if (canMakeMove == false) {
            alert("Cant Move There\n Try Again");
            turn = turn == 1 ? 2 : 1;
        }


        let canPlayer1Move = canPlayerMove(firstPlayerSymbol);
        let canPlayer2Move = canPlayerMove(secondPlayerSymbol);

        if (canPlayer1Move == false && canPlayer2Move == false) {
            let winnerSymbol = calculateWinner();

            if (winnerSymbol == 1)
                alert("No Moves Left\n The Winner is... \n Black!!");
            else if (winnerSymbol == 2)
                alert("No Moves Left\n The Winner is... \n White!!");
            else if (winnerSymbol == 3)
                alert("No Moves Left\n Its a Draw");

            turn = 1;
            flag = true;  //game has ended

            resetGrid();
        }



        if (flag == true) {
            flag = false;
            turn = 1;
        }
        else {
            turn = turn == 1 ? 2 : 1;
            if (turn == 1) {

                if (canPlayer1Move == false) {
                    alert("No Moves Left For Black... \n Transferring to White");
                    turn = 2;
                }
                else {
                    turnOrWinner.innerHTML = "Black's turn";
                }
            }
            else {
                if (canPlayer2Move == false) {
                    alert("No Moves Left For White... \n Transferring to Black");
                    turn = 1;
                }
                else {
                    turnOrWinner.innerHTML = "White's turn";
                }

            }
        }


        updateBoxes();
    })
}













