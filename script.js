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

// Load storage (assignments + available names)
let assigned = JSON.parse(localStorage.getItem("assigned")) || {};
let available = JSON.parse(localStorage.getItem("available")) || people.slice();

// Lock: which name has used this device
let deviceLockedName = localStorage.getItem("deviceLockedName") || null;

// Animation handles
let animationInterval = null;
let animationTimeout = null;

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

    // If this person already has an assigned name, show it directly (no animation)
    if (assigned[name]) {
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "none";
        document.getElementById("result").style.display = "block";
        document.getElementById("slotName").innerText = assigned[name];
        return;
    }

    document.getElementById("welcome").innerText = "Hello " + name + "!";
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
}

function startSlotAnimation(chosen, spinPool) {
    const slotNameEl = document.getElementById("slotName");
    const revealBtn = document.getElementById("revealBtn");

    // Ensure result section visible
    document.getElementById("step2").style.display = "none";
    document.getElementById("result").style.display = "block";

    revealBtn.disabled = true;
    revealBtn.innerText = "Drawing...";

    // Use at least something to scroll
    const pool = spinPool && spinPool.length ? spinPool : people.slice();
    let idx = 0;

    // Rapidly cycle through names
    animationInterval = setInterval(() => {
        slotNameEl.innerText = pool[idx % pool.length];
        idx++;
    }, 100); // change every 100ms

    // Stop after 5 seconds on the chosen name
    animationTimeout = setTimeout(() => {
        clearInterval(animationInterval);
        slotNameEl.innerText = chosen;
        revealBtn.innerText = "Revealed";
    }, 5000);
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
        document.getElementById("slotName").innerText = assigned[drawer];
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

    // Start the "casino" scrolling animation
    startSlotAnimation(chosen, valid);
}
