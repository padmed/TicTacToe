const Player = function () {
  let playerName = null;
  let shape = null;
  let score = 0;
  let picksShape = false;

  const setPlayerName = function (name) {
    playerName = name;
  };
  const getPlayerName = function () {
    return playerName;
  };

  const checkShapePicker = function () {
    return picksShape;
  };

  const letPickShape = function () {
    picksShape = true;
  };

  const getPlayerShape = function () {
    return shape;
  };

  const setPlayerShape = function (newShape) {
    shape = newShape;
  };

  const getScore = function () {
    return score;
  };

  const incrementScore = function () {
    ++score;
  };

  return {
    setPlayerName,
    getPlayerName,
    getPlayerShape,
    setPlayerShape,
    getScore,
    incrementScore,
    checkShapePicker,
    letPickShape,
  };
};

const Bot = function () {
  const bot = Player();
  let difficulity = null;

  const setDifficulity = function (difficulityLevel) {
    difficulity = difficulityLevel;
  };

  const getDifficulity = function () {
    return difficulity;
  };

  return Object.assign({}, bot, { setDifficulity, getDifficulity });
};

const GameBoard = (function () {
  let player = Player();
  let opponent = null;
  let gameBoard = [];

  const setOpponent = function (newOpponent) {
    opponent = newOpponent;
  };

  const getOpponent = function () {
    return opponent;
  };

  const getPlayer = function () {
    return player;
  };

  const getRandomPlayer = function () {
    const bothPlayers = [player, opponent];
    const randomIndex = Math.floor(Math.random() * 2);

    return bothPlayers[randomIndex];
  };

  return {
    setOpponent,
    getRandomPlayer,
    getOpponent,
    getPlayer,
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

  const activeMultiple = function (buttons) {
    buttons.forEach((button) => {
      button.addEventListener("touchstart", onTouchStart);
      button.addEventListener("touchend", onTouchEnd);
    });
  };

  const inertMultiple = function (buttons) {
    buttons.forEach((button) => {
      button.removeEventListener("touchstart", onTouchStart);
      button.removeEventListener("touchend", onTouchEnd);
    });
  };

  return {
    active,
    inert,
    activeMultiple,
    inertMultiple,
  };
})();

const displayController = (function () {
  const screen = document.body;
  const startGameButton = document.querySelector("#start");
  const opponentButtons = document.querySelectorAll(".opponent");
  const difficulityButtons = document.querySelectorAll(".difficulity");
  let player = GameBoard.getPlayer();
  let opponent;

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

  const opponentEventHandler = function (event) {
    const opponentID = event.target.id;

    if (opponentID === "bot") {
      player.setPlayerName("You");
      GameBoard.setOpponent(Bot());
      opponent = GameBoard.getOpponent();
      opponent.setPlayerName("Bot");
    } else {
      player.setPlayerName("Player 1");
      GameBoard.setOpponent(Player());
      opponent = GameBoard.getOpponent();
      opponent.setPlayerName("Player 2");
    }

    TouchButton.inertMultiple(opponentButtons);
    screen.classList.remove("opponentScreen");
  };

  const chooseOpponent = function () {
    screen.classList.add("opponentScreen");
    TouchButton.activeMultiple(opponentButtons);

    opponentButtons.forEach((button) => {
      button.onclick = (event) => {
        const opponentID = event.target.id;

        opponentEventHandler(event);
        setTimeout(() => {
          if (opponentID === "bot") {
            chooseDifficulity();
          } else {
            chooseShape();
          }
        }, 300);
      };
    });
  };

  const difficulityEventHandler = function (event) {
    const difficulityID = event.target.id;

    if (difficulityID === "easy") {
      opponent.setDifficulity("Easy");
    } else if (difficulityID === "medium") {
      opponent.setDifficulity("Medium");
    } else {
      opponent.setDifficulity("Hard");
    }

    TouchButton.inertMultiple(difficulityButtons);
    screen.classList.remove("difficulityScreen");
  };

  const chooseDifficulity = function () {
    screen.classList.add("difficulityScreen");
    TouchButton.activeMultiple(difficulityButtons);

    difficulityButtons.forEach((button) => {
      button.onclick = (event) => {
        difficulityEventHandler(event);
        setTimeout(() => {
          chooseShape();
        }, 300);
      };
    });
  };

  const writeRndPlrHdr = function (rndmPlr) {
    const playerName = rndmPlr.getPlayerName();
    const randomPlayerHeader = document.querySelector("#randomPlayerHeader");
    let heading = "";

    if (playerName === "You") {
      heading = "You pick the shape";
    } else {
      heading = `${playerName} picks the shape`;
    }

    setTimeout(() => {
      randomPlayerHeader.classList.add("makeDissapear");
    }, 1300);
    setTimeout(() => {
      randomPlayerHeader.textContent = heading;
      randomPlayerHeader.classList.add("styled");
    }, 1800);
  };

  const shapeChoosingPlayer = function () {
    const randomPlayer = GameBoard.getRandomPlayer();
    randomPlayer.letPickShape();
    writeRndPlrHdr(randomPlayer);
  };

  const chooseShape = function () {
    const crossBackground = document.querySelector("#crossBackground");
    const donutBackground = document.querySelector("#donutBackground");

    screen.classList.add("shapeScreen");
    shapeChoosingPlayer();
    setTimeout(() => {
      crossBackground.classList.add("visible");
      donutBackground.classList.add("visible");
    }, 1700);
  };
  return {
    startGame,
  };
})();

displayController.startGame();
