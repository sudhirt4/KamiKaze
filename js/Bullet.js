function Bullet(iProps) {
  var that = this;

  var $elem = document.createElement("div");
  $elem.className = "bullet";

  this.x = iProps.x || 0;
  this.y = iProps.y || 0 - Bullet.HEIGHT;
  this.dy = Bullet.SPEED;
  this.health = Bullet.HEALTH;
  this.$elem = $elem;

  this.$elem.style.left = this.x + "px";
  this.$elem.style.top = this.y + "px";

  this.update = function() {
    that.y = that.y - that.dy;
    that.$elem.style.top = that.y + "px";
  };
}

Bullet.HEIGHT = 100;
Bullet.SPEED = 10;
