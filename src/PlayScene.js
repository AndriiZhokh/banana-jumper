import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayGame');
  }

  init(data) {

  }

  preload() {
    this.background = this.load.image('sky', '../assets/sky.png');
    this.palm = this.load.image('palm', '../assets/palm_1.png');
    this.platform = this.load.image('platform', '../assets/platform_1.png');
    this.fakePlatform = this.load.image('fake-platform', '../assets/palm_platform.png');
    this.banana = this.load.image('banana', '../assets/banana_dude.png');
  }
  
  create() {
    this.timer = 0;
    this.background = this.add.image(175, 300, 'sky');
    this.palm = this.add.image(125, 200, 'palm').setScale(2);

    this.platforms = this.add.group();

    this.createOnePlatform(175, 600, 'platform');
    this.createPlatforms();

    this.banana = this.physics.add.sprite(175, 550, 'banana');
    this.banana.setGravityY(500);
    this.banana.setDepth(1);
    this.banana.body.stopVelocityOnCollide = false;

    this.createCollisions();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.scoreText = this.add.text(16, 16, 'score: 0 sec');
    this.scoreText.setDepth(1);
  }
  
  update() {
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
      this.timer += 1;
      this.scoreText.setText(`score: ${Math.floor(this.timer / 60)} sec`);
    }

    this.updatePlatforms();

    if(this.cursors.left.isDown) {
      this.banana.setVelocityX(-100);
    } else if (this.cursors.right.isDown) {
      this.banana.setVelocityX(100);
    } else {
      this.banana.setVelocityX(0);
    }    

    this.platforms.getChildren().forEach(platform => {
      if(platform.body.touching.up && platform.texture.key != 'fake-platform') {
        if(this.cursors.up.isDown && this.banana.body.touching.down) {
          this.startGame = true;
          this.banana.setVelocityY(-400);
        }
      }
    });
  }

  createOnePlatform(x, y, key) {
    this.platform = this.add.sprite(x, y, key);
    this.physics.add.existing(this.platform);

    if (key === 'platform') {
      this.platform.body.immovable = true;      
    }
    this.platform.body.checkCollision.down = false;
    this.platform.body.checkCollision.left = false;
    this.platform.body.checkCollision.right = false;
    this.platforms.add(this.platform);
  }

  createPlatforms() {
    const { width, height } = this.game.config;
    const { halfWidth } = this.platforms.children.entries[0].body;
    let h = height;
    for (let i = 0; i < height / 100; i++) {
      let rand = this.randomNum(halfWidth, width - halfWidth);
      let probability = this.randomNum(0, 100);
      h -= 100;
      if(probability > 90) {        
        this.createOnePlatform(rand, h, 'fake-platform');
      } else {
        this.createOnePlatform(rand, h, 'platform');
      }
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
    if (this.banana.y < 300) {
      this.platforms.getChildren().forEach((platform) => {
        platform.y += 4;
      });
    } else {
      this.platforms.getChildren().forEach((platform) => {
        platform.y += 1;
      });
    }
  }

  updatePlatforms() {
    const { width, height } = this.game.config;
    const { halfWidth } = this.platforms.children.entries[0].body;
    let rand = this.randomNum(halfWidth, width - halfWidth);
    let probability = this.randomNum(0, 100);

    if (this.platforms.getChildren()[this.platforms.getChildren().length - 1].y > 100) {
      if (probability > 90) {        
        this.createOnePlatform(rand, 0, 'fake-platform');
      } else {
        this.createOnePlatform(rand, 0, 'platform');
      }
      this.platforms.killAndHide(this.platforms.getChildren()[0]);
      this.platforms.remove(this.platforms.getChildren()[0]);

      this.createCollisions();
    }
  }
}

export default PlayScene;