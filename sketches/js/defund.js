import { budget } from "./budgetData.js";


//Test if we're importing data
console.log(budget);


// Overall controls

const totalElements = 1586;
const vizContainer = document.getElementById("budget-container");
let domElements = [];
let currentDistribution = "🌳";


function createBudgetVisualization(city) {
    console.log("trying to render budget for..." + city);
    let budgetForCity = budget[city];
    domElements = [];
    budgetForCity.forEach((budgetRow) => {
        let numElementsEach = budgetRow.percent * totalElements;

        for (var i = 0; i <= numElementsEach; i++) {
            let domElement = generateBudgetRowDOM(budgetRow);
            domElements.push(domElement);

        }
    });
    domElements.sort(() => Math.random() - 0.5);
    renderAllElements();
}

function renderAllElements() {
    vizContainer.innerHTML = "";
    console.log("Num elements rendering is" + domElements.length)
    for (var i = 0; i < domElements.length; i++) {
        let domElement = domElements[i];
        vizContainer.appendChild(domElement);
    }
}

// Individiaul dom elements

function isPolice(budgetItem) {
    return budgetItem.name == "Police" || budgetItem.name == "Correction";
}

function generateBudgetRowDOM(budgetItem) {
    let parentContainer = document.createElement("div");
    parentContainer.innerHTML = budgetItem.icon;


    if (isPolice(budgetItem)) {
        parentContainer.classList = "police budget-item";
        parentContainer.innerHTML = "🚨";
        parentContainer.addEventListener("mouseover", () => {
            parentContainer.innerHTML = currentDistribution;
        })

    } else {
        parentContainer.classList = "budget-item";
        // parentContainer.innerHTML = Math.random() > 0.5 ? "🌳" : "📗";
    }

    let nameContainer = document.createElement("div");
    nameContainer.innerHTML = budgetItem.name;
    nameContainer.classList = "name";
    parentContainer.appendChild(nameContainer);

    return parentContainer;
}

//Setup 

function createLink(name, callback) {
    let link = document.createElement("div");
    link.innerHTML = name;
    link.classList = "link";
    link.addEventListener("click", (e) => {
        callback();
        let myParent = link.parentNode;
        let anyActiveLink = myParent.querySelector(".active-link");
        anyActiveLink.classList.remove("active-link");
        link.classList.add("active-link")
    })
    return link;
}

function setupCityLinks() {
    let linksContainer = document.getElementById("city-links-container");

    let phoenixLink = createLink("Phoenix", () => createBudgetVisualization("Phoenix"));
    linksContainer.appendChild(phoenixLink);

    let NYCLink = createLink("NYC", () => createBudgetVisualization("NYC"));
    linksContainer.appendChild(NYCLink);

    createBudgetVisualization("Phoenix");
    phoenixLink.classList.add("active-link");
}

function setupRedistributeLinks() {
    let linksContainer = document.getElementById("defund-links-container");

    let treeLink = createLink("🌳", () => { currentDistribution = "🌳" });
    linksContainer.appendChild(treeLink);

    let bookLink = createLink("📖", () => { currentDistribution = "📖" });
    linksContainer.appendChild(bookLink);

    let careLink = createLink("🏥", () => { currentDistribution = "🏥" });
    linksContainer.appendChild(careLink);

    currentDistribution = "🌳";
    treeLink.classList.add("active-link");
}

function setup() {
    setupCityLinks();
    setupRedistributeLinks();
}


setup();