class Boid {

    constructor(image) {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = .2;
        this.maxSpeed = 4;
        this.perceptionRadius = 100;

        this.totalScroll = createVector();
        this.enableScrollforce;
        this.scrollFactor = .01;

        let useImage = false;

        if (useImage && image) {
            this.imageAsset = image;
        } else {
            this.imageAsset == undefined;
        }

    }

    edges() {
        //this.collideEdges();
        this.overflowEdges();
    }

    align(boids) {
        let desiredVelocity = createVector();
        let steeringForce = createVector();
        let numBoids = 0;

        //Go through every boid, and add up the velocities if its close to you
        for (let boid of boids) {
            let distanceBetweenBoids = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if (boid != this && distanceBetweenBoids < this.perceptionRadius) {
                desiredVelocity.add(boid.velocity);
                numBoids++;
            }
        }

        //If you found more than one boid close to you, then you can get the average velocity
        //The steering force is the force *towards* that point, which is the desired thing (avg velocity) - your thing
        if (numBoids > 0) {
            desiredVelocity.div(numBoids);
            desiredVelocity.setMag(this.maxSpeed);
            steeringForce = desiredVelocity.sub(this.velocity);
            this.acceleration.add(steeringForce);
        }

    }


    applyForce(boids) {
        //this.mouseForce();
        // this.windupForce();
        //this.enableScrollforce = false;
        this.align(boids);
        this.acceleration.limit(this.maxForce);
    }

    update() {
        this.edges();
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.velocity.limit(this.maxSpeed);
    }

    show() {

        fill(this.totalScroll.x, this.totalScroll.y, 0);
        noStroke();


        if (this.imageAsset) {
            let size = 20;
            image(this.imageAsset, this.position.x, this.position.y, size, size)
        } else {
            let size = 10;
            ellipse(this.position.x, this.position.y, size, size);
        }

        //Reset acceleration
        this.acceleration.mult(0);
    }

    //Helper functions for forces

    setScrollForce(event) {
        //TODO: When scrolling stops, reintroduce some randomness to get the thing going again, if it isn't already
        if (this.enableScrollforce) {
            let scrollMove = createVector(event.deltaX, event.deltaY);
            scrollMove.mult(this.scrollFactor);
            this.acceleration.add(scrollMove);
            this.totalScroll.add(scrollMove);
        }



        //Im using this for color, but really it should be a function of the accelration ?? 
    }

    mouseForce() {
        let mouseVector = createVector(mouseX, mouseY);
        mouseVector.sub(this.position);
        this.acceleration.add(mouseVector);
    }

    windupForce() {
        //Apply some random wind to it, upwards
        let windVector = createVector(0, -10);
        this.acceleration.add(windVector);
    }


    // Helper functions for EDGE behavior

    overflowEdges() {

        if (this.position.x > width) {
            this.position.x = 0;
        }
        if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        }
        if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    collideEdges() {
        if (this.position.x > width || this.position.x < 0) {
            this.velocity.x = this.velocity.x * -1;
        }

        if (this.position.y > height || this.position.y < 0) {
            this.velocity.y = this.velocity.y * -1;
        }
    }


}