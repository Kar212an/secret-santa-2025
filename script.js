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

/* ---------- ONE-TIME STORAGE RESET (to avoid old corrupted data) ---------- */
const STORAGE_VERSION = "v4";

if (localStorage.getItem("storageVersion") !== STORAGE_VERSION) {
    localStorage.removeItem("assigned");
    localStorage.removeItem("available");
    localStorage.removeItem("deviceLockedName");
    localStorage.setItem("storageVersion", STORAGE_VERSION);
}

/* ------------------------------------------------------------------------- */

// Safe JSON parse in case old data is corrupt
function safeParse(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        return fallback;
    }
}

// Load storage (assignments + available names)
let assigned = safeParse("assigned", {});
let available = safeParse("available", people.slice());

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

/**
 * Simple fill for when a user revisits – no animation, just show the name.
 */
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

        // remove any animation classes
        die.classList.remove("rolling", "drop-in");
        die.style.marginTop = "0";

        if (i < letters.length) {
            die.style.visibility = "visible";
            die.style.opacity = "1";
            die.style.transform = "translateY(0)";
            span.innerText = letters[i];
        } else {
            die.style.visibility = "hidden";
            die.style.opacity = "0";
            span.innerText = "";
        }
    }
}

/**
 * Main animation:
 * - board zooms in
 * - all dice appear with "?"
 * - then each die, one by one every 0.4s:
 *      - rolls random letters
 *      - stops and shows its final letter
 */
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

    // Prepare dice: visible ones show "?", hidden ones disappear
    for (let i = 0; i < MAX_DICE; i++) {
        const die = diceElements[i];
        const span = die.querySelector(".dice-letter");

        die.classList.remove("rolling", "drop-in");
        die.style.marginTop = "0";

        if (i < letters.length) {
            die.style.visibility = "visible";
            die.style.opacity = "1";
            die.style.transform = "translateY(0)";
            span.innerText = "?";
        } else {
            die.style.visibility = "hidden";
            die.style.opacity = "0";
            span.innerText = "";
        }
    }

    revealBtn.disabled = true;
    revealBtn.innerText = "Rolling...";

    // Each die reveals its letter every 0.4 seconds
    letters.forEach((letter, index) => {
        const die = diceElements[index];
        const span = die.querySelector(".dice-letter");

        // Start each die with a staggered delay
        setTimeout(() => {
            die.classList.add("rolling");

            // This interval makes the die show random letters quickly
            const rollInterval = setInterval(() => {
                span.innerText = alphabet[Math.floor(Math.random() * alphabet.length)];
            }, 60);

            // After 0.4s, stop rolling and show the real letter
            setTimeout(() => {
                clearInterval(rollInterval);
                die.classList.remove("rolling");
                span.innerText = letter;

                // When the last letter is set, mark as revealed
                if (index === letters.length - 1) {
                    revealBtn.innerText = "Revealed";
                }
            }, 400);
        }, index * 400); // 0.4s gap between each die
    });
}

function reveal() {
    const drawer = document.getElementById("userName").value;
    const revealBtn = document.getElementById("revealBtn");

    if (!drawer) {
        alert("Select your name first");
        return;
    }

    // Block if this device is locked for someone else
    if (deviceLockedName && deviceLockedName !== drawer) {
        alert(
            "This device has already been used by " +
            deviceLockedName +
            " to draw. Please use your own device."
        );
        return;
    }

    // If they already have an assignment (just re-show, no animation)
    if (assigned[drawer]) {
        document.getElementById("step2").style.display = "none";
        document.getElementById("result").style.display = "block";
        fillDiceWithName(assigned[drawer]);
        revealBtn.disabled = true;
        revealBtn.innerText = "Revealed";
        return;
    }

    // Filter valid options: not themselves, not same family
    let valid = available.filter(p =>
        p !== drawer && families[p] !== families[drawer]
    );

    if (valid.length === 0) {
        alert("No valid names left to assign. Contact the organiser.");
        return;
    }

    // Choose the final name first (so animation ends on this)
    const chosen = valid[Math.floor(Math.random() * valid.length)];

    // Lock assignment
    assigned[drawer] = chosen;

    // Remove chosen from available list
    available = available.filter(name => name !== chosen);

    // Lock this device to this drawer (first time)
    if (!deviceLockedName) {
        deviceLockedName = drawer;
    }

    saveState();

    // Start the Ludo-style dice animation
    startLudoAnimation(chosen);
}

/* ---------------- ADMIN RESET BUTTON (FINAL) ---------------- */

const adminButton = document.getElementById("adminResetBtn");

// Secret shortcut: CTRL + ALT + R (changed from Ctrl + Shift + R to avoid browser hard refresh)
document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "r") {
        if (adminButton) {
            adminButton.style.display = "block";      // show button
            adminButton.dataset.locked = "true";      // keep it shown
            alert("Admin Reset Mode Enabled");
        }
        e.preventDefault(); // block any default browser behaviour
    }
});

// Mutation Observer to PREVENT button from being auto-hidden by page DOM updates
if (adminButton) {
    const observer = new MutationObserver(() => {
        if (adminButton.dataset.locked === "true") {
            adminButton.style.display = "block"; // force it back on
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // When admin clicks RESET ALL
    adminButton.addEventListener("click", function () {
        if (confirm("Are you sure? This will reset ALL Secret Santa assignments on this device.")) {
            localStorage.removeItem("assigned");
            localStorage.removeItem("available");
            localStorage.removeItem("deviceLockedName");
            localStorage.removeItem("storageVersion");

            alert("All Secret Santa data cleared. Page will reload.");
            location.reload();
        }
    });
}
