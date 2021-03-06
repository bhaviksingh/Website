class Tutorial {
    constructor(tutorialID) {
        this.currentStage = 0;
        this.maxStage = 2;
        this.tutorialContainer = tutorialID;
        this.stageURLs = ["assets/tutorial/down-2/down", "assets/tutorial/up-2/up"];
        this.frameNumbers = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];
        this.finished = false;
        this.preload()
    }

    start() {
        var maxFrame = this.frameNumbers.length - 1;
        $(this.tutorialContainer).attr("src", this.calculateSrcAtFrame(maxFrame));
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
        var frameToPlay = frameIndex;
        //To reverse the first stage 
        if (this.currentStage == 0) {
            frameToPlay = this.frameNumbers.length - frameIndex - 1;
        }
        var src = this.stageURLs[this.currentStage] + this.frameNumbers[frameToPlay] + '.png';
        return src;
    }

    updateToIndex(frameIndex) {
        var _this = this;
        $(_this.tutorialContainer).attr("src", this.calculateSrcAtFrame(frameIndex));
    }

    preload() {
        $(this.tutorialContainer).append("<div id='tutorial-preload' class='preload'> </div>");
        var _this = this;
        $.each(_this.stageURLs, function(index, stageURL) {
            for (var i = 0; i < _this.frameNumbers.length; i++) {
                var tutorialStageImg = $("<img src='" + stageURL + _this.frameNumbers[i] + ".png'>");
                $("#tutorial-preload").append(tutorialStageImg);
            };
        });
    }

}
// Okay so the tutorial has three stages...
// The first stage is just an image, that disappears... great
// The second stage requires you to press DOWN until all the text disappears (I can also add a flower here..)
// Maybe we add some motivation at the transition
// At the *top* of the second stage, we switch into the third stage.. which then asks you to release 
// Then you must release all the way down...


// OKay lets just focus on the latter two stages - we should get an index , so lets use i