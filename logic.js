const Player = function () {};
const GameBoard = (function () {
  let gameBoard = [];
})();

const touchButton = (function () {
  const onTouchStart = (event) => {
    event.target.classList.add("buttonActive");
  };

  const onTouchEnd = (event) => {
    event.target.classList.remove("buttonActive");
  };

  const active = function (button) {
    button.addEventListener("touchstart", onTouchStart);
    button.addEventListener("touchend", onTouchEnd);
  };

  const inert = function (button) {
    button.removeEventListener("touchstart", onTouchStart);
    button.removeEventListener("touchend", onTouchEnd);
  };

  return {
    active,
    inert,
  };
})();

const displayController = (function () {
  const screen = document.body;
  const startGameButton = document.querySelector("#start");

  const startGame = function () {
    touchButton.active(startGameButton);
    // touchButton.inert(startGameButton);

    startGameButton.onclick = function () {
      screen.classList.remove("greetScreen");
      touchButton.inert(startGameButton);
    };
  };

  return {
    startGame,
  };
})();

displayController.startGame();
