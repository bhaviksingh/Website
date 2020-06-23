import { budget } from "./budgetData.js";

/* Todo:
 ** Add more options
 ** Fix the # of elemenets
 ** Fix emojis
 ** Fix styling / font vibes
 */

//Test if we're importing data
console.log(budget);
const vizContainer = document.getElementById("budget-container");
const captionContainer = document.getElementById("budget-caption");
const totalElements =
    (vizContainer.clientWidth * vizContainer.clientHeight) / (32 * 32);
const emailContainer = document.getElementById("email");
const emailParentContainer = document.getElementById("email-container");
const redistLinksContainer = document.getElementById("defund-links-container");

// ***** 🌳🌳🌳🌳🌳🌳🌳🌳 ********
// **** Parse Data - > Generate DOM ***
// ******🌳🌳🌳🌳🌳🌳🌳🌳 ********
let domElements = [];
let redistributionText = "",
    totalPolice = 0,
    policeChanged = 0,
    policeChangedTo = {};

function resetState() {
    domElements = [];
    totalPolice = 0;
    policeChanged = 0;
    policeChangedTo = {};
    redistLinksContainer.innerHTML = "";
}

function createBudgetVisualization(city) {
    console.log("trying to render budget for..." + city);
    let budgetForCity = budget[city].budget;

    //Create DOM elements
    resetState();
    budgetForCity.forEach((budgetRow) => {
        let numElementsEach = Math.floor(budgetRow.percent * totalElements);

        if (!isPolice(budgetRow)) {
            setupRedistributeLink(budgetRow);
        }
        for (var i = 0; i <= numElementsEach; i++) {
            let domElement = generateBudgetRowDOM(budgetRow);
            domElements.push(domElement);
        }
    });
    renderAllElements();

    //Update the DOM for the header
    let totalForCity = budget[city].total;
    let actualNumElements = domElements.length;
    let amountPerEmoji = totalForCity / actualNumElements;
    document.getElementById("cityname").innerHTML = city;
    document.getElementById("total-amt").innerHTML = totalForCity;
    //document.getElementById("emoji-amt").innerHTML = (amountPerEmoji).toFixed(2);
    let policePercent = totalPolice / domElements.length;
    document.getElementById("police-percent").innerHTML = (
        100 * policePercent
    ).toFixed(2);
    document.getElementById("police-amt").innerHTML = Math.floor(
        totalForCity * policePercent
    );
    document.getElementById("percent-amt").innerHTML = 0;
}

function renderAllElements() {
    vizContainer.innerHTML = "";
    console.log("Num elements rendering is" + domElements.length);
    for (var i = 0; i < domElements.length; i++) {
        let domElement = domElements[i];
        vizContainer.appendChild(domElement);
    }
}

// ***** 💰💰💰💰💰💰💰💰💰 ********
// **** Individual DOM elements *****
// ******💰💰💰💰💰💰💰💰💰 ********

let currentDistribution = "🌳";

function isPolice(budgetItem) {
    let isPo = budgetItem.name == "Police" || budgetItem.name == "Correction";
    return isPo;
}

function generateBudgetRowDOM(budgetItem) {
    let parentContainer = document.createElement("div");
    parentContainer.innerHTML = budgetItem.icon;

    if (isPolice(budgetItem)) {
        parentContainer.classList = "police budget-item";
        parentContainer.addEventListener("mouseover", () => {
            redistribute(parentContainer);
        });
        totalPolice += 1;
    } else {
        parentContainer.classList = "budget-item";
    }

    let nameContainer = document.createElement("div");
    nameContainer.innerHTML = budgetItem.name;
    nameContainer.classList = "name";
    parentContainer.appendChild(nameContainer);

    return parentContainer;
}

function redistribute(budgetItemDom) {
    //First, lets see if its the first time we're doing this
    if (budgetItemDom.classList.contains("police")) {
        //First time
        policeChanged += 1;
        budgetItemDom.classList.remove("police");
    } else {
        //Remove it from the other place
        let currentKey = budgetItemDom.dataset.key;
        policeChangedTo[currentKey] = policeChangedTo[currentKey] - 1;
    }

    //Now update it to the new situation
    budgetItemDom.innerHTML = currentDistribution;
    budgetItemDom.dataset.key = currentDistribution;

    if (policeChangedTo[currentDistribution]) {
        let currentValue = policeChangedTo[currentDistribution] + 1;
        policeChangedTo[currentDistribution] = currentValue;
    } else {
        policeChangedTo[currentDistribution] = 1;
    }

    //Then change the redistribution percentage
    let redistributed = ((100 * policeChanged) / totalPolice).toFixed(2);
    document.getElementById("percent-amt").innerHTML = redistributed;
}

function createEmail() {
    let emailString = "";

    emailString += "I would like to redistribute ";
    let amountChanged = ((100 * policeChanged) / totalPolice).toFixed(2);
    emailString += amountChanged + "% of police funds";
    emailString += "I want these funds to go in these places: </br> ";

    Object.keys(policeChangedTo).forEach((key) => {
        let value = policeChangedTo[key];
        let perAgencyChanged = ((100 * value) / totalPolice).toFixed(2);
        emailString += "</br> " + key + ": " + perAgencyChanged + "%";
    });

    emailContainer.innerHTML = emailString;
}

function showEmail() {
    createEmail();
    emailParentContainer.style.display = "block";
}

function hideEmail() {
    emailParentContainer.style.display = "none";
}

// ***** 🛠 🛠 🛠 🛠 🛠 🛠  ********
// **** DOM / Click event setup *****
// ******🛠 🛠 🛠 🛠 🛠 🛠 ********

function createLink(name, callback) {
    let link = document.createElement("div");
    link.innerHTML = name;
    link.classList = "link";
    link.addEventListener("click", (e) => {
        callback();
        let myParent = link.parentNode;
        let anyActiveLink = myParent.querySelector(".active-link");
        if (anyActiveLink) {
            anyActiveLink.classList.remove("active-link");
        }
        link.classList.add("active-link");
    });
    return link;
}

function setupCityLinks() {
    let linksContainer = document.getElementById("city-links-container");

    let phoenixLink = createLink("Phoenix", () =>
        createBudgetVisualization("Phoenix")
    );
    linksContainer.appendChild(phoenixLink);

    let NYCLink = createLink("NYC", () => createBudgetVisualization("NYC"));
    linksContainer.appendChild(NYCLink);

    let LSVille = createLink("Louisville", () =>
        createBudgetVisualization("Louisville")
    );
    linksContainer.appendChild(LSVille);

    createBudgetVisualization("Phoenix");
    phoenixLink.classList.add("active-link");
}

function setupRedistributeLink(budgetRow) {
    let linkName = budgetRow.name;
    let linkIcon = budgetRow.icon;

    let link = createLink(linkName, () => {
        currentDistribution = linkIcon;
    });

    redistLinksContainer.appendChild(link);
}

// function setupRedistributeLinks() {
//     let linksContainer = document.getElementById("defund-links-container");

//     let treeLink = createLink("parks", () => {
//         currentDistribution = "🌳";
//     });
//     linksContainer.appendChild(treeLink);

//     let bookLink = createLink("edu", () => {
//         currentDistribution = "📖";
//     });
//     linksContainer.appendChild(bookLink);

//     let careLink = createLink("health", () => {
//         currentDistribution = "🏥";
//     });
//     linksContainer.appendChild(careLink);

//     currentDistribution = "🌳";
//     treeLink.classList.add("active-link");
// }

function setupEmailLinks() {
    let emailGenerator = document.getElementById("email-generator");
    emailGenerator.addEventListener("click", () => showEmail());

    let emailBack = document.getElementById("email-container-back");
    emailBack.addEventListener("click", () => hideEmail());
}

function setup() {
    setupCityLinks();
    //setupRedistributeLinks();
    setupEmailLinks();
}

setup();