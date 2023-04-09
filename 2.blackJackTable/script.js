"use strict";

/*
Version 0.2 of Black jack game.
07.04.2023 | Jan Grosicki | https://github.com/kenayv

Changelist:
    * Added little economy and betting
    * Improved readability and logic.
    * Cards are now stored in arrays (dealerCards,playerCards), and not in variables such as plCard1, plCard2 (...)
    *Colors hex names are stored in variables
    * Background does not change anymore size on viewport size change.
    * Added very little responsivity
    * Dealer waits 1000 ms between drawing each card to make the game more interactive
    
Notes:
    * Probably contains a lot of redundant code
    * Might contain bugs
    * Playing more than one game requires reloading the page
    * Not responsive! (Best suited for 360x720 monitors)
    * It is possible that 2 identical cards are drawn.
     - Theoretically, the game could be played with many decks. That shouldn't be a problem.
        - I could add some logic that actually stores an array of cards and checks if it has been drawn. This would make card-counting possible.

To be added:
    * Game should automatically restart after playing a round.
    * Money changes:
        - Should it be stored elsewhere?
        - What technology could I use to store it in external files?
        - <button> pass </button>
        - <button> Double-down </button>
    * RWD
    * getRandomCardUrl LOGIC SHOULD BE CHANGED - more info at the function

    *  One very interesting and  ambitious thing would be to add posibility calculation 
        - a simple window that can be opened and shows odds of each card being drawn and the win posibility
    
*/

//variable names are easier to read than hex
const colorGreen = "#25d53d";
const colorRed = "#d53d25";

const dealerDeck = document.getElementById("deck");
const dealerCards = [
    document.getElementById("dealer-card1"),
    document.getElementById("dealer-card2"),
    document.getElementById("dealer-card3"),
    document.getElementById("dealer-card4"),
    document.getElementById("dealer-card5"),
    document.getElementById("dealer-card6")
];
const playerCards = [
    document.getElementById("player-card1"),
    document.getElementById("player-card2"),
    document.getElementById("player-card3"),
    document.getElementById("player-card4"),
    document.getElementById("player-card5"),
    document.getElementById("player-card6")
];

let dealerCardCount = 0;
let playerCardCount = 0;
let dealerScore = 0;
let playerScore = 0;
let betAmount = 0;
let playerMoney = 400;

const btnHit = document.getElementById("btn-hit");
const btnHold = document.getElementById("btn-hold");
const btnStart = document.getElementById("btn-start");
const btnPlus50 = document.getElementById("btn-p50");
const btnMinus50 = document.getElementById("btn-m50");

const message = document.getElementById("pop-up");
const moneyMessage = document.getElementById("player-money");
const betMessage = document.getElementById("bet");
moneyMessage.textContent = `$ ${playerMoney}`;

let gameRunning = true;

function bet() {
    if (playerMoney < 50) return;
    betAmount += 50;
    playerMoney -= 50;
    betMessage.textContent = `$ ${betAmount}`;
    moneyMessage.textContent = `$ ${playerMoney}`;
}

function addMoney(amount) {
    playerMoney += amount;
    moneyMessage.textContent = `$ ${playerMoney}`;
}

function clearBet() {
    playerMoney += betAmount;
    betAmount = 0;
    betMessage.textContent = `$ ${betAmount}`;
    moneyMessage.textContent = `$ ${playerMoney}`;
}

//message displayed on the middle of the screen
function displayMessage(content, color) {
    message.textContent = content;
    message.style.color = color;
    message.classList.remove("hidden");
}

function lossScreen() {
    gameRunning = false;
    betAmount = 0;
    betMessage.textContent = "$ 0";
    displayMessage("Loss!", colorRed);
}

function victoryScreen() {
    gameRunning = false;
    addMoney(betAmount * 2);
    betAmount = 0;
    betMessage.textContent = "$ 0";
    displayMessage("Victory!", colorGreen);
}

//Should be used ONLY in the getRandomCardUrl function
function _getRandomColor() {
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

// THIS LOGIC SHOULD BE CHANGED - SCORE LOGIC SHOULD BE SEPARATED FROM THE FUNCTION
function getRandomCardUrl(who) {
    let color = _getRandomColor();
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

function initCards() {
    // card[0] = random; card[1] = card-back; hide other cards
    dealerCards[0].src = getRandomCardUrl("dealer");
    dealerCards[0].classList.remove("hidden");
    dealerCards[1].src = "assets/cards/card-back.png";
    dealerCards[1].classList.remove("hidden");
    dealerCards[2].classList.add("hidden");
    dealerCards[3].classList.add("hidden");
    dealerCards[4].classList.add("hidden");
    dealerCards[5].classList.add("hidden");

    // cards [0] and [1] = random; hide other cards
    playerCards[0].src = getRandomCardUrl("player");
    playerCards[0].classList.remove("hidden");
    playerCards[1].src = getRandomCardUrl("player");
    playerCards[1].classList.remove("hidden");
    playerCards[2].classList.add("hidden");
    playerCards[3].classList.add("hidden");
    playerCards[4].classList.add("hidden");
    playerCards[5].classList.add("hidden");
}

function initgame() {
    btnStart.classList.add("hidden");
    message.classList.add("hidden");
    btnHit.classList.remove("hidden");
    btnHold.classList.remove("hidden");
    btnPlus50.classList.add("hidden");
    btnMinus50.classList.add("hidden");
    playerScore = 0;
    dealerScore = 0;
    playerCardCount = 2;
    dealerCardCount = 1;
    initCards();
    gameRunning = true;
}

function dealerDraw(cardNo) {
    if (dealerCardCount >= 6) victoryScreen();
    dealerCardCount++;
    if (dealerCardCount > 3) dealerDeck.classList.add("hidden");
    cardNo.src = getRandomCardUrl("dealer");
    cardNo.classList.remove("hidden");

    // waits 1s between drawing each card or showing a win/loss screen
    setTimeout(() => {
        if (dealerScore > 21) {
            victoryScreen();
            return;
        }
        if (dealerScore > playerScore) {
            lossScreen();
            return;
        }
        dealerDraw(dealerCards[dealerCardCount]);
    }, 1000);
}

// playerCard2,3,4,5,6 variables could be stored in an array!
function hold() {
    if (!gameRunning) return;
    dealerDraw(dealerCards[dealerCardCount]);
}

function drawCard(cardNo) {
    cardNo.src = getRandomCardUrl("player");
    cardNo.classList.remove("hidden");
    playerCardCount++;
}

// playerCard2,3,4,5,6 variables could be stored in an array!
function hit() {
    if (!gameRunning) return;
    drawCard(playerCards[playerCardCount]);

    if (playerScore > 21) {
        dealerCards[1].src = getRandomCardUrl("dealer");
        lossScreen();
    }
}

btnStart.addEventListener("click", initgame);
btnHit.addEventListener("click", hit);
btnHold.addEventListener("click", hold);
btnPlus50.addEventListener("click", bet);
btnMinus50.addEventListener("click", clearBet);
