class GameState extends Phaser.State {
  init() {

    // Resize and align game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // Don't pause game if focus is lost
    this.stage.disableVisibilityChange = true;
  }

  preload() {
    this.load.image("doggy", "images/dog.png");
    this.load.image("sky", "images/sky.png");
    this.load.image("star", "images/collectable.png");
    this.load.image("enemy", "images/grammy.png");
  }

  createStars() {

    this.star_set = this.game.add.group();
    this.star_set.enableBody = true;
    this.star_set.physicsBodyType = Phaser.Physics.P2JS;

    var number_stars = 5;

    var y_offset = 100;
    var x_offset = 0;

    for (var i = 1; i <= number_stars; i++) {

      var star = this.star_set.create(x_offset, y_offset, "star")

      //Set bounds
      star.body.setRectangle(100,100);
      star.width = 100;
      star.height = 100;

      //Set collisions
      star.body.setCollisionGroup(this.starCollisionGroup);
      star.body.collides(this.doggyCollisionGroup);
      star.body.static = true;

      y_offset += 200;

      x_offset += 40;
      if (x_offset > 160) {
        x_offset = 0;
      }

      this.game.add.tween(star.body).to( {x: 1000 + x_offset}, 5000, Phaser.Easing.Linear.None, true, 0, false).yoyo(true);
    }

  this.dog.body.collides(this.starCollisionGroup, this.collectStar, this);
  }

  create() {
    this.add.image(0, 0, 'sky');

    //PHYSICS TIMEEEE

    // Physics
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.restitution = 0.2;
    // this.game.physics.p2.gravity.y = 1800;
    this.game.physics.p2.friction = 1;
    this.game.physics.p2.setImpactEvents(true);

    this.doggyCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.starCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();

    this.game.physics.p2.updateBoundsCollisionGroup();

    //Set up our enemy 
    this.enemy = this.add.sprite(0, 0, "enemy");
    this.enemy.width = 100;
    this.enemy.height = 100;
    this.enemy.enableBody = true;
    this.moveEnemy = true;

    this.game.physics.p2.enable(this.enemy);
    this.enemy.body.setCollisionGroup(this.enemyCollisionGroup);

    console.log(this.enemy);

    //Set up our doggy
    this.dog = this.add.sprite(500,250, "doggy");
    this.dog.width = 100;
    this.dog.height = 150;

    this.dog.enableBody = true;
    this.game.physics.p2.enable(this.dog);
    this.dog.body.setCollisionGroup(this.doggyCollisionGroup);

    //Set up collisions for enemy and dog
    this.enemy.body.collides(this.doggyCollisionGroup);
    this.dog.body.collides(this.enemyCollisionGroup, this.collideEnemy, this);


    //Set up our stars
    this.createStars();

    // Text
    const textStyle = {
      fill: "#fff",
      fontSize: 52,
      font: "Helvetica, Roboto, Arial, sans-serif",
      boundsAlignH: "center",
      boundsAlignV: "top"
    };

    // Text: Score
    this.score = 0;
    this.scoreText = this.game.add.text(0, 0, "", {
      ...textStyle,
      fontWeight: "bold",
    });
    this.scoreText.setTextBounds(0, 110, 1000, 0);

    // Layering
    this.game.world.bringToTop(this.scoreText);
    this.game.world.bringToTop(this.dog);
  }

  collectStar(dog_collided, star_collided) {
    
    this.score += 1;

    star_collided.sprite.kill();

    console.log(this.star_set);
    var one_alive = false;

    for (var i=0; i< this.star_set.children.length; i++) {
      if (this.star_set.children[i].alive) {
        one_alive = true;
      }
    }

    if (!one_alive) {
      this.createStars()
    }
   
  }

  collideEnemy(dog_collided, enemy_collided) {
    this.score -= 20;
  }

  // } 

  updateScore() {
    this.scoreText.setText(`Score: ${this.score}`);
  }

  updateEnemyMotion() {
    this.game.add.tween(this.enemy.body).to( {x: this.game.world.randomX, y: this.game.world.randomY}, 2000, Phaser.Easing.Linear.None, true, 0, false);
    this.moveEnemy = true;
  }

  update() {

    if (this.moveEnemy) {
      var timer = this.game.time.create(false);
      timer.loop(2005, this.updateEnemyMotion, this);
      this.moveEnemy = false;
      timer.start();  
    }
  
    if (this.input.activePointer.isDown) {
  
      this.dog.body.angularVelocity -= .05;

      // X movement
      if (this.input.x > 500) {
        this.dog.body.velocity.x += 20;
        // console.log("Moving right");
      }  else if (this.input.x < 500) {
        
        this.dog.body.velocity.x -= 20;
        // console.log("Moving left"); 
      } else {
        // console.log("Moving edge case");
      }

      //Y movement 
      if (this.input.y > 500) {
        this.dog.body.velocity.y += 20;
        // console.log("Moving up");
      } else if (this.input.y < 500) {
        this.dog.body.velocity.y -= 20;
        // console.log("Moving down");
      }
    }

    this.updateScore();
  }
}

var config = { 
  width: 1000,
  height: 1000,
  antialias: true,
  transparent: true,
  renderer: Phaser.CANVAS,
  state: GameState
}

// Start game
new Phaser.Game(config);