"use strict";

const dealerDeck = document.querySelector(".deck");
const dealerCard1 = document.getElementById("dealer-card1");
const dealerCard2 = document.getElementById("dealer-card2");
const dealerCard3 = document.getElementById("dealer-card3");

const playerCard1 = document.getElementById("player-card1");
const playerCard2 = document.getElementById("player-card2");
const playerCard3 = document.getElementById("player-card3");
const playerCard4 = document.getElementById("player-card4");
const playerCard5 = document.getElementById("player-card5");
const playerCard6 = document.getElementById("player-card6");

const btnStart = document.getElementById("btn-start");
const btnHold = document.getElementById("btn-hold");
const btnHit = document.getElementById("btn-hit");

const cardsArray = [];

function getRandomCard() {
    const color = Math.trunc(Math.random() * 4) + 1;
    const card = Math.trunc(Math.random() * 13) + 1;
    const type = "cardType" + 15;
    console.log(`Returned ${card} of ${color}`);
    console.log(type);
}

getRandomCard();

function resetGame() {
    btnStart.classList.add("hidden");
}

btnStart.addEventListener("click", resetGame);
