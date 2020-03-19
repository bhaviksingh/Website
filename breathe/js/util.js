var infoOn = true;
var errorOn = true;

function displayError(msg) {
    if (errorOn) {
        console.log("🛑" + msg);
    }
}

function displayWarning(msg) {
    if (infoOn) {
        console.log("🚧" + msg);
    }
}

function displayProgress(msg) {
    if (infoOn) {
        console.log("✅" + msg);
    }
}