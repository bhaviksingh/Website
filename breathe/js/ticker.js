class Ticker {

    constructor(interactivityElementID) {
        this.animations = [];
        var gardenAnimator = new GardenAnimator("#garden", 500, 500);
        this.animations[0] = gardenAnimator;

        //Note: its feels fucking jank that we're randomly just using 20 here, but lets go with it for now
        var totalTime = 3000;
        this.waitTime = totalTime / 20;

        this.currentTick = 0;
        this.interactivityElement = document.getElementById(interactivityElementID);

        this.setupBindEvents();
        this.animate();
    }


    //Kick things off
    setupBindEvents() {
        this.interactivityElement.addEventListener("mousedown", () => { this.currentTick = 1 });
        this.interactivityElement.addEventListener("touchstart", () => { this.currentTick = 1 });
        this.interactivityElement.addEventListener("mouseup", () => { this.currentTick = -1 });
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