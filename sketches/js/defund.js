import { budget } from "./budgetData.js";

/* Todo:
 ** Add more cities
 ** Fix styling / font vibes
 */

//Test if we're importing data
console.log(budget);
const vizContainer = document.getElementById("budget-container");
const captionContainer = document.getElementById("budget-caption");
const totalElements =
    (vizContainer.clientWidth * vizContainer.clientHeight) / (34 * 34);
const emailContainer = document.getElementById("email-fill");
const emailParentContainer = document.getElementById("email-container");
const mainParentContainer = document.getElementById("main-container");
const redistLinksContainer = document.getElementById("defund-links-container");

// ***** 🌳🌳🌳🌳🌳🌳🌳🌳 ********
// **** Parse Data - > Generate DOM ***
// ******🌳🌳🌳🌳🌳🌳🌳🌳 ********
let domElements = [];
let totalPolice, policeChanged, policeChangedTo, agencyList;
let currentDistribution = "";

function resetState() {
    domElements = [];
    totalPolice = 0;
    policeChanged = 0;
    policeChangedTo = {};
    redistLinksContainer.innerHTML = "";
    agencyList = {};
    currentDistribution = "";
}

function createBudgetVisualization(city) {
    console.log("trying to render budget for..." + city);
    let budgetForCity = budget[city].budget;
    let policePercent = 0;

    //Create DOM elements
    resetState();
    budgetForCity.forEach((budgetRow) => {
        let numElementsEach = Math.floor(budgetRow.percent * totalElements);
        if (!isPolice(budgetRow)) {
            let agencyKey = budgetRow.name;
            let agencyValue = budgetRow.icon;
            agencyList[agencyKey] = agencyValue;
        } else {
            policePercent += budgetRow.percent;
        }

        for (var i = 0; i <= numElementsEach; i++) {
            let domElement = generateBudgetRowDOM(budgetRow);
            domElements.push(domElement);
        }
    });
    setupRedistributeLinks();
    renderAllElements();

    //Update the DOM for the header
    let totalForCity = budget[city].total;
    let actualNumElements = domElements.length;
    let amountPerEmoji = totalForCity / actualNumElements;
    document.getElementById("cityname").innerHTML = city + "'s";
    document.getElementById("total-amt").innerHTML = "$" + totalForCity;
    document.getElementById("emoji-amt").innerHTML =
        "$" + amountPerEmoji.toFixed(2);
    document.getElementById("police-amt").innerHTML =
        "$" + Math.floor(totalForCity * policePercent);
    document.getElementById("police-percent").innerHTML =
        (100 * policePercent).toFixed(2) + "%";

    let initPercent = 0;
    document.getElementById("percent-amt").innerHTML =
        initPercent.toFixed(2) + "%";
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

function isPolice(budgetItem) {
    let budgetName = budgetItem.name.toLowerCase();
    let isPo =
        budgetName.includes("police") ||
        budgetName.includes("correction") ||
        budgetName.includes("prosecutor");
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
    //If not set up yet, return
    if (currentDistribution == "") {
        return;
    }

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
    budgetItemDom.dataset.key = currentDistribution;
    budgetItemDom.innerHTML = agencyList[currentDistribution];

    if (policeChangedTo[currentDistribution]) {
        let currentValue = policeChangedTo[currentDistribution] + 1;
        policeChangedTo[currentDistribution] = currentValue;
    } else {
        policeChangedTo[currentDistribution] = 1;
    }

    //Then change the redistribution percentage
    let redistributed = ((100 * policeChanged) / totalPolice).toFixed(2);
    document.getElementById("percent-amt").innerHTML = redistributed + "%";
}

function createEmail() {
    let emailString = "";

    let amountChanged = ((100 * policeChanged) / totalPolice).toFixed(2);
    emailString +=
        amountChanged +
        "% of funding away from the police, and towards these departments: <br>";

    Object.keys(policeChangedTo).forEach((key) => {
        let value = policeChangedTo[key];
        if (value > 0) {
            let perAgencyChanged = ((100 * value) / totalPolice).toFixed(2);
            let name = key.charAt(0).toUpperCase() + key.slice(1);
            emailString += "<br> • " + name + ": " + perAgencyChanged + "%";
        }
    });

    emailContainer.innerHTML = emailString;
}

function showEmail() {
    createEmail();
    emailParentContainer.style.display = "block";
    mainParentContainer.style.display = "none";
}

function hideEmail() {
    emailParentContainer.style.display = "none";
    mainParentContainer.style.display = "block";
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

function setupRedistributeLinks() {
    Object.keys(agencyList).forEach((agencyKey, index) => {
        let agencyValue = agencyList[agencyKey];
        let link = setupRedistributeLink(agencyKey, agencyValue);
        if (index == 0) {
            link.classList.add("active-link");
            currentDistribution = agencyKey;
        }
    });
}

function setupRedistributeLink(linkName, linkIcon) {
    let displayName = linkIcon + ": " + linkName;
    let link = createLink(displayName, () => {
        currentDistribution = linkName;
    });
    redistLinksContainer.appendChild(link);
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