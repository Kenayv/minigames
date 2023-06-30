"use strict";

/*
Version 1.01 of checkers game.
FIRST READY TO PLAY VERSION
30.06.2023 | Jan Grosicki | https://github.com/kenayv

Changelist:
    * added victory() function
    * working points and game is restarting after victory
    * chat finally working

Notes:
    
To be added:
    * RWD
    * Fix this ugly code
    * simple ranking system (after learning PHP)
    * "are you sure?" pop-up when surrendering
    
*/
let userName = "Lovir88"; //DEFAULT VALUE, TO BE CHANGED

const msgBox = document.querySelector(".msg-box");
const btnStart = document.getElementById("btn-start");
const btnSurrender = document.getElementById("btn-surrender");
const btnRestart = document.getElementById("btn-restart");
const btnSendMessage = document.getElementById("btn-sendMessage");
const checkersBoard = document.querySelector(".checkers-wrapper");
const msgDisplayed = document.querySelector(".msg-displayed");
const scoreBoardWhite = document.querySelector(".white-score-msg");
const scoreBoardRed = document.querySelector(".red-score-msg");

const colorRed = "red";
const colorWhite = "white";
const cells = [];
const activeCells = [];

//variables to easily navigate pawn moves
const topLeft = -9;
const bottomLeft = 7;
const topRight = -7;
const bottomRight = 9;

let gameRunning = false;
let selectedPawn = undefined;
let turn = colorWhite;
let forcedMove = false;
let whitePawns = 0;
let redPawns = 0;

let scoreWhite = 0;
let scoreRed = 0;

//Class used to represent a piece on the board.
class Pawn {
    constructor(elem, color, currentCell) {
        if (!elem || !color || !currentCell) throw Error("bad Pawn Constructor!");
        this.currentCell = currentCell;
        this.elem = elem;
        this.color = color;
        this.selected = false;
        this.queen = false;
        this.elem.setAttribute("src", `assets/${color}-piece.png`);
        this.elem.setAttribute("class", `pawn`);
        this.justPromoted = false; // to disable queens finding a forced move just after promoting
    }

    _capture(cell) {
        cell.pawn.color === colorRed ? redPawns-- : whitePawns--;
        cell.removeChild(cell.pawn.elem);
        delete cell.pawn;
        checkForWins();
    }

    _promoteToQueen() {
        this.queen = true;
        this.elem.setAttribute("src", `assets/${this.color}-queen.png`);
        this.justPromoted = true;
    }

    //FIXME: ugly code
    //Handles the logic of moving a pawn from one square to another.
    moveFromTo(lastCell, newCell) {
        lastCell.pawn = undefined;
        newCell.pawn = this;
        //if the piece is on the 8th (1st) rank and isn't a queen.
        if (
            this.queen === false &&
            ((this.color === colorWhite && cells.indexOf(newCell) <= 8) ||
                (this.color === colorRed && cells.indexOf(newCell) >= 56))
        )
            this._promoteToQueen();

        this.currentCell = newCell;
        newCell.appendChild(this.elem);
        if (newCell.jumpOver) {
            this._capture(newCell.jumpOver);
            forcedMove = false;
            highlightLegalMoves(newCell);
            if (!forcedMove) {
                turn === colorWhite ? (turn = colorRed) : (turn = colorWhite);
                clearActiveCells();
            } else {
                clearNonForcingMoves();
            }
        } else {
            turn === colorWhite ? (turn = colorRed) : (turn = colorWhite);
        }
        if (!this.justPromoted) calculateForcedMoves();
        else this.justPromoted = false;
    }
}

/* https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    use it as:
    await sleep(<duration>);
*/
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

//create 64 elements, inject them into 'checkers-wrapper' HTML element
function initBoard() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const newCell = document.createElement("div");
            newCell.setAttribute("class", "tile");

            //every other tile should be black, white tiles are transparent
            if ((i + j) % 2 !== 0) {
                newCell.classList.add("black");
                newCell.addEventListener("click", handleTileClick);
            }
            cells.push(newCell);
            checkersBoard.appendChild(newCell);
        }
    }
}

//places a pawn element inside of a square.
function placePawn(cell, color) {
    if (color !== colorWhite && color !== colorRed) throw Error("placePawn: Bad Color!");
    if (!cell) throw Error("placePawn: Bad cell!");

    const newPawn = document.createElement("img");
    cell.pawn = new Pawn(newPawn, color, cell);
    cell.appendChild(newPawn);
}

function initPawns() {
    //initializing red pawns on starting cells
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 !== 0) {
                placePawn(cells[i * 8 + j], colorRed);
            }
        }
    }
    redPawns = 12;

    //initializing white pawns on starting cells
    for (let i = 5; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 !== 0) {
                placePawn(cells[i * 8 + j], colorWhite);
            }
        }
    }
    whitePawns = 12;
}

function clearActiveCells() {
    while (activeCells.length > 0) {
        activeCells[activeCells.length - 1].classList.remove("highlighted");
        activeCells[activeCells.length - 1].jumpOver = undefined;
        activeCells.pop();
    }
}

// FIXME: !!! Very ugly implementation !!!
// Clears moves that do not capture any piece
function clearNonForcingMoves() {
    const tempActiveCells = [];

    //If cell offers capturing save it, if not remove highlighting
    for (let i = 0; i < activeCells.length; i++) {
        if (activeCells[i].jumpOver) {
            tempActiveCells.push(activeCells[i]);
        } else activeCells[i].classList.remove("highlighted");
    }

    //clear active cells
    while (activeCells.length > 0) {
        activeCells.pop();
    }

    //put cells that capture back into activeCells array
    for (const cell of tempActiveCells) activeCells.push(cell);
}

function activateCell(cell, jumpingOvercell = undefined) {
    cell.classList.add("highlighted");
    activeCells.push(cell);
    activeCells[activeCells.length - 1].jumpOver = jumpingOvercell;
}

function checkMoves(clickedCell) {
    const position = cells.indexOf(clickedCell);
    calculateMove(position, bottomLeft, clickedCell);
    calculateMove(position, bottomRight, clickedCell);
    calculateMove(position, topRight, clickedCell);
    calculateMove(position, topLeft, clickedCell);
}

function calculateForcedMoves() {
    for (const cell of cells) {
        if (cell.pawn && turn === cell.pawn.color) {
            if (cell.pawn.queen) calculateQueenMoves(cell);
            else checkMoves(cell);
        }
    }
    forcedMove ? clearNonForcingMoves() : clearActiveCells();
}

function calculateMove(position, direction, clickedCell) {
    if (!cells[position + direction] || !cells[position + direction].classList.contains("black")) return;

    if (
        cells[position + direction].pawn &&
        cells[position + direction * 2] &&
        !cells[position + direction * 2].pawn &&
        cells[position + direction].pawn.color != clickedCell.pawn.color
    ) {
        //if a cell can be captured, and the next cell isn't occupied
        if (cells[position + direction * 2].classList.contains("black")) {
            activateCell(cells[position + direction * 2], cells[position + direction]);
            forcedMove = true;
        }
    } else if (!cells[position + direction].pawn) {
        activateCell(cells[position + direction]);
    }
}

function checkQueenMove(queenPos, direction, clickedCell) {
    for (; cells[queenPos]; queenPos += direction) {
        calculateMove(queenPos, direction, clickedCell);
        if (!cells[queenPos + direction] || cells[queenPos + direction].pawn) break;
    }
}

function calculateQueenMoves(clickedCell) {
    const queenPos = cells.indexOf(clickedCell);
    checkQueenMove(queenPos, bottomLeft, clickedCell);
    checkQueenMove(queenPos, bottomRight, clickedCell);
    checkQueenMove(queenPos, topLeft, clickedCell);
    checkQueenMove(queenPos, topRight, clickedCell);
}

function highlightLegalMoves(clickedCell) {
    if (activeCells.length > 0) clearActiveCells();
    const position = cells.indexOf(clickedCell);
    if (!clickedCell.pawn.queen) {
        checkMoves(clickedCell);
        forcedMove ? clearNonForcingMoves() : clearActiveCells();
        if (forcedMove) return;
        if (clickedCell.pawn.color === colorWhite) {
            calculateMove(position, topLeft, clickedCell);
            calculateMove(position, topRight, clickedCell);
        } else {
            calculateMove(position, bottomRight, clickedCell);
            calculateMove(position, bottomLeft, clickedCell);
        }
    } else {
        calculateQueenMoves(clickedCell);
    }
}

function handleTileClick() {
    if (selectedPawn && activeCells.includes(this)) {
        selectedPawn.moveFromTo(selectedPawn.currentCell, this);
        selectedPawn = undefined;
        clearActiveCells();
    }
    if (!this.pawn || this.pawn.color !== turn) {
        selectedPawn = undefined;
        clearActiveCells();
        return;
    }
    selectedPawn = this.pawn;
    highlightLegalMoves(this);
    if (forcedMove) clearNonForcingMoves();
}

function clearPawns() {
    for (const cell of cells) {
        cell.pawn = undefined;
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
    }
}

function startGame() {
    initPawns();
    msgBox.classList.add("hidden");
    turn = colorWhite;
    gameRunning = true;
}

function restartGame() {
    if (!gameRunning) return;
    gameRunning = false;
    selectedPawn = undefined;
    forcedMove = false;
    whitePawns = 0;
    redPawns = 0;
    clearActiveCells();
    clearPawns();
    startGame();
}

function surrenderGame() {
    if (!gameRunning) return;

    if (turn === colorWhite) {
        victory(colorRed);
    } else {
        victory(colorWhite);
    }
}

async function victory(color) {
    selectedPawn = undefined;
    clearActiveCells();
    gameRunning = false;

    if (color === colorRed) {
        scoreRed++;
        msgDisplayed.textContent = `Red Won! | ${scoreRed} - ${scoreWhite}`;
    } else {
        scoreWhite++;
        msgDisplayed.textContent = `White Won! | ${scoreWhite} - ${scoreRed}`;
    }

    scoreBoardRed.textContent = scoreRed;
    scoreBoardWhite.textContent = scoreWhite;
    msgBox.classList.remove("hidden");

    await sleep(3500);

    for (let i = 5; i > 0; i--) {
        let timer = `Restarting in: ${i} second`;
        if (i > 1) timer += "s";
        msgDisplayed.textContent = timer;
        msgDisplayed.textContent = await sleep(1000);
    }
    gameRunning = true; //so restartgame wont glich-out
    restartGame();
}

function checkForWins() {
    if (!whitePawns) {
        victory(colorRed);
    } else if (!redPawns) {
        victory(colorWhite);
    }
}

function sendMessage() {
    const chatInputContent = document.getElementById("chat-input");
    let usrMsgValue = document.createTextNode(`:  ${chatInputContent.value}`);
    const usrNameSpan = document.createElement("SPAN");
    const usrNameElem = document.createTextNode(userName);
    const msgSpan = document.createElement("SPAN");
    const chatBox = document.getElementById("message-box");

    if (chatInputContent.value === "") return;

    usrNameSpan.classList.add("usr-name");
    usrNameSpan.appendChild(usrNameElem);
    msgSpan.classList.add("usr-msg");
    msgSpan.appendChild(usrNameSpan);
    msgSpan.appendChild(usrMsgValue);
    chatBox.appendChild(msgSpan);

    chatInputContent.value = "";
}

// Main

initBoard();
msgBox.classList.remove("hidden");
btnStart.addEventListener("click", startGame);
btnRestart.addEventListener("click", restartGame);
btnSurrender.addEventListener("click", surrenderGame);
btnSendMessage.addEventListener("click", sendMessage);
