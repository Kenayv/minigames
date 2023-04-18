"use strict";

/*
Version 0.03 of checkers game.
10.04.2023 | Jan Grosicki | https://github.com/kenayv

Changelist:
    * refactoring of some code
    * (Almost Working) Capturing
    * Turns
    
Notes:
    * NOT FINISHED!
    * NOT FINISHED!
    * NOT FINISHED!
    
To be added:
    * RWD
    * Fix calculateMove() function bug (described in comment near function definition)
    * Pawns bug when they reach row 8 (row 1 for red, 8 for white)
    * Queens
    * capturing backwards
    * Fix forced moves
*/

const startMsg = document.querySelector(".msg");
const btnStart = document.getElementById("btn-start");
const checkersBoard = document.querySelector(".checkers-wrapper");
const cells = [];
const activeCells = [];
let gameRunning = false;
let selectedPawn = undefined;
let turn = "white";
let forcedMove = false;

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

    capture(cell) {
        cell.removeChild(cell.pawn.id);
        delete cell.pawn;
    }

    moveFromTo(lastCell, newCell) {
        lastCell.pawn = undefined;
        newCell.pawn = this;
        this.currentCell = newCell;
        newCell.appendChild(this.id);
        if (newCell.jumpOver) {
            this.capture(newCell.jumpOver);
            forcedMove = false;
            highlightLegalMoves(newCell);
            if (!forcedMove) {
                turn === "white" ? (turn = "red") : (turn = "white");
                clearActivateCells();
            }
            if (forcedMove) {
                clearNonForcingMoves();
            }
            return;
        }
        turn === "white" ? (turn = "red") : (turn = "white");
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
    //initializing red pawns on starting cells
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 !== 0) {
                placePawn(cells[i * 8 + j], "red");
            }
        }
    }

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

function calculateMove(position, n, clickedCell) {
    /*  FIXME:
        It and highlights white squares on H and A columns. It doesnt affect gameplay though. a pawn can't go on that square because those squares do not listen for clicks. The problem exists, because "if (position % 8 > 0)" checks if single-jumps are possible. there is however nothing that checks for double-jumps. new function can be added - calculateDoubleMove(), but that would be very inconvinient.

            *I could check if n variable equals to something(ie 7) and move on from there.

        FIXME:
        If player doesn't click a pawn that can capture, the ForcedMove variable isn't changed and other moves are still possible.

        TODO:
        Something should automatically check if there are any forced moves.
     */
    if (!cells[position + n]) return; //TODO: change the piece to a queen

    if (
        cells[position + n].pawn &&
        cells[position + n * 2] &&
        !cells[position + n * 2].pawn &&
        cells[position + n].pawn.color != clickedCell.pawn.color
    ) {
        activateCell(cells[position + n * 2], cells[position + n]);
        forcedMove = true;
    } else if (!cells[position + n].pawn) {
        activateCell(cells[position + n]);
    }
}

function highlightLegalMoves(clickedCell) {
    if (activeCells.length > 0) clearActivateCells();
    const position = cells.indexOf(clickedCell);
    if (clickedCell.pawn.color === "white") {
        //TODO:
        //if's should check for backward captures as well.
        if (position % 8 > 0) {
            //Check top left
            calculateMove(position, -9, clickedCell);
        }
        if (position % 8 < 7) {
            //Check top right
            calculateMove(position, -7, clickedCell);
        }
    } else {
        //if color === red
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

// Main

initBoard();
startMsg.classList.remove("hidden");
btnStart.addEventListener("click", startGame);
