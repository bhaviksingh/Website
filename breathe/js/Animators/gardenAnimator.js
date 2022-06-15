class GardenAnimator {

    constructor(gardenID, gardenWidth, gardenHeight) {

        //Constants related to the image assets
        this.flowerURLs = ["assets/flowers/cutie/cutie", "assets/flowers/bush/bush", "assets/flowers/hydranges/blue", "assets/flowers/tulips/red", "assets/flowers/cactus/cactus", "assets/flowers/falltones/falltones", "assets/flowers/bigleaf/bigleaf"]; //URL of all possible flowers
        this.backgroundURL = ["assets/wind-slow/up"];
        this.frameNumbers = ["19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01", "00"]

        //Flower management in Garden, changes dynamically
        this.flowers = [];
        this.numFlowers = 20;

        //Manages playback of flowers
        this.currentFrame = 0;
        this.growNewFlower = true;

        //Related to the actual HTML DOM of the garden, and the set up of the Poisson disc 
        this.gardenContainer = gardenID;
        this.distanceBetweenFlowers = gardenWidth / 2;
        this.gardenSize = [gardenWidth, gardenHeight];
        this.sampler = null;

        //We're doing this in a set timeout because we know that the tutorial is pre-loading at the same time and we want that to go first
        setTimeout(() => this.preload(), 1000);
        this.firstPlay = true;
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

    //Animation related functions 

    growGarden() {
        if (this.currentFrame >= this.frameNumbers.length && this.growNewFlower) {
            //displayProgress("Garden reached bottom");
            this.addFlower();
            this.growNewFlower = false;
        }
        if (this.currentFrame <= 0) {
            //displayProgress("Garden reached top");
            this.growNewFlower = true;
        }
    }


    limitCurrentFrame() {
        if (this.currentFrame <= 0) {
            this.currentFrame = 0;
        }
        if (this.currentFrame >= this.frameNumbers.length) {
            this.currentFrame = this.frameNumbers.length - 1;
        }
    }


    tick(currentTick) {
        if (this.firstPlay) {
            this.generateGarden();
            this.firstPlay = false;
        }
        this.currentFrame += currentTick;
        this.growGarden();
        this.limitCurrentFrame();
        displayProgress("Garden received tick, playing at " + this.currentFrame);
        for (var i = 0; i < this.flowers.length; i++) {
            var flower = this.flowers[i];
            var flowerFrame = this.frameNumbers[this.currentFrame];
            flower.updateMyDomSRCToFrame(flowerFrame);
        }

    }

    //Garden related functions

    addFlower() {
        console.log("Adding flower");
        this.numFlowers += 1;
        this.generateGarden();
    }

    generateGarden() {
        displayProgress("Creating garden with " + this.numFlowers + " flowers");

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
            var flowerID = this.gardenContainer + "-flower-" + currentFlower; //Create a new flower for this
            var flowerURL = this.flowerURLs[Math.floor(Math.random() * this.flowerURLs.length)]; // Choose a random flower from the flower URLs
            var flowerPosition = [sample[0], sample[1] - 100];
            var newFlower = new Flower(flowerID, flowerURL, flowerPosition);
            this.flowers.push(newFlower);

            //Then add that flower to the DOM
            var flowerFrameIndex = this.frameNumbers[this.currentFrame];
            var flowerDOM = newFlower.renderFlowerAtFrame(flowerFrameIndex);
            $(this.gardenContainer).append(flowerDOM);

        }

        if (retryCreation) {
            this.generateGarden();
        }

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