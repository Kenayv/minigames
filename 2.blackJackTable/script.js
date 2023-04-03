"use strict";

/*
Version 0.1 of Black jack game.
02.04.2023 | Jan Grosicki | https://github.com/kenayv

Notes:
    * Probably contains a lot of redundant code
    * Might contain bugs
    * Playing more than one game requires reloading the page
    * Not responsive! (Best suited for 360x720 monitors)
    * It is possible that 2 identical cards are drawn.
        - Theoretically, the game could be played with many decks. That shouldn't be a problem.
        - I could add some logic that actually stores an array of cards and checks if it has been drawn. This would make card-counting possible.
    
To be added:
    * Money and betting
        - Should it be stored elsewhere?
        - What technology could I use to store it in external files?
        - <button pass </button>
        - <button Double-down </button>
    * RWD
    * Dealer should take ~300-500 ms between drawing each card 
        - For visual effects, to make the game look better
    * Background shouldn't change size on viewport size change.
    * Comments, comments, comments!!!
*/

const dealerDeck = document.getElementById("deck");
const dealerCard1 = document.getElementById("dealer-card1");
const dealerCard2 = document.getElementById("dealer-card2");
const dealerCard3 = document.getElementById("dealer-card3");
const dealerCard4 = document.getElementById("dealer-card4");
const dealerCard5 = document.getElementById("dealer-card5");
const dealerCard6 = document.getElementById("dealer-card6");

const playerCard1 = document.getElementById("player-card1");
const playerCard2 = document.getElementById("player-card2");
const playerCard3 = document.getElementById("player-card3");
const playerCard4 = document.getElementById("player-card4");
const playerCard5 = document.getElementById("player-card5");
const playerCard6 = document.getElementById("player-card6");

const btnStart = document.getElementById("btn-start");
const btnHold = document.getElementById("btn-hold");
const btnHit = document.getElementById("btn-hit");

const message = document.querySelector(".pop-up-message");

let playerCardCount = 0;
let dealerCardCount = 0;
let playerScore = 0;
let dealerScore = 0;
let gameRunning = true;
displayMessage("Press start to play BlackJack", "#25d53d");

function displayMessage(content, color) {
    message.textContent = content;
    message.style.color = color;
    message.classList.remove("hidden");
}

function lossScreen() {
    gameRunning = false;
    displayMessage("Loss!", "#d53d25");
}

function victoryScreen() {
    gameRunning = false;
    displayMessage("Victory!", "#25d53d");
}

function getRandomColor() {
    switch (Math.trunc(Math.random() * 4)) {
        case 0:
            return "spades";
        case 1:
            return "hearts";
        case 2:
            return "clubs";
        case 3:
            return "diamonds";
    }
}

function getRandomCardUrl(who) {
    let color = getRandomColor();
    let card = Math.trunc(Math.random() * 12) + 2;

    if (who === "player") {
        if (card < 11) playerScore += card;
        else playerScore += 10;
    } else {
        if (card < 11) dealerScore += card;
        else dealerScore += 10;
    }
    if (card >= 11) {
        switch (card) {
            case 11:
                card = "jack";
                break;
            case 12:
                card = "queen";
                break;
            case 13:
                card = "king";
                break;
            case 14:
                card = "ace";
                break;
        }
    }

    return `assets/cards/${card}_of_${color}.png`;
}

function resetGame() {
    gameRunning = true;
    playerScore = 0;
    dealerScore = 0;
    playerCardCount = 2;
    dealerCardCount = 1;
    btnStart.classList.add("hidden");
    message.classList.add("hidden");
    btnHit.classList.remove("hidden");
    btnHold.classList.remove("hidden");
    playerCard1.src = getRandomCardUrl("player");
    playerCard2.src = getRandomCardUrl("player");
    dealerCard1.src = getRandomCardUrl("dealer");
    playerCard1.classList.remove("hidden");
    playerCard2.classList.remove("hidden");
    dealerCard1.classList.remove("hidden");
    dealerCard2.src = "assets/cards/card-back.png";
    dealerCard2.classList.remove("hidden");
    dealerCard3.classList.add("hidden");
    dealerCard4.classList.add("hidden");
    dealerCard5.classList.add("hidden");
    dealerCard6.classList.add("hidden");
    playerCard3.classList.add("hidden");
    playerCard4.classList.add("hidden");
    playerCard5.classList.add("hidden");
    playerCard6.classList.add("hidden");
}

function dealerDraw(cardNo) {
    cardNo.src = getRandomCardUrl("dealer");
    cardNo.classList.remove("hidden");
    dealerCardCount++;
    if (dealerScore > 21) {
        victoryScreen();
        return;
    }
    if (dealerScore > playerScore) {
        lossScreen();
        return;
    }
    hold();
}

// playerCard2,3,4,5,6 variables could be stored in an array!
function hold() {
    if (!gameRunning) return;
    switch (dealerCardCount) {
        case 1:
            dealerDraw(dealerCard2);
            break;
        case 2:
            dealerDraw(dealerCard3);
            break;
        case 3:
            dealerDeck.classList.add("hidden");
            dealerDraw(dealerCard4);
            break;
        case 4:
            dealerDraw(dealerCard5);
            break;
        case 5:
            dealerDraw(dealerCard6);
            break;
        default:
            victoryScreen();
            break;
    }
}

function hitCard(cardNo) {
    cardNo.src = getRandomCardUrl("player");
    cardNo.classList.remove("hidden");
    playerCardCount++;
}

// playerCard2,3,4,5,6 variables could be stored in an array!
function hit() {
    if (!gameRunning) return;
    switch (playerCardCount) {
        case 2:
            hitCard(playerCard3);
            break;
        case 3:
            hitCard(playerCard4);
            break;
        case 4:
            hitCard(playerCard5);
            break;
        case 5:
            hitCard(playerCard6);
            hold();
            break;
        default:
            break;
    }
    if (playerScore > 21) {
        dealerCard2.src = getRandomCardUrl("dealer");
        lossScreen();
    }
}

btnStart.addEventListener("click", resetGame);
btnHit.addEventListener("click", hit);
btnHold.addEventListener("click", hold);
