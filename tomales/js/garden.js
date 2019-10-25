class Flower {

    constructor(id, url, pos) {
        this.id = id;
        this.baseUrl = url;
        this.leftPosition = pos[0];
        this.topPosition = pos[1];
    }

    calculateSrcAtFrame(frameNumber) {
        return (this.baseUrl + frameNumber + ".png");
    }

    renderFlowerAtFrame(frameNumber) {
        var flowerStyle = "style='left:" + this.leftPosition + "; top:" + this.topPosition + ";'";
        var imgElement = $("<img src='" + this.calculateSrcAtFrame(frameNumber) + "' id='" + this.id + "'" + flowerStyle + "/>");
        return imgElement;
    }

    updateMyDomSRCToFrame(frameNumber) {
        document.getElementById(this.id).src = this.calculateSrcAtFrame(frameNumber);
    }
}

class Garden {

    constructor(gardenID, gardenWidth, gardenHeight, initialNumFlowers) {

        //Constants related to the image assets
        this.flowerURLs = ["assets/cutie/cutie", "assets/bush/bush", "assets/hydranges/blue", "assets/tulips/red", "assets/cactus/cactus", "assets/falltones/falltones", "assets/bigleaf/bigleaf"]; //URL of all possible flowers
        this.backgroundURL = ["assets/wind-slow/up"];
        this.frameNumbers = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];

        //Flower management in Garden, changes dynamically
        this.flowers = [];
        this.numFlowers = initialNumFlowers;
        this.startingFrame = 20;
        this.didReachTop = true;

        //Related to the actual HTML DOM of the garden, and the set up of the Poisson disc 
        this.gardenContainer = gardenID;
        this.distanceBetweenFlowers = gardenWidth / 2;
        this.gardenSize = [gardenWidth, gardenHeight];
        this.sampler = null;

        this.preload();

    }


    preload() {
        $(this.gardenID).append("<div id='garden-preload' class='preload'> </div>");
        var _this = this;
        $.each(_this.flowerURLs, function(index, flowerURL) {
            var flower = new Flower("preload-" + flowerURL, flowerURL, [0, 0]);
            for (var i = 0; i < _this.frameNumbers.length; i++) {
                $("#garden-preload").append(flower.renderFlowerAtFrame(_this.frameNumbers[i]));
            };
        });
    }

    //Getters and setters
    getMaxIndex() {
        return this.frameNumbers.length - 1;
    }

    getTimeBetweenFrames(totalTime) {
        return totalTime / this.getMaxIndex();
    }

    updateStartingFrame(newStartingFrame) {
        this.startingFrame = newStartingFrame;
    }

    //Major functions
    addFlower() {
        this.numFlowers += 1;
        this.createGarden();
    }


    isFinished() {
        return false;
    }

    reachedTop(frameIndex) {

        if (frameIndex == (this.frameNumbers.length - 1)) {
            this.didReachTop = true;
            return true;
        }
        return false;
    }

    reachedBottom(frameIndex) {
        if (frameIndex == 0) {
            //On the first run, the garden starts at the last frame. After that we want it to start on first frame
            if (this.startingFrame == 20) {
                this.startingFrame = 0;
            }

            if (this.didReachTop) {
                this.addFlower();
            }
            this.didReachTop = false;
            return true;
        }
        return false;

    }

    updateToIndex(frameIndex) {

        if (frameIndex < 0 || frameIndex >= this.frameNumbers.length) {
            console.log("Error: trying to render a garden with more or less frames than it has: " + frameIndex);
            return;
        }

        var _this = this;
        $.each(_this.flowers, function(index, flower) {
            flower.updateMyDomSRCToFrame(_this.frameNumbers[frameIndex]);
        });

    }

    start() {
        $(this.gardenContainer).hide();
        this.createGarden();
        $(this.gardenContainer).delay(800).fadeIn("slow");
        console.log("Started garden");
    }

    createGarden() {

        //Reset everything
        this.flowers = [];
        $(this.gardenContainer).html("");
        this.sampler = poissonDiscSampler(this.gardenSize[0], this.gardenSize[1], this.distanceBetweenFlowers);

        //If we need to try creation again, assume false unless something goes wrong
        var retryCreation = false;

        for (var currentFlower = 0; currentFlower < this.numFlowers; currentFlower++) {

            //Try to get a position for this new flower
            var sample = this.sampler();

            //If the position doesn't work (ie: no more samples), we need to try creation again with a smaller distanceBetweenFlowers
            if (!sample) {
                console.log("No more flowers fit buddy, max was " + currentFlower + " trying again");
                this.distanceBetweenFlowers -= 10;
                retryCreation = true;
                break;
            }

            //If we do get a position, create a new random flower, and add it to the flowers list
            var flowerID = "flower-" + currentFlower; //Create a new flower for this
            var flowerURL = this.flowerURLs[Math.floor(Math.random() * this.flowerURLs.length)]; // Choose a random flower from the flower URLs
            var flowerPosition = [sample[0], sample[1] - 100];
            var newFlower = new Flower(flowerID, flowerURL, flowerPosition);
            this.flowers.push(newFlower);

            //Then add that flower to the DOM
            var flowerDOM = newFlower.renderFlowerAtFrame(this.frameNumbers[this.startingFrame]);
            $(this.gardenContainer).append(flowerDOM);

        }

        if (retryCreation) {
            this.createGarden();
        }

    }
}

class Background {

    constructor(backgroundElement) {
        this.frameNumbers = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
        this.backgroundURL = "assets/wind-slow/up";
        this.backgroundElement = backgroundElement;
        this.preload();
    }

    getURLForIndex(frameIndex) {
        return this.backgroundURL + this.frameNumbers[frameIndex] + ".png";

    }

    getMaxIndex() {
        return this.frameNumbers.length - 1;
    }
    preload() {
        $(this.backgroundElement).append("<div id='bg-preload' class='preload'> </div>");

        var _this = this;
        for (var i = 0; i < _this.frameNumbers.length; i++) {
            var bgImgDom = "<img src='" + _this.getURLForIndex(i) + "' />"
            $("#bg-preload").append(bgImgDom);
        }
    }

    updateToIndex(frameIndex) {
        var _this = this;
        $(_this.backgroundElement).css('background-image', 'url("' + this.getURLForIndex(frameIndex) + '")');
    }

}