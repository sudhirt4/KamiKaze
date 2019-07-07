function Hero(iProps) {
  var that = this;

  var INITIAL_X = 0;
  var INITIAL_Y = WORLD_HEIGHT - BLOCK_HEIGHT;
  var position = 0;

  var $elem = document.createElement("div");
  $elem.style.height = BLOCK_HEIGHT + "px";
  $elem.style.width = BLOCK_WIDTH + "px";
  $elem.className = "hero";

  this.x = iProps.x || INITIAL_X;
  this.y = iProps.y || INITIAL_Y;
  this.dy = SPEED;
  this.health = ENEMY_HEALTH;
  this.$elem = $elem;

  this.$elem.style.left = this.x + "px";
  this.$elem.style.top = this.y + "px";

  this.reset = function() {
    that.y = INITIAL_Y;
    that.x = INITIAL_X;
    that.$elem.style.top = that.y + "px";
    that.$elem.style.left = that.x + "px";
  };

  this.update = function() {
    that.$elem.style.left = that.x + "px";
  };

  this.move = function(dx) {
    if (dx < 0) {
      if (position > 0) {
        position -= 1;
        that.x = POSSIBLE_X[position];
        this.update();
      }
      return;
    }

    if (position < POSSIBLE_X.length - 1) {
      position += 1;
      that.x = POSSIBLE_X[position];
      this.update();
    }
  };
}
