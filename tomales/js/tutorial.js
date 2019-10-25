class Tutorial {
    constructor(tutorialID) {
        this.currentStage = 0;
        this.maxStage = 2;
        this.tutorialContainer = tutorialID;
        this.stageURLs = ["assets/tutorial/pressdown/tutorial-pressdown", "assets/tutorial/letgo/tutorial-letgo"];
        this.frameNumbers = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
        this.finished = false;
    }

    start() {
        $(this.tutorialContainer).attr("src", this.calculateSrcAtFrame(20));
    }

    isFinished() {
        return this.finished;
    }

    reachedBottom(frameIndex) {
        if (frameIndex == 0) {

            if (this.currentStage == 0) {
                this.currentStage += 1;
            }
            return true;
        }

    }

    reachedTop(frameIndex) {
        if (frameIndex == this.frameNumbers.length - 1) {
            if (this.currentStage == 1) {
                this.currentStage += 1;
                this.finished = true;
                $(this.tutorialContainer).fadeOut("slow", function() {
                    console.log("Finished tutorial, faded out");
                });
            }
            return true;
        }
    }

    calculateSrcAtFrame(frameIndex) {
        var src = this.stageURLs[this.currentStage] + this.frameNumbers[frameIndex] + '.png';
        return src;
    }

    updateToIndex(frameIndex) {
        var _this = this;
        $(_this.tutorialContainer).attr("src", this.calculateSrcAtFrame(frameIndex));
    }

}
// Okay so the tutorial has three stages...
// The first stage is just an image, that disappears... great
// The second stage requires you to press DOWN until all the text disappears (I can also add a flower here..)
// Maybe we add some motivation at the transition
// At the *top* of the second stage, we switch into the third stage.. which then asks you to release 
// Then you must release all the way down...


// OKay lets just focus on the latter two stages - we should get an index , so lets use i