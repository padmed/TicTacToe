const Player = function () {};
const GameBoard = (function () {
  let Player1, Player2;
  let gameBoard = [];

  const setOpponent = function (opponent) {};
  return {
    setOpponent,
  };
})();

const TouchButton = (function () {
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
  const opponentButtons = document.querySelectorAll(".opponent");

  const startGame = function () {
    TouchButton.active(startGameButton);
    startGameButton.onclick = () => {
      screen.classList.remove("greetScreen");
      TouchButton.inert(startGameButton);
      setTimeout(() => {
        chooseOpponent();
      }, 300);
    };
  };

  const chooseOpponent = function () {
    screen.classList.add("opponentScreen");
    opponentButtons.forEach((button) => {
      TouchButton.active(button);

      button.onclick = (event) => {
        const opponent = event.target.id;
        GameBoard.setOpponent(opponent);
        opponentButtons.forEach((btn) => {
          TouchButton.inert(btn);
        });
      };
    });
  };
  return {
    startGame,
  };
})();

displayController.startGame();
