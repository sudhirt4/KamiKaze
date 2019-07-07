function Enemy(iProps) {
  var that = this;

  var ENEMY_WIDTH = WORLD_WIDTH / LANES;
  var ENEMY_HEIGHT = BLOCK_HEIGHT;

  var $elem = document.createElement("div");
  $elem.className = "enemy";
  $elem.style.height = ENEMY_HEIGHT + "px";
  $elem.style.width = ENEMY_WIDTH + "px";

  this.x = iProps.x || 0;
  this.y = iProps.y || 0;
  this.dy = SPEED;
  this.health = ENEMY_HEALTH;
  this.$elem = $elem;

  this.$elem.style.left = this.x + "px";
  this.$elem.style.top = this.y + "px";

  this.update = function() {
    that.y = that.y + that.dy;
    that.$elem.style.top = that.y + "px";
  };

  this.decreaseHealth = function() {
    that.health -= 1;
  };
}
