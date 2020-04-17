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

const mobile = (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
);

function isDesktop() {
    if (mobile)
        return false;
    else
        return true;
}

function getWindowSize() {
    if (isDesktop()) {
        return {
            'height': window.innerHeight,
            'width': window.innerWidth
        }
    } else {
        return {
            'height': document.documentElement.clientHeight,
            'width': document.documentElement.clientWidth
        }
    }
}