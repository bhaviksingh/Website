class TutorialAnimator {

    constructor(tutorialID, finishCallback) {

        //DOM 
        this.tutorialImage = $("<img id='tutorial-image'>");
        this.tutorialContainer = $(tutorialID);
        this.tutorialContainer.html(this.tutorialImage);

        //Data
        this.stageURLs = ["assets/tutorial/down/down", "assets/tutorial/up/up"];
        this.frameNumbers = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];

        //Playback
        this.currentStage = 0;
        this.currentFrame = 0;
        this.tutorialFinishedCallback = finishCallback;
    }

    //DOM manipulation

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

    renderCurrentFrame() {
        var baseURL = this.stageURLs[this.currentStage];
        var frameURL = this.frameNumbers[this.currentFrame];
        var imageURL = baseURL + frameURL + ".png";
        $(this.tutorialImage).attr("src", imageURL);
    }

    //Animation

    getMaxFrameNum() {
        return this.frameNumbers.length - 1;
    }

    limitCurrentFrame() {
        if (this.currentFrame <= 0)
            this.currentFrame = 0;

        if (this.currentFrame >= this.getMaxFrameNum())
            this.currentFrame = this.getMaxFrameNum();
    }

    manageStages() {
        displayProgress("Tutorial frame" + this.currentFrame + " stage" + this.currentStage);

        if (this.currentStage == 0 && this.currentFrame >= this.getMaxFrameNum()) {
            this.currentStage = 1;
        }

        if (this.currentStage == 1 && this.currentFrame <= 1) {
            this.currentStage = -1;
            this.tutorialContainer.html("");
            this.tutorialFinishedCallback();
        }
    }

    tick(currentTick) {
        if (this.currentStage != -1) {
            this.currentFrame += currentTick;
            this.manageStages();
            this.limitCurrentFrame();
            this.renderCurrentFrame();
        }

    }


}