import { budget } from "./budgetData.js";


//Test if we're importing data
console.log(budget);


// Overall controls

const totalElements = 1586;
const vizContainer = document.getElementById("budget-container");
let domElements = [];


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
function createLink(name, jsonID) {
    let link = document.createElement("div");
    link.innerHTML = name;
    link.addEventListener("click", (e) => {
        createBudgetVisualization(jsonID);
    })
    return link;
}

function setup() {
    createBudgetVisualization("Phoenix");
    let linksContainer = document.getElementById("links-container");
    linksContainer.appendChild(createLink("Phoenix", "Phoenix"));
    linksContainer.appendChild(createLink("NYC", "NYC"));
}
setup();