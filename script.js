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

// Load storage
let assigned = JSON.parse(localStorage.getItem("assigned")) || {};
let available = JSON.parse(localStorage.getItem("available")) || people.slice();

function saveState() {
    localStorage.setItem("assigned", JSON.stringify(assigned));
    localStorage.setItem("available", JSON.stringify(available));
}

function proceed() {
    const name = document.getElementById("userName").value;
    if (!name) return alert("Select your name");

    // If already drawn, show result directly
    if (assigned[name]) {
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "none";
        document.getElementById("result").style.display = "block";
        document.getElementById("assignedName").innerText = assigned[name];
        return;
    }

    document.getElementById("welcome").innerText = "Hello " + name + "!";
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
}

function reveal() {
    const drawer = document.getElementById("userName").value;

    // Filter valid options
    let valid = available.filter(p =>
        p !== drawer && families[p] !== families[drawer]
    );

    if (valid.length === 0) {
        alert("No valid names left to assign. Contact the organiser.");
        return;
    }

    const chosen = valid[Math.floor(Math.random() * valid.length)];

    // Lock assignment
    assigned[drawer] = chosen;

    // Remove chosen from available
    available = available.filter(name => name !== chosen);

    saveState();

    // Show result
    document.getElementById("step2").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("assignedName").innerText = chosen;
}
