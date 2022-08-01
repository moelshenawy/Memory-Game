/*
 * Create a list that holds all of your cards
 */
const stars = document.querySelector('.stars');
const allCards = document.querySelectorAll('.card');
const cardIcons= document.querySelectorAll('.card i');
const moves = document.querySelector('.moves');
const restart = document.querySelector('.restart');
const overlay = document.querySelector('.overlay');
const score = document.querySelector('#score_message');
const timer = document.querySelector('.timer');
let min = document.querySelector('#minutes');
let sec = document.querySelector('#seconds');
const play = document.querySelector('#play');

let setTimer = true;

// Array to hold all the classes of the icons.
let allClasses = [];

function storeIcons() {
    for(let value of cardIcons) {
        allClasses.push(value.className);
    }
}

// reshuffle all the icons on the cards
let shuffledIcons = [];
function reShuffle(){
    allClasses = [];
    shuffledIcons = [];
    storeIcons();
    shuffledIcons = shuffle(allClasses);
    cardIcons.forEach(function(icon,i,arr) {
        arr[i].classList.value = shuffledIcons.pop();
    });
}
reShuffle();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Remove modal and restart the game.
function hideModal() {
    overlay.classList.add('hidden');
    startGame();
}

// display modal if all cards have been matched.
function showModal() {
    const documentFrag = document.createDocumentFragment();
    // You can't set the innerHTML of a document fragment like you would do with a normal node, therefore
    // adding a standard div and setting the innerHTML of that is the common solution.
    const modalContainer = document.createElement('div');
    overlay.classList.remove('hidden');
    scoreMsg();
    
    modalContainer.innerHTML = `<div id="modal">
    <div id="score_message">${msg}</div>
        <table id="modalTable">
            <tbody>
                <tr>
                    <td>Rating :</td>
                    <td class="stars_list">${stars.innerHTML}</td>
                </tr>
                <tr>
                    <td>Time :</td>
                    <td>${timer.textContent}</td>
                </tr>
                <tr>
                    <td>Moves :</td>
                    <td>${count}</td>
                </tr>
                <tr>
                    <td colspan="2"><input type="button" id="play" onclick="hideModal();" value="Play Again"/></td>
                </tr>
            </tbody>
        </table>
    </div>`;
    documentFrag.appendChild(modalContainer);
    overlay.appendChild(documentFrag);
}

// message to display on the modal depending on the numbers of moves.
let msg = '';
function scoreMsg() {
    if (count < 10) {
        msg = "Congratulations";
    } else if(count > 10 && count <= 16){
        msg = "Nice try";
    }else{
        msg = "You can do better!";
    }
    return msg;
}
// if all the cards are matched, show the modal.
function endGame() {
    if(matchedCards.length === 16){
        stopTime();
        showModal();
    }
}

let count = 0;
let seconds = 0;

// display time as two digits. start with zero for numbers less than or equal to 9.
function checkTime(value) {
    return value <= 9 ? '0' + value : value;
}

//increment the seconds and display the time on the DOM element.
function configTime(){
    ++seconds;
    sec.textContent = checkTime(seconds%60);
    min.textContent = checkTime(parseInt(seconds/60,10));
}

//Decrease the star rating after some number of moves.
const stars_list = stars.children;
function rating(){
    if(count === 10){
        stars_list[2].setAttribute("style", "visibility: hidden");
    }else{
        if(count === 16){
            stars_list[1].setAttribute("style", "visibility: hidden");
        }
    }
    
}

// count number of moves and display on the DOM element.
function counter(){
    ++count;
    moves.textContent = `${count}`;
    rating();
}

// Array that holds all matched cards.
let matchedCards = [];

// confirm if the opened cards match.
function checkMatch(event) {
    if(openedCards.length === 2){
        counter();
        if(openedCards[0].firstElementChild.className === openedCards[1].firstElementChild.className){
            for(let value of openedCards){
                value.classList.add('match');
                matchedCards.push(value);
            }
            openedCards = [];
            endGame();
        }else{
            for(let value of openedCards){
                value.classList.add('fail');
            }
            setTimeout(function(){
                for(let value of openedCards){
                    value.classList.remove('show','fail','open');
                }
                openedCards = [];
            }, 800);            
        }
    }
}

//open and show clicked card if it is not yet open.
function flipCard(evt) {
    startTimer();
    const clickedCard = event.target;
    //check if the click is the right target (a LI element).
    if(clickedCard.nodeName === 'LI') {
        //open the clicked card and put it in a temporary array that holds opened cards.
        if(!clickedCard.classList.contains('open')){
            clickedCard.classList.add('show','open');
            openedCards.push(clickedCard);
        }
    }
    checkMatch(event);
}

//A temporary array to hold opened cards.
let openedCards = [];
allCards.forEach(function (value) { 
    value.addEventListener('click',flipCard);
});

//reset
function startGame (){
    stopTime();
    setTimer = true;
    for(let star of stars_list){
        star.removeAttribute("style", "visibility: hidden");
    }
    count = 0;
    seconds = 0;
    sec.textContent = '';
    min.textContent = '';
    sec.textContent = `0${Number('0')}`;
    min.textContent = `0${Number('0')}`;
    moves.textContent = `${count}`;
    allCards.forEach(function (value) {
        value.classList.remove('open','show','match');
    });
    openedCards = [];
    matchedCards = [];
    overlay.innerHTML = ' ';
    reShuffle();
}
restart.addEventListener('click',startGame);

let runTimer;
function startTimer(){
    if(setTimer){
        // start timer
        runTimer = setInterval(configTime,1000);
        setTimer = false;
    }
}

let stopTime = function(){
    clearInterval(runTimer);
}
