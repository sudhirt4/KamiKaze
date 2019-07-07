function HomeScreen() {
  var that = this;

  var $elem = document.createElement("div");
  $elem.className = "home-screen";

  $startBtn = document.createElement("button");
  $startBtn.className = "home-screen__start-btn";
  $elem.appendChild($startBtn);

  this.$elem = $elem;
  this.$startBtn = $startBtn;

  this.display = function() {
    that.$elem.style.display = "block";
  };

  this.hide = function() {
    that.$elem.style.display = "none";
  };

  this.hide();
}

function GameScreen() {
  var that = this;

  var $elem = document.createElement("div");
  $elem.className = "game-screen";

  this.$elem = $elem;

  this.display = function() {
    that.$elem.style.display = "block";
  };

  this.hide = function() {
    that.$elem.style.display = "none";
  };

  this.hide();
}

function ResultScreen() {
  var that = this;

  var $elem = document.createElement("div");
  $elem.className = "result-screen";

  $elem.appendChild(document.createElement("hr"));

  var $gameOverText = document.createElement("div");
  $gameOverText.className = "result-screen__game-over";
  $gameOverText.innerHTML =
    "<p>Game Over</p>" + "<span>Press to return to main menu</span>";
  $elem.appendChild($gameOverText);

  var $feedbackElem = document.createElement("div");
  $feedbackElem.className = "result-screen__feedback";
  $elem.appendChild($feedbackElem);
  this.$feedbackElem = $feedbackElem;

  $elem.appendChild(document.createElement("hr"));

  var $yourScoreText = document.createElement("p");
  $yourScoreText.innerHTML = "Your score";
  $elem.appendChild($yourScoreText);

  var $scoreElem = document.createElement("div");
  $scoreElem.className = "result-screen__score";
  $elem.appendChild($scoreElem);
  this.$scoreElem = $scoreElem;

  this.$elem = $elem;

  this.display = function() {
    that.$elem.style.display = "block";
  };

  this.hide = function() {
    that.$elem.style.display = "none";
  };

  this.updateScore = function(score) {
    that.$scoreElem.innerHTML = "<span>" + score + "</span>";
  };

  this.hide();
}
