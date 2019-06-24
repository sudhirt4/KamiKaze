// JavaScript Document

var counter = 0;
var bullet_counter = 0;
var speedcounter = 0;
var score = 0;
var speed_dy = 1;

var game_status = "false";
var run;
var enemy_cars = [];
var invunerables_array = [];
var bullets = [];

var parent = document.getElementById("road");
var scoreboard = document.getElementById("score");
var progressbar = document.getElementById("progressbar");

var Frame = new Frame();
var protagonist_car = new ProtagonistCar();

function main() {
  console.log("main started");
  resetGame();
  protagonist_car.resetCar();
  game_status = "true";
  run = setInterval(MainGameLoop, 15);
}

//Classes -----------------------------------------------------------------------------------------------------
function MainGameLoop() {
  createEnemy();

  updateEnemies();
  updateBullets();

  collisionCheck();
  Frame.updateBackground();

  counter++;
  bullet_counter++;
  if (speed_dy <= 5) {
    speedcounter++;
    if (speedcounter >= 100) {
      speed_dy = speed_dy + 0.1;
      speedcounter = 0;
    }
  }
}

function Frame() {
  var that = this;
  this.background_y = 0;
  this.background_dy = 0;
  this.updateBackground = function() {
    that.background_dy = speed_dy;
    parent.style.backgroundPosition = "0px " + that.background_y + "px";
    that.background_y = that.background_y + that.background_dy;
    if (counter % 2 == 0) {
      score = score + 1;
    }
    scoreboard.innerHTML = score;

    progressbar.style.height = that.background_y / 50 + "px";
    if (that.background_y / 50 >= 500) {
      var feedbackgameover = document.getElementById("feedbackgameover");
      feedbackgameover.innerHTML = "Victory";
      gameOver();
      game_status = "false";
    }
  };
}

function ProtagonistCar() {
  var that = this;
  this.car_y = 0;
  this.car_x = 0;
  this.batman_car = document.getElementById("batman-car");
  this.resetCar = function() {
    that.car_y = 500;
    that.car_x = 150;
    that.batman_car.style.top = that.car_y + "px";
    that.batman_car.style.left = that.car_x + "px";
  };
  this.updateCar = function(e) {
    var dx = 0;
    if (e == 1 && that.car_x < 260) {
      dx = 110;
    } else if (e == -1 && that.car_x > 140) {
      dx = -110;
    } else {
      dx = 0;
    }

    that.car_x = that.car_x + dx;
    that.batman_car.style.left = that.car_x + "px";
  };
}

function Enemy() {
  this.x = 0;
  this.y = -100;
  this.dy = 0;
  this.health = 5;
  var that = this;
  this.elem_id = document.createElement("div");
  this.createEnemy = function() {
    that.elem_id.className = "enemy-car"; //style
    that.x = randomGenerator();
    that.elem_id.style.left = that.x + "px";
    that.elem_id.style.top = that.y + "px";
    parent.appendChild(that.elem_id);
  };
  this.updateEnemy = function() {
    that.dy = speed_dy;
    var t = that.y + that.dy;
    that.y = t;
    that.elem_id.style.top = that.y + "px";
  };
  this.deleteEnemy = function() {
    parent.removeChild(that.elem_id);
  };
}

function Bullet() {
  var that = this;
  this.bullet_x = 0;
  this.bullet_y = 0;
  this.dy = 10;
  this.elem_id = document.createElement("div");

  this.createBullet = function() {
    that.elem_id.className = "bullets"; //style
    that.bullet_x = protagonist_car.car_x + 45;
    that.bullet_y = protagonist_car.car_y;
    that.elem_id.style.left = that.bullet_x + "px";
    that.elem_id.style.top = that.bullet_y + "px";
    parent.appendChild(that.elem_id);
  };
  this.updateBullet = function() {
    var t = that.bullet_y - that.dy;
    that.bullet_y = t;
    that.elem_id.style.top = that.bullet_y + "px";
  };
  this.deleteBullet = function() {
    parent.removeChild(that.elem_id);
  };
}

//FUNCTIONS --------------------------------------------------------------------------------------------------
function createEnemy() {
  if (counter > 80 - speed_dy * 3) {
    //if(Math.random()<0.1)
    var e = new Enemy();
    enemy_cars.push(e);
    e.createEnemy();
    counter = 0;
  }
}

function updateEnemies() {
  var enemies = enemy_cars;
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].updateEnemy();
    if (enemies[i].y > 600) {
      enemies[i].deleteEnemy();
      enemies[i] = null;
      enemy_cars = clearArray(enemies);
    }
  }
}

function updateBullets() {
  var temp_bullets = bullets;
  for (var i = 0; i < temp_bullets.length; i++) {
    temp_bullets[i].updateBullet();
    if (temp_bullets[i].bullet_y < 0) {
      temp_bullets[i].deleteBullet();
      temp_bullets[i] = null;
      bullets = clearArray(temp_bullets);
    }
  }
}

function collisionCheck() {
  var car_y = protagonist_car.car_y;
  var car_x = protagonist_car.car_x;
  var ex;
  var ey;
  var bx;
  var by;

  //Collision check for game-over
  var etemp = enemy_cars;
  var el = etemp.length;
  var itemp = invunerables_array;
  var il = itemp.length;
  var btemp = bullets;
  var bl = btemp.length;

  for (var i = 0; i < el; i++) {
    ex = etemp[i].x;
    ey = etemp[i].y;
    if (
      ex + 90 > car_x && //right edge of e > left edge of car
      ex <= car_x + 90 && //left edge of e < right edge of car
      ey + 90 > car_y && //bottom edge of e > top edge of car
      ey <= car_y + 90 //top edge of e > bottom edge of car
    ) {
      explodeAnim(car_x, car_y);
      var feedbackgameover = document.getElementById("feedbackgameover");
      feedbackgameover.innerHTML = "Game Over";
      gameOver();
      game_status = "false";
    }

    //Collision check for bullets
    for (var j = 0; j < bl; j++) {
      if (btemp[j] != null) {
        bx = btemp[j].bullet_x;
        by = btemp[j].bullet_y;

        if (
          ex + 90 > bx && //right edge of e > left edge of bullet
          ex <= bx + 10 && //left edge of e < right edge of bullet
          ey + 70 > by && //bottom edge of e > top edge of bullet
          ey <= by + 10 //top edge of e > bottom edge of bullet
        ) {
          btemp[j].deleteBullet();
          btemp[j] = null;

          hitAnim(ex, ey);
          etemp[i].health = etemp[i].health - 1;
          if (etemp[i].health <= 0) {
            explodeAnim(ex, ey);
            etemp[i].deleteEnemy();
            etemp[i] = null;
            score = score + 50;
          }
        }
      }
    } //for j end
  } //for i end

  bullets = clearArray(btemp);
  enemy_cars = clearArray(etemp);
}

function hitAnim(ex, ey) {
  var hit_id = document.createElement("div");
  hit_id.className = "explosion"; //style
  hit_id.style.left = ex - 10 + "px";
  hit_id.style.top = ey + "px";
  parent.appendChild(hit_id);
  hit_id.style.backgroundPosition = "0px " + "0px";

  var animate = setInterval(updateAnimate, 13);
  var animcounter = 0;
  function updateAnimate() {
    if (animcounter >= 1) {
      parent.removeChild(hit_id);
      clearInterval(animate);
    }
    animcounter++;
  }
}

function explodeAnim(ex, ey) {
  var explode_id = document.createElement("div");
  explode_id.className = "explosion"; //style
  explode_id.style.left = ex + "px";
  explode_id.style.top = ey + "px";
  parent.appendChild(explode_id);

  var animate = setInterval(updateAnimate, 15);
  var animcounter = 0;
  function updateAnimate() {
    if (animcounter == 2) {
      explode_id.style.backgroundPosition = "0px " + "0px";
    }
    if (animcounter == 4) {
      explode_id.style.backgroundPosition = "118px " + "0px";
    }
    if (animcounter == 6) {
      explode_id.style.backgroundPosition = "236px " + "0px";
    }
    if (animcounter == 8) {
      explode_id.style.backgroundPosition = "354px " + "0px";
    }
    if (animcounter == 10) {
      explode_id.style.backgroundPosition = "472px " + "0px";
    }
    if (animcounter >= 12) {
      parent.removeChild(explode_id);
      clearInterval(animate);
    }
    console.log(animcounter);
    animcounter++;
  }
}

function gameOver() {
  clearInterval(run);
  var gameover_background = document.getElementById("gameover-background");
  gameover_background.style.display = "block";

  var score_display = document.getElementById("score-display");
  score_display.innerHTML = score;
}

function resetGame() {
  var enemies = enemy_cars;
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].deleteEnemy();
    enemies[i] = null;
  }
  enemy_cars = clearArray(enemies);

  var bullets_temp = bullets;
  for (var i = 0; i < bullets_temp.length; i++) {
    bullets_temp[i].deleteBullet();
    bullets_temp[i] = null;
  }
  bullets = clearArray(bullets_temp);

  gamestatus = "true";
  Frame.background_y = 0;
  counter = 0;
  bullet_counter = 0;
  speedcounter = 0;
  invulcounter = 0;
  speed_dy = 1;
  score = 0;

  var gameover_background = document.getElementById("gameover-background");
  gameover_background.style.display = "none";
}

function randomGenerator() {
  var random = Math.random();
  if (random >= 0 && random < 0.33) {
    return 40;
  } else if (random >= 0.33 && random < 0.66) {
    return 150;
  } else {
    return 260;
  }
}

function clearArray(input) {
  var temp = [];
  var l = input.length;
  for (var i = 0; i < l; i++) {
    if (input[i] != null) {
      temp.push(input[i]);
    }
  }
  return temp;
}

function keydownEventHandler(e) {
  console.log(e.keyCode);
  if (game_status == "true") {
    if (e.keyCode == 37) {
      //left
      protagonist_car.updateCar(-1);
    }

    if (e.keyCode == 39) {
      //right
      protagonist_car.updateCar(+1);
    }

    if (e.keyCode == 32) {
      //left
      if (bullet_counter >= 9) {
        var e = new Bullet();
        bullets.push(e);
        e.createBullet();
        bullet_counter = 0;
      }
    }

    if (e.keyCode == 27) {
      gameOver();
      resetGame();
      var homescreen = document.getElementById("homescreen");
      homescreen.style.display = "block";
    }
  } else {
    if (e.keyCode == 27) {
      var homescreen = document.getElementById("homescreen");
      homescreen.style.display = "block";
    }
  }
}

function keyupEventHandler(e) {}

document.onkeydown = keydownEventHandler;
document.onkeyup = keyupEventHandler;

//HomeScreen --------------------------------------------------------------------------------------------

var start_button = document.getElementById("start-button");
start_button.onclick = function() {
  var homescreen = document.getElementById("homescreen");
  homescreen.style.display = "none";
  main();
};

//GameScreen ----------------------------------------------------------------------------------------------
var left_nav = document.getElementById("lnav");
var shoot_nav = document.getElementById("shootnav");
var right_nav = document.getElementById("rnav");

left_nav.onclick = function() {
  if (game_status == "true") {
    protagonist_car.updateCar(-1);
  }
};
shoot_nav.onclick = function() {
  if (game_status == "true") {
    if (bullet_counter >= 9) {
      var e = new Bullet();
      bullets.push(e);
      e.createBullet();
      bullet_counter = 0;
    }
  }
};
right_nav.onclick = function() {
  if (game_status == "true") {
    protagonist_car.updateCar(+1);
  }
};

//GameOver Screen ------------------------------------------------------------------------------------

var gameover_screen = document.getElementById("gameover-background");
gameover_screen.onclick = function() {
  var homescreen = document.getElementById("homescreen");
  homescreen.style.display = "block";
};
