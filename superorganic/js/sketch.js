const boids = [];

function setup() {
    createCanvas(windowWidth, windowHeight);

    loadImage('../assets/images/emoji.png', img => {
        for (var i = 0; i < 100; i++) {
            boids.push(new Boid(img));
        }
    });

}

function draw() {
    clear();
    for (let boid of boids) {
        boid.applyForce(boids);
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