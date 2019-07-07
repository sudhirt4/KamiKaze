function Game(iProps) {
  var that = this;

  var $elem = iProps.$elem;
  $elem.className = "kamikaze";
  $elem.style.width = WORLD_WIDTH + "px";
  $elem.style.height = WORLD_HEIGHT + "px";
  this.$elem = $elem;

  this.homeScreen = new HomeScreen();
  this.homeScreen.$startBtn.onclick = function() {
    that.homeScreen.hide();
    that.gameScreen.display();

    that.world.start();
  };
  this.$elem.appendChild(this.homeScreen.$elem);

  this.gameScreen = new GameScreen();
  this.$elem.appendChild(this.gameScreen.$elem);

  this.resultScreen = new ResultScreen();
  this.$elem.appendChild(this.resultScreen.$elem);

  this.resultScreen.$elem.onclick = function() {
    that.gameScreen.hide();
    that.resultScreen.hide();
    that.homeScreen.display();
  };

  this.homeScreen.display();

  this.$elem.appendChild(this.homeScreen.$elem);
  this.$elem.appendChild(this.gameScreen.$elem);
  this.$elem.appendChild(this.resultScreen.$elem);

  this.world = new World({
    $elem: this.gameScreen.$elem,
    onGameOver: function() {
      that.resultScreen.updateScore(that.world.distance);
      that.resultScreen.display();
    }
  });
}

var $container = document.getElementById("game");
var game = new Game({
  $elem: $container
});
