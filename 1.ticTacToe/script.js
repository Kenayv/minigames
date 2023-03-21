"use scrict";

//When player wins, this boolean is changed to false, disabling player interaction
let gameRunning = true;

//game always starts with the circle.
let turn = "O";

//initializing array needed for game logic with empty strings
const cells = new Array(9);
for (let i = 0; i < cells.length; i++) cells[i] = "";

const cellNames = [
    "#cellOne",
    "#cellTwo",
    "#cellThree",
    "#cellFour",
    "#cellFive",
    "#cellSix",
    "#cellSeven",
    "#cellEight",
    "#cellNine"
];

//Listen, if TicTacToe cells are being clicked
for (let cellName of cellNames) {
    document.querySelector(cellName).addEventListener("click", () => {
        handleClick(cellName);
    });
}

//Listen, if reset button is being clicked
document.querySelector(".btn").addEventListener("click", () => {
    resetGame();
});

//  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

const resetGame = function () {
    gameRunning = false;
    //resetting the message below the game
    document.querySelector(".winMessage").textContent = "";
    //resetting the turn to default value
    turn = "O";
    document.querySelector(".turn").textContent = "O";
    document.querySelector(".turn").style.color = "aqua";

    //resetting tiles and emptying the cells
    for (let i = 0; i < cells.length; i++) {
        cells[i] = "";
        document.querySelector(cellNames[i]).textContent = ".";
        document.querySelector(cellNames[i]).style.color = "#222";
    }
    gameRunning = true;
};

const victory = (str) => {
    gameRunning = false;
    if (str == "draw") {
        document.querySelector(".winMessage").style.color = "#f8f5fa";
        document.querySelector(".winMessage").textContent = `Draw!`;
        return;
    }
    document.querySelector(".winMessage").textContent = `${str} Won!`;
    if (str == "O") document.querySelector(".winMessage").style.color = "aqua";
    else document.querySelector(".winMessage").style.color = "red";
};

const checkForWin = function (player) {
    /*check if anyone has won:
        - Is there any vertical line of 3 'O's or 'X's
        - Is there any horizontal line of 3 'O's or 'X's
        - Is there any diagonal line of 3 'O's or 'X's
    */
    if (
        //are there any Vertical wins?
        // 1,4,7
        (cells[0] === player && cells[3] === player && cells[6] === player) ||
        // 2,5,8
        (cells[1] === player && cells[4] === player && cells[7] === player) ||
        // 3,6,9
        (cells[2] === player && cells[5] === player && cells[8] === player) ||
        //are there any Horizontal wins?
        // 1,2,3
        (cells[0] === player && cells[1] === player && cells[2] === player) ||
        // 4,5,6
        (cells[3] === player && cells[4] === player && cells[5] === player) ||
        // 7,8,9
        (cells[6] === player && cells[7] === player && cells[8] === player) ||
        //are there any Diagonal wins?
        // 1,5,9
        (cells[0] === player && cells[4] === player && cells[8] === player) ||
        // 3,5,7
        (cells[2] === player && cells[4] === player && cells[6] === player)
    ) {
        victory(player);
        return;
    }

    /*Check if the game ended in a draw -is there still a possible move? */
    for (let cell of cells) if (cell === "") return;

    victory("draw");
};

const handleClick = function (str) {
    //get the index of the clicked cell
    let pos = cellNames.indexOf(str);
    //check if there is 'O  or 'X' in the cell and if the game is running
    if (!gameRunning || cells[pos] !== "") return;

    //If it is the Circle's turn
    if (turn === "O") {
        cells[pos] = "O";
        document.querySelector(str).textContent = "O";
        document.querySelector(str).style.color = "aqua";
        turn = "X";
        document.querySelector(".turn").textContent = "X";
        document.querySelector(".turn").style.color = "red";
        checkForWin("O");
        return;
    }
    //If it is the Cross's turn
    if (turn === "X") {
        cells[pos] = "X";
        document.querySelector(str).textContent = "X";
        document.querySelector(str).style.color = "red";
        turn = "O";
        document.querySelector(".turn").textContent = "O";
        document.querySelector(".turn").style.color = "aqua";
        checkForWin("X");
        return;
    }
};
