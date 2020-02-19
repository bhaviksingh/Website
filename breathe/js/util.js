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

class Flower {

    constructor(id, url, pos) {
        this.id = id;
        this.baseUrl = url;
        this.leftPosition = pos[0];
        this.topPosition = pos[1];
    }

    calculateSrcAtFrame(frameNumber) {
        var flowerURL = this.baseUrl + frameNumber + ".png";
        return flowerURL;
    }

    renderFlowerAtFrame(frameNumber) {
        var flowerStyle = "style='left:" + this.leftPosition + "; top:" + this.topPosition + ";'";
        var imgElement = $("<img src='" + this.calculateSrcAtFrame(frameNumber) + "' id='" + this.id + "'" + flowerStyle + "/>");
        return imgElement;
    }

    updateMyDomSRCToFrame(frameNumber) {
        var myDom = document.getElementById(this.id);
        var flowerSrc = this.calculateSrcAtFrame(frameNumber);
        myDom.src = flowerSrc;
    }
}