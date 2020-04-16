var logging = true;
var details = false;

function displayProgress(msg, info) {
    displayMessage("🏁" + msg, info);
}

function displayWarning(msg, info) {
    displayMessage("🚧" + msg, info);
}

function displayMessage(msg, info) {
    if (!logging) return;
    console.log(msg);

    if (!details) return;

    if (Array.isArray(info))
        info.forEach((infoPiece) => console.log(infoPiece))
    else
        console.log(info);
}