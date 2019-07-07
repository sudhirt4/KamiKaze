function World(iProps) {
  var that = this;

  var hero = new Hero({});
  var onGameOver = iProps.onGameOver || function() {};

  var isGameInProgress = false;

  this.hero = hero;
  this.enemies = [];
  this.bullets = [];
  this.distance = 0;
  this.$elem = iProps.$elem;

  this.gameLoop = undefined;

  this.$elem.appendChild(this.hero.$elem);

  document.onkeydown = keydownEventHandler;

  this.init = function() {};

  this.start = function() {
    that.reset();
    isGameInProgress = true;
    that.gameLoop = setInterval(gameLoop, 15);
  };

  this.stop = function() {
    isGameInProgress = false;
    if (!that.gameLoop) return;
    clearInterval(that.gameLoop);
  };

  this.reset = function() {
    that.bullets.forEach(function(bullet) {
      removeElement(bullet.$elem);
    });
    that.bullets = [];

    that.enemies.forEach(function(enemy) {
      removeElement(enemy.$elem);
    });
    that.enemies = [];

    that.distance = 0;

    that.hero.reset();
  };

  function gameLoop() {
    updateBackground();

    if (that.distance % ENEMY_GAP === 0) {
      createEnemy();
    }

    that.distance = that.distance + 1;

    updateEnemies();
    updateBullets();

    var hasCollied = checkHeroCollision();

    if (hasCollied) {
      explodeAnimation(that.hero);
      that.stop();
      onGameOver();
      return;
    }
  }

  function removeElement(elem) {
    that.$elem.removeChild(elem);
  }

  function createEnemy() {
    var createdCount = 0;
    for (var i = 0; i < POSSIBLE_X.length; i++) {
      var currX = POSSIBLE_X[i];
      var random = Math.random();
      if (random > 0.5 + createdCount * 0.2) {
        continue;
      }
      createdCount += 1;
      var enemy = new Enemy({
        x: currX,
        y: 0 - BLOCK_HEIGHT
      });
      that.$elem.appendChild(enemy.$elem);
      that.enemies.push(enemy);
    }
  }

  function createBullet() {
    var bullet = new Bullet({
      x: that.hero.x + BLOCK_WIDTH / 2 - BULLET_SIZE / 2,
      y: that.hero.y - BULLET_SIZE
    });
    that.$elem.appendChild(bullet.$elem);
    that.bullets.push(bullet);
  }

  function updateEnemies() {
    for (var i = 0; i < that.enemies.length; i++) {
      var enemy = that.enemies[i];
      enemy.update();

      if (enemy.y > WORLD_HEIGHT || enemy.health <= 0) {
        removeElement(enemy.$elem);
        that.enemies[i] = null;
      }
    }

    that.enemies = filterNull(that.enemies);
  }

  function updateBullets() {
    for (var i = 0; i < that.bullets.length; i++) {
      var bullet = that.bullets[i];
      bullet.update();

      var collidedEnemy = checkBulletCollision(bullet);
      if (collidedEnemy) {
        collidedEnemy.decreaseHealth();
        explodeAnimation(collidedEnemy);
      }

      if (bullet.y < 0 || collidedEnemy) {
        removeElement(bullet.$elem);
        that.bullets[i] = null;
      }
    }

    that.bullets = filterNull(that.bullets);
  }

  function checkHeroCollision() {
    var hero = that.hero;

    for (var i = 0; i < that.enemies.length; i++) {
      var enemy = that.enemies[i];
      if (
        enemy.x + BLOCK_WIDTH > hero.x &&
        enemy.x < hero.x + BLOCK_WIDTH &&
        enemy.y + BLOCK_HEIGHT > hero.y &&
        enemy.y < hero.y + BLOCK_HEIGHT
      ) {
        return true;
      }
    }
    return false;
  }

  function checkBulletCollision(bullet) {
    for (var i = 0; i < that.enemies.length; i++) {
      var enemy = that.enemies[i];
      if (
        enemy.x + BLOCK_WIDTH > bullet.x &&
        enemy.x < bullet.x + BULLET_SIZE &&
        enemy.y + BLOCK_HEIGHT > bullet.y &&
        enemy.y < bullet.y + BULLET_SIZE
      ) {
        return enemy;
      }
    }
    return null;
  }

  function updateBackground() {
    that.$elem.style.backgroundPosition = "0px " + that.distance + "px";
  }

  function explodeAnimation(block) {
    var $anim = document.createElement("div");
    $anim.className = "explosion"; //style
    $anim.style.left = block.x + "px";
    $anim.style.top = block.y + "px";
    $anim.style.backgroundPosition = "0px " + "0px";

    that.$elem.appendChild($anim);

    var animcounter = 0;
    var animate = setInterval(function updateAnimate() {
      if (animcounter >= 1) {
        that.$elem.removeChild($anim);
        clearInterval(animate);
      }
      animcounter++;
    }, 12);
  }

  function keydownEventHandler(e) {
    if (!isGameInProgress) {
      return;
    }

    if (e.keyCode == 37) {
      hero.move(-1);
    }

    if (e.keyCode == 39) {
      hero.move(1);
    }

    if (e.keyCode == 32) {
      createBullet();
    }

    if (e.keyCode == 27) {
      that.stop();
      onGameOver();
    }
  }
}
