// People
const people = [
    "Karan","Krisha","Rekha","Raj",
    "Shashi","Roopesh","Roosh",
    "Manisha","Trevor","Shannon"
];

// Family group mapping
const families = {
    "Karan": 1, "Krisha": 1, "Rekha": 1, "Raj": 1,
    "Shashi": 2, "Roopesh": 2, "Roosh": 2,
    "Manisha": 3, "Trevor": 3, "Shannon": 3
};

const MAX_DICE = 7;

// Load storage (assignments + available names)
let assigned = JSON.parse(localStorage.getItem("assigned")) || {};
let available = JSON.parse(localStorage.getItem("available")) || people.slice();

// Lock: which name has used this device
let deviceLockedName = localStorage.getItem("deviceLockedName") || null;

function saveState() {
    localStorage.setItem("assigned", JSON.stringify(assigned));
    localStorage.setItem("available", JSON.stringify(available));
    if (deviceLockedName) {
        localStorage.setItem("deviceLockedName", deviceLockedName);
    }
}

function proceed() {
    const name = document.getElementById("userName").value;
    if (!name) {
        alert("Select your name");
        return;
    }

    // If this device is already locked to a different person
    if (deviceLockedName && deviceLockedName !== name) {
        alert(
            "This device has already been used by " +
            deviceLockedName +
            " to draw. Please use your own device for the draw."
        );
        return;
    }

    const revealBtn = document.getElementById("revealBtn");

    // If this person already has an assigned name, show it directly (no animation)
    if (assigned[name]) {
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "none";
        document.getElementById("result").style.display = "block";
        fillDiceWithName(assigned[name]);
        revealBtn.disabled = true;
        revealBtn.innerText = "Revealed";
        return;
    }

    document.getElementById("welcome").innerText = "Hello " + name + "!";
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
}

function fillDiceWithName(name) {
    const diceRow = document.getElementById("diceRow");
    const diceElements = diceRow.querySelectorAll(".dice");
    const letters = name.toUpperCase().split("");

    const board = document.querySelector(".ludo-board");
    if (board) {
        board.classList.remove("zoom-in");
        void board.offsetWidth; // restart animation
        board.classList.add("zoom-in");
    }

    for (let i = 0; i < MAX_DICE; i++) {
        const die = diceElements[i];
        const span = die.querySelector(".dice-letter");

        die.classList.remove("rolling", "drop-in", "final-glow");
        die.style.marginTop = "0";

        if (i < letters.length) {
            die.style.visibility = "visible";
            die.style.opacity = "1";
            die.style.transform = "translateY(0)";
            span.innerText = letters[i];

            if (i === letters.length - 1) {
                die.classList.add("final-glow");
            }
        } else {
            die.style.visibility = "hidden";
            die.style.opacity = "0";
            span.innerText = "";
        }
    }
}

function startLudoAnimation(name) {
    const diceRow = document.getElementById("diceRow");
    const diceElements = diceRow.querySelectorAll(".dice");
    const letters = name.toUpperCase().split("");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const revealBtn = document.getElementById("revealBtn");
    const board = document.querySelector(".ludo-board");

    // Show result section
    document.getElementById("step2").style.display = "none";
    document.getElementById("result").style.display = "block";

    // Board zoom-in animation
    if (board) {
        board.classList.remove("zoom-in");
        void board.offsetWidth;
        board.classList.add("zoom-in");
    }

    // Prepare dice: drop in one by one, but no final letters yet
    for (let i = 0; i < MAX_DICE; i++) {
        const die = diceElements[i];
        const span = die.querySelector(".dice-letter");

        die.classList.remove("rolling", "drop-in", "final-glow");
        die.style.marginTop = "0";

        if (i < letters.length) {
            die.style.visibility = "visible";
            die.style.opacity = "0";
            die.style.transform = "translateY(-20px)";
            span.innerText = "?"
