///////////////////////////////////////////////////////////////////
// The Ticker class controls scheduling and ticking 
// On press down, we tick +1, on release we tick -1
// 
///////////////////////////////////////////////////////////////////
class Ticker {

    constructor(interactivityElementID) {
        this.animations = [];
        var gardenAnimator = new GardenAnimator("#garden", 500, 500);
        this.tutorialAnimator = new TutorialAnimator("#tutorial", () => { this.animations[0] = gardenAnimator });
        this.animations[0] = this.tutorialAnimator;

        //Note: its feels fucking jank that we're randomly just using 20 here, but lets go with it for now
        var totalTime = 3000;
        this.waitTime = totalTime / 20;

        this.currentTick = 0;
        this.interactivityElement = document.getElementById(interactivityElementID);

        this.setupBindEvents();
        document.getElementById("loading-text").innerHTML = "Loading...";
        this.checkLoadingAndAnimate();
    }


    checkLoadingAndAnimate() {
      console.log(this);
      console.log(this.tutorialAnimator);
      if (this.tutorialAnimator.loaded) {
        document.getElementById("loading-text").innerHTML = "";
        this.animate();
      } else {
        setTimeout(() => this.checkLoadingAndAnimate(), 100);
      }
    }
    scheduler() {

    }

    //Kick things off
    setupBindEvents() {
        this.interactivityElement.addEventListener("mousedown", () => {
            this.currentTick = 1;
            this.interactivityElement.classList = "down"
        });
        this.interactivityElement.addEventListener("touchstart", () => { this.currentTick = 1 });
        this.interactivityElement.addEventListener("mouseup", () => {
            this.currentTick = -1;
            this.interactivityElement.classList = "up"
        });
        this.interactivityElement.addEventListener("touchend", () => { this.currentTick = -1 });
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    animate() {
        this.tickAllAnimators();
        setTimeout(() => { this.animate() }, this.waitTime);
    }

    //Main functions
    tickAllAnimators() {
        //displayProgress("Ticking.." + this.currentTick);

        for (var i = 0; i < this.animations.length; i++) {
            var animation = this.animations[i]; //Replace with array code when more than one animation
            animation.tick(this.currentTick);
        }
    }


}