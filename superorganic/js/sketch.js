//Performance via https://github.com/processing-js/processing-js/issues/92
//Also using quad trees? 

const boids = [];

var boidControllerInterface = function() {
    this.maxForce = 0.2;
    this.maxSpeed = 15;
    this.perceptionRadius = 100;
    this.scrollFactor = 0;
    this.alignFactor = 1;
    this.cohesionFactor = 1;
    this.separationFactor = 1;
    this.size = 6;
    this.sForceLimit = 0.2;
    this.cForceLimit = 0.2;
    this.aForceLimit = 0.2;
};

var boidController = new boidControllerInterface();
var numBoids = 100;

function setup() {

    createCanvas(windowWidth, windowHeight);
    var gui = new dat.GUI();
    gui.add(boidController, 'maxForce', 0.1, 3).step(.1);
    gui.add(boidController, 'maxSpeed', 1, 50).step(1);
    gui.add(boidController, 'perceptionRadius', 1, 500).step(10);
    gui.add(boidController, 'scrollFactor', 0, 2).step(.1);
    gui.add(boidController, 'alignFactor', 0, 2).step(.1);
    gui.add(boidController, 'cohesionFactor', 0, 2).step(.1);
    gui.add(boidController, 'separationFactor', 0, 2).step(.1);
    gui.add(boidController, 'size', 2, 20).step(1);
    gui.add(boidController, 'sForceLimit', 0.1, 3).step(.1);
    gui.add(boidController, 'aForceLimit', 0.1, 3).step(.1);
    gui.add(boidController, 'cForceLimit', 0.1, 3).step(.1);

    for (var i = 0; i < numBoids; i++) {
        var boid = new Boid(boidController);
        boids.push(boid);
    }

    // loadImage('../assets/images/emoji.png', img => {

    // });

}

function draw() {
    clear();
    for (let boid of boids) {
        boid.updateParams(boidController);
        boid.applyForce(boids);
    }
    for (let boid of boids) {
        boid.update();
        boid.show();
    }
}

function mouseWheel(event) {
    console.log(event);
    for (let boid of boids) {
        boid.setScrollForce(event);
    }
    return false;
}