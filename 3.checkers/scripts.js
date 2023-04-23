"use strict";

/*
Version 0.04 of checkers game.
22.04.2023 | Jan Grosicki | https://github.com/kenayv

Changelist:
    * refactoring of some code
    * pieces capture backwards
    * Correctly working queens! (might contain slight bugs)
    * removed `background: url(pown-type)` code from .css file 
        - it did absolutely nothing, pawns are imgs and have a `src` attribute.
    
Notes:
    
To be added:
    * RWD
    * Fix forced moves
    * Fix this ugly, redundant code!!!!
    * fix queen png image
    
*/

//DOM elements
const startMsg = document.querySelector(".msg");
const btnStart = document.getElementById("btn-start");
const checkersBoard = document.querySelector(".checkers-wrapper");
const cells = [];
const activeCells = [];

//variables to easily navigate pawn moves
const topLeft = -9;
const bottomLeft = 7;
const topRight = -7;
const bottomRight = 9;

//global variables needed for the game to run.
let gameRunning = false;
let selectedPawn = undefined;
let turn = "white";
let forcedMove = false;
let whitePawns = 0;
let redPawns = 0;

//Class used to represent a piece on the board.
class Pawn {
    constructor(elem, color, currentCell) {
        if (!elem || !color || !currentCell) throw Error("bad Pawn Constructor!");
        this.elem = elem;
        this.color = color;
        this.selected = false;
        this.currentCell = currentCell;
        this.queen = false;
        this.elem.setAttribute("src", `assets/${color}-piece.png`);
        this.elem.setAttribute("class", `pawn`);
    }

    _capture(cell) {
        cell.pawn.color === "red" ? redPawns-- : whitePawns--;
        cell.removeChild(cell.pawn.elem);
        delete cell.pawn;
        checkForWins();
    }

    _promoteToQueen() {
        this.queen = true;
        this.elem.setAttribute("src", `assets/${this.color}-queen.png`);
    }

    //Handles the logic of moving a pawn from one square to another.
    moveFromTo(lastCell, newCell) {
        lastCell.pawn = undefined;
        newCell.pawn = this;
        //if the piece is on the 8th (1st) rank and isn't a queen.
        if (
            this.queen === false &&
            ((this.color === "white" && cells.indexOf(newCell) <= 8) ||
                (this.color === "red" && cells.indexOf(newCell) >= 56))
        )
            this._promoteToQueen();

        this.currentCell = newCell;
        newCell.appendChild(this.elem);
        if (newCell.jumpOver) {
            this._capture(newCell.jumpOver);
            forcedMove = false;
            //TODO: i believe it should be calculateForcedMoves()
            highlightLegalMoves(newCell);
            if (!forcedMove) {
                turn === "white" ? (turn = "red") : (turn = "white");
                clearActivateCells();
            } else {
                clearNonForcingMoves();
            }
        } else {
            turn === "white" ? (turn = "red") : (turn = "white");
        }
    }
}

//create 64 elements, inject them into 'checkers-wrapper' HTML element
function initBoard() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const newCell = document.createElement("div");
            newCell.setAttribute("class", "tile");

            //every other tile should be black, white tiles are transparent
            if ((i + j) % 2 !== 0) {
                newCell.classList.add("black");
                //players can move only on black cells
                newCell.addEventListener("click", handleTileClick);
                newCell.pawn = undefined;
            }

            cells.push(newCell);
            checkersBoard.appendChild(newCell);
        }
    }
}

//places a pawn element inside of a square.
function placePawn(cell, color) {
    if (color !== "white" && color !== "red") throw Error("placePawn: Bad Color!");
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
                placePawn(cells[i * 8 + j], "red");
            }
        }
    }
    redPawns = 12;

    //initializing white pawns on starting cells
    for (let i = 5; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 !== 0) {
                placePawn(cells[i * 8 + j], "white");
            }
        }
    }
    whitePawns = 12;
}

function clearActivateCells() {
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

    //put active cells that offer capturing back into activeCells array
    for (const cell of tempActiveCells) activeCells.push(cell);
}

function activateCell(cell, jumpingOvercell = undefined) {
    cell.classList.add("highlighted");
    activeCells.push(cell);
    activeCells[activeCells.length - 1].jumpOver = jumpingOvercell;
}

function calculateForcedMoves(position, clickedCell) {
    //TODO: this function should look for forced moves all over the board

    calculateMove(position, bottomLeft, clickedCell);
    calculateMove(position, bottomRight, clickedCell);
    calculateMove(position, topRight, clickedCell);
    calculateMove(position, topLeft, clickedCell);

    forcedMove ? clearNonForcingMoves() : clearActivateCells();
}

function calculateMove(position, n, clickedCell) {
    if (!cells[position + n] || !cells[position + n].classList.contains("black")) return;

    if (
        cells[position + n].pawn &&
        cells[position + n * 2] &&
        !cells[position + n * 2].pawn &&
        cells[position + n].pawn.color != clickedCell.pawn.color
    ) {
        //if a cell can be captured, and the next cell isn't occupied
        if (cells[position + n * 2].classList.contains("black")) {
            activateCell(cells[position + n * 2], cells[position + n]);
            forcedMove = true;
        }
    } else if (!cells[position + n].pawn) {
        activateCell(cells[position + n]);
    }
}

//FIXME: ugly implementation
function highlightLegalMoves(clickedCell) {
    if (activeCells.length > 0) clearActivateCells();
    const position = cells.indexOf(clickedCell);
    if (clickedCell.pawn.queen === false) {
        calculateForcedMoves(position, clickedCell);
        if (forcedMove) return;
        if (clickedCell.pawn.color === "white") {
            calculateMove(position, topLeft, clickedCell);
            calculateMove(position, topRight, clickedCell);
        } else {
            calculateMove(position, bottomRight, clickedCell);
            calculateMove(position, bottomLeft, clickedCell);
        }
    } else if (clickedCell.pawn.queen === true) {
        //FIXME: ugly, redundant code
        let queenPos = position;
        for (; cells[queenPos]; queenPos += bottomLeft) {
            calculateMove(queenPos, bottomLeft, clickedCell);
            if (!cells[queenPos + bottomLeft] || cells[queenPos + bottomLeft].pawn) break;
        }
        queenPos = position;
        for (; cells[queenPos]; queenPos += bottomRight) {
            calculateMove(queenPos, bottomRight, clickedCell);
            if (!cells[queenPos + bottomRight] || cells[queenPos + bottomRight].pawn) break;
        }
        queenPos = position;
        for (; cells[queenPos]; queenPos += topLeft) {
            calculateMove(queenPos, topLeft, clickedCell);
            if (!cells[queenPos + topLeft] || cells[queenPos + topLeft].pawn) break;
        }
        queenPos = position;
        for (; cells[queenPos]; queenPos += topRight) {
            calculateMove(queenPos, topRight, clickedCell);
            if (!cells[queenPos + topRight] || cells[queenPos + topRight].pawn) break;
        }
    }
}

function handleTileClick() {
    if (selectedPawn && activeCells.includes(this)) {
        selectedPawn.moveFromTo(selectedPawn.currentCell, this);
        selectedPawn = undefined;
        clearActivateCells();
    }
    if (!this.pawn || this.pawn.color !== turn) {
        selectedPawn = undefined;
        clearActivateCells();
        return;
    }
    selectedPawn = this.pawn;
    highlightLegalMoves(this);
    if (forcedMove) clearNonForcingMoves();
}

function startGame() {
    initPawns();
    startMsg.classList.add("hidden");
    turn = "white";
    gameRunning = true;
}

function checkForWins() {
    if (!whitePawns) {
        selectedPawn = undefined;
        clearActivateCells();
        gameRunning = false;
        console.log("Red Won!");
        return;
    }
    if (!redPawns) {
        selectedPawn = undefined;
        clearActivateCells();
        gameRunning = false;
        console.log("White Won!");
        return;
    }
}
// Main

initBoard();
startMsg.classList.remove("hidden");
btnStart.addEventListener("click", startGame);
