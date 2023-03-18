//When player wins, this boolean is changed to false, disabling player interaction
let gameRunning = true;

//Listen, if TicTacToe cells are being clicked
document.querySelector("#cellOne").addEventListener("click", () => {
    handleClick("#cellOne");
});
document.querySelector("#cellTwo").addEventListener("click", () => {
    handleClick("#cellTwo");
});
document.querySelector("#cellThree").addEventListener("click", () => {
    handleClick("#cellThree");
});
document.querySelector("#cellFour").addEventListener("click", () => {
    handleClick("#cellFour");
});
document.querySelector("#cellFive").addEventListener("click", () => {
    handleClick("#cellFive");
});
document.querySelector("#cellSix").addEventListener("click", () => {
    handleClick("#cellSix");
});
document.querySelector("#cellSeven").addEventListener("click", () => {
    handleClick("#cellSeven");
});
document.querySelector("#cellEight").addEventListener("click", () => {
    handleClick("#cellEight");
});
document.querySelector("#cellNine").addEventListener("click", () => {
    handleClick("#cellNine");
});

const resetGame = function () {
    //resetting the message below the game
    document.querySelector(".winMessage").textContent = "";
    //resetting the turn to default value
    document.querySelector(".turn").textContent = "O";
    document.querySelector(".turn").style.color = "aqua";

    //resetting tiles
    document.querySelector("#cellOne").textContent = ".";
    document.querySelector("#cellOne").style.color = "#222";
    document.querySelector("#cellTwo").textContent = ".";
    document.querySelector("#cellTwo").style.color = "#222";
    document.querySelector("#cellThree").textContent = ".";
    document.querySelector("#cellThree").style.color = "#222";
    document.querySelector("#cellFour").textContent = ".";
    document.querySelector("#cellFour").style.color = "#222";
    document.querySelector("#cellFive").textContent = ".";
    document.querySelector("#cellFive").style.color = "#222";
    document.querySelector("#cellSix").textContent = ".";
    document.querySelector("#cellSix").style.color = "#222";
    document.querySelector("#cellSeven").textContent = ".";
    document.querySelector("#cellSeven").style.color = "#222";
    document.querySelector("#cellEight").textContent = ".";
    document.querySelector("#cellEight").style.color = "#222";
    document.querySelector("#cellNine").textContent = ".";
    document.querySelector("#cellNine").style.color = "#222";

    gameRunning = true;
};

//Listen, if reset button is clicked

document.querySelector(".btn").addEventListener("click", () => {
    resetGame();
});

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
    /*check if anyone won:
        - Is there any vertical line of 3 'O's or 'X's
        - Is there any horizontal line of 3 'O's or 'X's
        - Is there any diagonal line of 3 'O's or 'X's
    */
    if (
        //are there any Vertical wins?
        // 1,4,7
        (document.querySelector("#cellOne").textContent === player &&
            document.querySelector("#cellFour").textContent === player &&
            document.querySelector("#cellSeven").textContent === player) ||
        // 2,5,8
        (document.querySelector("#cellTwo").textContent === player &&
            document.querySelector("#cellFive").textContent === player &&
            document.querySelector("#cellEight").textContent === player) ||
        // 3,6,9
        (document.querySelector("#cellThree").textContent === player &&
            document.querySelector("#cellSix").textContent === player &&
            document.querySelector("#cellNine").textContent === player) ||
        //are there any Horizontal wins?
        // 1,2,3
        (document.querySelector("#cellOne").textContent === player &&
            document.querySelector("#cellTwo").textContent === player &&
            document.querySelector("#cellThree").textContent === player) ||
        // 4,5,6
        (document.querySelector("#cellFour").textContent === player &&
            document.querySelector("#cellFive").textContent === player &&
            document.querySelector("#cellSix").textContent === player) ||
        // 7,8,9
        (document.querySelector("#cellSeven").textContent === player &&
            document.querySelector("#cellEight").textContent === player &&
            document.querySelector("#cellNine").textContent === player) ||
        //are there any Diagonal wins?
        // 1,5,9
        (document.querySelector("#cellOne").textContent === player &&
            document.querySelector("#cellFive").textContent === player &&
            document.querySelector("#cellNine").textContent === player) ||
        // 3,5,7
        (document.querySelector("#cellThree").textContent === player &&
            document.querySelector("#cellFive").textContent === player &&
            document.querySelector("#cellSeven").textContent === player)
    )
        victory(player);

    /*Check if the game ended in a draw
        -are all the cells in the table claimed?
    */
    if (
        document.querySelector("#cellOne").textContent !== "." &&
        document.querySelector("#cellTwo").textContent !== "." &&
        document.querySelector("#cellThree").textContent !== "." &&
        document.querySelector("#cellFour").textContent !== "." &&
        document.querySelector("#cellFive").textContent !== "." &&
        document.querySelector("#cellSix").textContent !== "." &&
        document.querySelector("#cellSeven").textContent !== "." &&
        document.querySelector("#cellEight").textContent !== "." &&
        document.querySelector("#cellNine").textContent !== "."
    )
        victory("draw");
};

const handleClick = function (str) {
    //check if there is a figure in the cell
    if (!gameRunning || document.querySelector(str).textContent !== ".") return;

    //If it is the Circle's turn
    if (document.querySelector(".turn").textContent === "O") {
        document.querySelector(str).textContent = "O";
        document.querySelector(str).style.color = "aqua";
        document.querySelector(".turn").textContent = "X";
        document.querySelector(".turn").style.color = "red";
        checkForWin("O");
        return;
    }
    //If it is the Cross's turn
    if (document.querySelector(".turn").textContent === "X") {
        document.querySelector(str).textContent = "X";
        document.querySelector(str).style.color = "red";
        document.querySelector(".turn").textContent = "O";
        document.querySelector(".turn").style.color = "aqua";
        checkForWin("X");
        return;
    }
};
