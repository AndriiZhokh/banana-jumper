class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayGame');
  }

  init(data) {

  }

  preload() {
    this.background = this.load.image('sky', '../assets/sky.png');
    this.platform = this.load.image('platform', '../assets/platform_1.png');
    this.banana = this.load.image('banana', '../assets/banana_dude.png');
  }
  
  create() {
    this.timer = 0;
    this.background = this.add.image(175, 300, 'sky');

    this.platforms = this.add.group();

    this.createOnePlatform(175, 600);
    this.createPlatforms();

    this.banana = this.physics.add.sprite(175, 550, 'banana');
    this.banana.setGravityY(500);
    this.banana.setDepth(1);

    this.createCollisions();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.scoreText = this.add.text(16, 16, 'score: 0 sec');
    this.scoreText.setDepth(1);
    console.log(this.banana);
    console.log(this.platforms);
  }
  
  update() {
    this.timer += 1;
    this.scoreText.setText(`score: ${Math.floor(this.timer / 60)} sec`);

    if (this.banana.y > this.game.config.height) {
      this.scene.start('PlayGame');
      this.startGame = false;
    }

    if (this.banana.y < 0) {
      this.scene.start('MenuScene', {
        greeting: 'Congratulations',
        result: Math.floor(this.timer / 60),
      });
      this.startGame = false;
    }

    if(this.startGame) {
      this.movePlatform();
    }

    if(this.platforms.getChildren()[0].y > 650) {
      let rand = this.randomNum(0, 350);
      this.platforms.killAndHide(this.platforms.getChildren()[0]);
      this.platforms.remove(this.platforms.getChildren()[0]);
      this.createOnePlatform(rand, 0);
      this.createCollisions();
    }

    if(this.cursors.left.isDown) {
      this.banana.setVelocityX(-100);
    } else if (this.cursors.right.isDown) {
      this.banana.setVelocityX(100);
    } else {
      this.banana.setVelocityX(0);
    }

    if(this.cursors.up.isDown && this.banana.body.touching.down) {
      this.startGame = true;
      this.banana.setVelocityY(-350);
    }
  }

  createOnePlatform(x, y) {
    this.platform = this.add.sprite(x, y, 'platform');
    this.physics.add.existing(this.platform);
    this.platform.body.immovable = true;
    this.platform.body.checkCollision.down = false;
    this.platform.body.checkCollision.left = false;
    this.platform.body.checkCollision.right = false;
    this.platforms.add(this.platform);
  }

  createPlatforms() {
    const { width, height } = this.game.config;
    const { width: platformWidth } = this.platforms.children.entries[0];
    let h = height;
    for (let i = 0; i < height / 100; i++) {
      let rand = this.randomNum(platformWidth / 2, width - (platformWidth / 2));
      h -= 100;
      this.createOnePlatform(rand, h);
    }
  }

  randomNum(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }

  createCollisions() {
    this.platforms.children.entries.forEach((platform) => {
      this.physics.add.collider(this.banana, platform);
    });
  }

  movePlatform() {
    if (this.banana.y < 400) {
      this.platforms.getChildren().forEach((platform) => {
        platform.y += 4;
      });
    } else {
      this.platforms.getChildren().forEach((platform) => {
        platform.y += 1;
      });
    }
  }
}

export default PlayScene;