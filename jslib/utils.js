function setUpWindowSizeCalc() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vw', `${vw}px`);

    window.addEventListener('resize', () => {
        // We execute the same script as before
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        let vw = window.innerWidth * 0.01;
        document.documentElement.style.setProperty('--vw', `${vw}px`);

    });
}

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