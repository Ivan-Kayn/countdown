const inputContainer = document.querySelector('#input-container');
const countdownForm = document.querySelector('#countdown-form');
const dateEl = document.querySelector('#date-picker');

const countdownEl = document.querySelector('#countdown');
const countdownElTitle = document.querySelector('#countdown-title');
const countdownBtn = document.querySelector('#countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.querySelector('#complete');
const completeElInfo = document.querySelector('#complete-info');
const completeBtn = document.querySelector('#complete-button');

// state
let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown = {};

// constants for time
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

// set date input minimum with today's date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// populate countdown and complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        // calculating time
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        // hide input
        inputContainer.hidden = true;

        // on countdown wnd show complete block
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // show the countdown
            // populating countdown
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;

        }
    }, second);

}

function updateCountdown(event) {
    event.preventDefault();
    countdownTitle = event.target[0].value;
    countdownDate = event.target[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));

    // check for valid date
    if (countdownDate === '') {
        alert('Please enter a valid date');
    } else {
        //get number version of current date and updateDOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// reset all values
function reset() {
    // hide countdown anc complete blocks and show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // stop countdown
    clearInterval(countdownActive);
    // reset input
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');


}

function restorePreviousCountdown() {
    // get countdown from localStorage if it exists
    if (localStorage.getItem('countdown')){
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();

    }
}

// event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// check localStorage on load
restorePreviousCountdown();