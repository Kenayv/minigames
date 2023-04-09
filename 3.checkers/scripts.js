"use strict";

/*
Version 0.0 of checkers game.
09.04.2023 | Jan Grosicki | https://github.com/kenayv

Notes:
    * NOT FINISHED

To be added:
    * RWD
    * Moving and capturing
    
*/

const startMsg = document.querySelector(".msg");
const btnStart = document.getElementById("btn-start");
const checkersBoard = document.querySelector(".checkers-wrapper");
const cells = [];
let gameRunning = false;

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
                newCell.addEventListener("click", scanForMoves);
                newCell.hasPawn = false;
                newCell.pawnType = "";
            }

            cells.push(newCell);
            checkersBoard.appendChild(newCell);
        }
    }
}

//places a pawn element inside of a checkers cell.
function placePawn(cell, color) {
    if (color !== "white" && color !== "red") throw Error("placePawn: No Color!");
    if (!cell) throw Error("placePawn: Bad cell!");
    const newPawn = document.createElement("img");
    newPawn.setAttribute("src", `assets/${color}-piece.png`);
    newPawn.setAttribute("class", `pawn ${color}-pawn`);
    cell.appendChild(newPawn);
    cell.pawnElem = newPawn;
    cell.hasPawn = true;
    cell.pawnType = `${color}`;
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

function scanForMoves() {
    if (!this.hasPawn) return;
    const position = cells.indexOf(this);
    if (this.pawnType === "white") {
        if (position % 8 > 0 && !cells[position - 9].hasPawn) {
            //higlight and listen for clicks
        }
        if (position % 8 < 7 && !cells[position - 7].hasPawn) {
            //higlight and listen for clicks
        }
    } else {
        if (position % 8 > 0 && !cells[position + 7].hasPawn) {
            //higlight and listen for clicks
        }
        if (position % 8 < 7 && !cells[position + 9].hasPawn) {
            //higlight and listen for clicks
        }
    }
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
