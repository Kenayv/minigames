"use strict";

/*
Version 0.02 of checkers game.
09.04.2023 | Jan Grosicki | https://github.com/kenayv

Changelist:
    * refactoring of some code
    * Pawn class - pawns exist in code now.
    * working(almost) moving logic
Notes:
    * NOT FINISHED!
    * NOT FINISHED!
    * NOT FINISHED!
    
To be added:
    * RWD
    * Capturing
    * Turns
    * calculateMove() function bug (described in comment near function definition)
    * Pawns bug when they reach row 8 (row 1 for red, 8 for white)
    
*/

const startMsg = document.querySelector(".msg");
const btnStart = document.getElementById("btn-start");
const checkersBoard = document.querySelector(".checkers-wrapper");
const cells = [];
const activeCells = [];
let gameRunning = false;
let selectedPawn = undefined;

class Pawn {
    constructor(id, color, currentCell) {
        if (!id || !color || !currentCell) throw Error("bad Pawn Constructor!");
        this.id = id;
        this.color = color;
        this.selected = false;
        this.currentCell = currentCell;
    }

    getColor() {
        return this.color;
    }

    moveFromTo(lastCell, newCell) {
        lastCell.pawn = undefined;
        newCell.pawn = this;
        this.currentCell = newCell;
        newCell.appendChild(this.id);
    }
}

//create 64 elements, inject them into checkers-wrapper HTML element
function initBoard() {
    //for I is nested in for J to make chessboard pattern
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

//places a pawn element inside of a checkers cell.
function placePawn(cell, color) {
    if (color !== "white" && color !== "red") throw Error("placePawn: Bad Color!");
    if (!cell) throw Error("placePawn: Bad cell!");

    const newPawn = document.createElement("img");
    newPawn.setAttribute("src", `assets/${color}-piece.png`);
    newPawn.setAttribute("class", `pawn ${color}-pawn`);
    cell.pawn = new Pawn(newPawn, color, cell);
    cell.appendChild(newPawn);
}

function initPawns() {
    //for I is nested in for J to make chessboard pattern
    //initializing red pawns on starting cells
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 !== 0) {
                placePawn(cells[i * 8 + j], "red");
            }
        }
    }

    //for I is nested in for J to make chessboard pattern
    //initializing white pawns on starting cells
    for (let i = 5; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 !== 0) {
                placePawn(cells[i * 8 + j], "white");
            }
        }
    }
}

function clearActivateCells() {
    while (activeCells.length > 0) {
        activeCells[activeCells.length - 1].classList.remove("highlighted");
        activeCells.pop();
    }
}

function activateCell(cell) {
    cell.classList.add("highlighted");
    activeCells.push(cell);
    console.log(cell);
}

function calculateMove(position, n, clickedCell) {
    /* 
        It and highlights white squares on H and A columns. It doesnt affect gameplay though. a pawn can't go on that square because those squares do not listen for clicks. The problem exists, because "if (position % 8 > 0)" checks if single-jumps are possible. there is however nothing that checks for double-jumps. new function can be added - calculateDoubleMove(), but that would be very inconvinient.

            *I could check if n variable equals to something(ie 7) and move on from there.
     */
    if (!cells[position + n].pawn) {
        activateCell(cells[position + n]);
    } else if (
        cells[position + n * 2] &&
        !cells[position + n * 2].pawn &&
        cells[position + n].pawn.color != clickedCell.pawn.color
    ) {
        activateCell(cells[position + n * 2]);
    }
}

function highlightLegalMoves(clickedCell) {
    const position = cells.indexOf(clickedCell);
    if (clickedCell.pawn.color === "white") {
        if (position % 8 > 0) {
            //Check top left
            calculateMove(position, -9, clickedCell);
        }
        if (position % 8 < 7) {
            //Check top right
            calculateMove(position, -7, clickedCell);
        }
    } else { //if color === red
        if (position % 8 < 7) {
            //Check bottom right
            calculateMove(position, +9, clickedCell);
        }
        if (position % 8 > 0) {
            //Check bottom Left
            calculateMove(position, +7, clickedCell);
        }
    }
}

function handleTileClick() {
    if (selectedPawn && activeCells.includes(this)) {
        selectedPawn.moveFromTo(selectedPawn.currentCell, this);
        clearActivateCells();
        selectedPawn = undefined;
    }
    if (!this.pawn) {
        selectedPawn = undefined;
        clearActivateCells();
        return;
    }
    if (activeCells.length > 0) clearActivateCells();
    selectedPawn = this.pawn;
    highlightLegalMoves(this);
}

function startGame() {
    initPawns();
    startMsg.classList.add("hidden");
    gameRunning = true;
}

// Main

initBoard();
startMsg.classList.remove("hidden");
btnStart.addEventListener("click", startGame);
