class Boid {

    constructor(boidController) {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.totalScroll = createVector();
        this.enableScrollforce = true;

        this.maxForce;
        this.maxSpeed;
        this.perceptionRadius;
        this.aForceLimit;
        this.sForceLimit;
        this.cForceLimit;
        this.alignFactor;
        this.cohesionFactor;
        this.separationFactor;
        this.updateParams(boidController);
        this.size;

        let useImage = false;
        this.imageAsset == undefined;

    }
    edges() {
        //this.collideEdges();
        this.overflowEdges();
    }

    //I should probably use a dictionary here
    updateParams(boidController) {
        this.aForceLimit = boidController.aForceLimit;
        this.sForceLimit = boidController.sForceLimit;
        this.cForceLimit = boidController.cForceLimit;

        this.maxForce = boidController.maxForce;
        this.maxSpeed = boidController.maxSpeed;
        this.perceptionRadius = boidController.perceptionRadius;
        this.alignFactor = boidController.alignFactor;
        this.cohesionFactor = boidController.cohesionFactor;
        this.separationFactor = boidController.separationFactor;
        this.size = boidController.size;
    }

    flock(boids) {

        let averageVelocity = createVector();
        let averagePosition = createVector();
        let averageMovementAway = createVector();
        let numBoids = 0;

        //Go through every boid, and add up the velocities if its close to you
        for (let boid of boids) {
            let distanceBetweenBoids = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if (boid != this && distanceBetweenBoids < this.perceptionRadius) {
                averageVelocity.add(boid.velocity);
                averagePosition.add(boid.position);

                //Calculate a vector away from the boid, inverseley proportional to the distance between us
                let vectorAwayFromPair = p5.Vector.sub(this.position, boid.position);
                vectorAwayFromPair.div(pow(distanceBetweenBoids, 2)); //TODO: note if distance between boids is 0 we're fucked!
                averageMovementAway.add(vectorAwayFromPair);

                numBoids++;
            }
        }

        if (numBoids == 0) {
            return;
        }

        averagePosition.div(numBoids);
        averageVelocity.div(numBoids);
        averageMovementAway.div(numBoids);
        //These now are the average Position and velocity of the boids group

        //Alignment force = force towards average velocity 
        let alignmentSteeringForce = createVector();
        alignmentSteeringForce = averageVelocity; //So start with average velocity  (mostly get direction)
        alignmentSteeringForce.setMag(this.maxSpeed); //Thrust ourselves towards it (make it max magnitude)
        alignmentSteeringForce.sub(this.velocity); // Then subtract our velocity to get the force

        //Cohesion steering force = force towards average position
        let cohesionSteeringForce = createVector();
        averagePosition.sub(this.position); //Average position is now the delta positions
        cohesionSteeringForce = averagePosition; //So the force is in direction of delta positions
        cohesionSteeringForce.setMag(this.maxSpeed); //With max magnitude
        cohesionSteeringForce.sub(this.velocity); //Minus my velocity 

        //Seperation force = average velocity away from everyone else, with mag inverseley proportional to their distances
        //We already have the velocity we need, it was calculated above so we just get the force
        let seperationSteeringForce = createVector();
        seperationSteeringForce = averageMovementAway;
        seperationSteeringForce.setMag(this.maxSpeed);
        seperationSteeringForce.sub(this.velocity)

        alignmentSteeringForce.mult(this.alignFactor);
        cohesionSteeringForce.mult(this.cohesionFactor);
        seperationSteeringForce.mult(this.separationFactor);

        alignmentSteeringForce.limit(this.aForceLimit);
        cohesionSteeringForce.limit(this.cForceLimit);
        seperationSteeringForce.limit(this.sForceLimit);


        this.acceleration.add(alignmentSteeringForce);
        this.acceleration.add(cohesionSteeringForce);
        this.acceleration.add(seperationSteeringForce);

    }


    applyForce(boids) {
        //this.mouseForce();
        //this.windupForce();
        this.flock(boids);
        //this.acceleration.limit(this.maxForce);
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
            image(this.imageAsset, this.position.x, this.position.y, this.size, this.size)
        } else {
            ellipse(this.position.x, this.position.y, this.size, this.size);
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