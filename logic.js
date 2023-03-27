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
    score++;
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

  const player = Player();

  const setDifficulity = function (difficulityLevel) {
    difficulity = difficulityLevel;
  };

  const getDifficulity = function () {
    return difficulity;
  };

  const letBotChooseShape = function () {
    const shapes = ["cross", "donut"];
    const randomIndex = Math.floor(Math.random() * 2);

    player.setPlayerShape(shapes[randomIndex]);

    return shapes[randomIndex];
  };

  return Object.assign(player, bot, {
    setDifficulity,
    getDifficulity,
    letBotChooseShape,
  });
};

const GameBoard = (function () {
  let player = Player();
  let opponent = null;
  let player_turn = "cross";
  let round = 1;
  let gameBoard = [null, null, null, null, null, null, null, null, null];
  let roundWinner = false;

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

  const setPlayerShapes = function (shape) {
    if (player.checkShapePicker()) {
      if (shape === "cross") {
        player.setPlayerShape("cross");
        opponent.setPlayerShape("donut");
      } else if (shape === "donut") {
        player.setPlayerShape("donut");
        opponent.setPlayerShape("cross");
      }
    } else if (opponent.checkShapePicker) {
      if (shape === "cross") {
        player.setPlayerShape("donut");
        opponent.setPlayerShape("cross");
      } else if (shape === "donut") {
        player.setPlayerShape("cross");
        opponent.setPlayerShape("donut");
      }
    }
  };

  const getRoundScore = function () {
    return round;
  };

  const makeMove = function (squareIndex) {
    if (gameBoard[squareIndex] === null) {
      const playerShape = player.getPlayerShape();
      const opponentShape = opponent.getPlayerShape();

      if (playerShape === player_turn) {
        gameBoard[squareIndex] = playerShape;
        renderShape(squareIndex);
        player_turn = opponentShape;
      } else if (opponentShape === player_turn) {
        gameBoard[squareIndex] = opponentShape;
        renderShape(squareIndex);
        player_turn = playerShape;
      }
    }
  };

  const givePlayerScore = function (shape) {
    if (player.getPlayerShape() === shape) {
      player.incrementScore();
    } else if (opponent.getPlayerShape() === shape) {
      opponent.incrementScore();
    }
  };

  const checkWin = function () {
    const checkTie = gameBoard.every((square) => {
      return square !== null;
    });
    const winningCombinations = [
      // horizontal
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // vertical
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // diagonal
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];

      if (
        gameBoard[a] !== null &&
        gameBoard[a] === gameBoard[b] &&
        gameBoard[a] === gameBoard[c]
      ) {
        givePlayerScore([gameBoard[a]][0]);
        round++;
        roundWinner = true;
        return { shape: gameBoard[a], winCombo: [a, b, c] };
      }
    }

    if (checkTie) {
      round++;
      roundWinner = true;
      return "tie";
    }
  };

  const getRoundWinState = function () {
    return roundWinner;
  };

  const resetRound = function () {
    roundWinner = false;
    gameBoard = [null, null, null, null, null, null, null, null, null];
  };

  const renderShape = function (squareIndex) {
    const square = document.getElementById(squareIndex);
    const crossIcon = document.createElement("img");
    const donutIcon = document.createElement("img");

    crossIcon.src = "./icons/cross.svg";
    donutIcon.src = "./icons/donut.svg";

    if (player_turn === "cross") {
      square.appendChild(crossIcon);
      setTimeout(() => {
        crossIcon.classList.add("show");
      }, 50);
    } else if (player_turn === "donut") {
      square.appendChild(donutIcon);
      setTimeout(() => {
        donutIcon.classList.add("show");
      }, 50);
    }
  };

  const getBoard = function () {
    return gameBoard;
  };

  return {
    setOpponent,
    getRandomPlayer,
    getOpponent,
    getPlayer,
    setPlayerShapes,
    makeMove,
    getBoard,
    checkWin,
    getRoundScore,
    getRoundWinState,
    resetRound,
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
  let roundActive = true;
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

  const showShapeScreen = function () {
    const crossBackground = document.querySelector("#crossBackground");
    const donutBackground = document.querySelector("#donutBackground");
    const shapeButtons = document.querySelectorAll(".shape");

    setTimeout(() => {
      crossBackground.classList.remove("disabled");
      donutBackground.classList.remove("disabled");
    }, 1660);
    setTimeout(() => {
      crossBackground.classList.add("visible");
      donutBackground.classList.add("visible");
      TouchButton.activeMultiple(shapeButtons);
    }, 1700);
  };

  const hideshapeScreen = function () {
    const crossBackground = document.querySelector("#crossBackground");
    const donutBackground = document.querySelector("#donutBackground");
    const shapeButtons = document.querySelectorAll(".shape");
    const randomPlayerHeader = document.querySelector("#randomPlayerHeader");

    TouchButton.inertMultiple(shapeButtons);

    [crossBackground, donutBackground].forEach((background) => {
      background.classList.remove("visible");
    });

    randomPlayerHeader.classList.remove("styled");
    randomPlayerHeader.classList.add("makeDissapear");

    setTimeout(() => {
      [crossBackground, donutBackground].forEach((background) => {
        background.classList.add("disabled");
      });
      randomPlayerHeader.classList.add("disabled");
      screen.classList.remove("shapeScreen");
    }, 500);

    setTimeout(() => {
      playGame();
    }, 600);
  };

  const showBotDecision = function () {
    const shapeButtons = document.querySelectorAll(".shape");
    const botShape = opponent.letBotChooseShape();
    const randomPlayerHeader = document.querySelector("#randomPlayerHeader");

    GameBoard.setPlayerShapes(botShape);
    shapeButtons.forEach((button) => {
      button.setAttribute("disabled", "");

      if (button.id === botShape) {
        setTimeout(() => {
          randomPlayerHeader.classList.remove("styled");
          randomPlayerHeader.classList.add("makeDissapear");
        }, 3500);

        setTimeout(() => {
          randomPlayerHeader.textContent = `Bot picked ${botShape}`;
          randomPlayerHeader.classList.remove("makeDissapear");
          randomPlayerHeader.classList.add("styled");
        }, 3800);
      }
    });
  };

  const chooseShape = function () {
    const shapeButtons = document.querySelectorAll(".shape");

    screen.classList.add("shapeScreen");
    shapeChoosingPlayer();
    showShapeScreen();

    if (opponent.getPlayerName() === "Bot" && opponent.checkShapePicker()) {
      showBotDecision();
      setTimeout(() => {
        hideshapeScreen();
      }, 5000);
    } else {
      shapeButtons.forEach((button) => {
        button.onclick = (event) => {
          hideshapeScreen();
          GameBoard.setPlayerShapes(event.target.id);
        };
      });
    }
  };

  const wrtPlayerInfo = function () {
    const playerInfo = document.querySelector(".player1-info");
    const opponentInfo = document.querySelector(".player2-info");
    const playerName = document.querySelector("#playerName");
    const opponentName = document.querySelector("#opponentName");
    const playerShape = document.querySelector("#playerShape");
    const opponentShape = document.querySelector("#opponentShape");

    playerName.textContent = player.getPlayerName();
    opponentName.textContent = opponent.getPlayerName();

    if (player.getPlayerShape() === "cross") {
      playerInfo.classList.add("active");
      playerShape.src = "./icons/cross.svg";
      opponentShape.src = "./icons/donut.svg";
    } else {
      opponentInfo.classList.add("active");
      playerShape.src = "./icons/donut.svg";
      opponentShape.src = "./icons/cross.svg";
    }
  };

  const showActivePlayer = function (squareIndex) {
    const board = GameBoard.getBoard();
    const playerInfo = document.querySelector(".player1-info");
    const opponentInfo = document.querySelector(".player2-info");

    if (board[squareIndex] === null) {
      playerInfo.classList.toggle("active");
      opponentInfo.classList.toggle("active");
    }
  };

  const showRoundWinner = function () {
    const roundHeader = document.querySelector(".roundHeader");
    const winner = GameBoard.checkWin();

    if (winner) {
      const [a, b, c] = winner.winCombo;
      const winShapeA = document.querySelector(`[id="${a}"]`).children[0];
      const winShapeB = document.querySelector(`[id="${b}"]`).children[0];
      const winShapeC = document.querySelector(`[id="${c}"]`).children[0];

      if (winner.shape === player.getPlayerShape()) {
        roundHeader.classList.add("dissapear");
        setTimeout(() => {
          roundHeader.textContent = `${player.getPlayerName()} GETS A SCORE`;
          roundHeader.classList.remove("dissapear");
        }, 600);
      } else if (winner.shape === opponent.getPlayerShape()) {
        roundHeader.classList.add("dissapear");
        setTimeout(() => {
          roundHeader.textContent = `${opponent.getPlayerName()} GETS A SCORE`;
          roundHeader.classList.remove("dissapear");
        }, 600);
      }

      setTimeout(() => {
        roundHeader.classList.add("dissapear");
      }, 2500);

      setTimeout(() => {
        [winShapeA, winShapeB, winShapeC].forEach((shape) => {
          shape.classList.add("active");
        });
      }, 150);

      showPlayerScores(winner.shape);
    }
  };

  const showPlayerScores = function (winnerShape) {
    const playerInfo = document.querySelector(".player1-info");
    const opponentInfo = document.querySelector(".player2-info");
    let shape = document.createElement("img");
    shape.src = `./icons/${winnerShape}.svg`;

    if (player.getPlayerShape() === winnerShape) {
      const playerScore = player.getScore();
      const playerScores = playerInfo.querySelectorAll(".win");
      const scoreContainer = playerScores[playerScore - 1];

      scoreContainer.appendChild(shape);
      setTimeout(() => {
        scoreContainer.classList.add("dissapear");
      }, 300);
      setTimeout(() => {
        scoreContainer.classList.remove("dissapear");
        scoreContainer.classList.add("score");
      }, 600);
    } else if (opponent.getPlayerShape() === winnerShape) {
      const opponentScore = opponent.getScore();
      const opponentScores = opponentInfo.querySelectorAll(".win");
      const scoreContainer = opponentScores[opponentScore - 1];

      scoreContainer.appendChild(shape);
      setTimeout(() => {
        scoreContainer.classList.add("dissapear");
      }, 300);
      setTimeout(() => {
        scoreContainer.classList.remove("dissapear");
        scoreContainer.classList.add("score");
      }, 600);
    }
  };

  const disableGameBoard = function () {
    if (GameBoard.getRoundWinState()) {
      roundActive = false;
      playNextRound();
    }
  };

  const gameEventHandler = function (e) {
    if (roundActive) {
      const squareIndex = e.target.id;

      showActivePlayer(squareIndex);
      GameBoard.makeMove(squareIndex);
      showRoundWinner(); //displays round winner in a header text and animates winning combination shapes
      disableGameBoard(); //disables gameboard if there's a round winner
    }
  };

  const showRoundNumber = function () {
    const roundHeader = document.querySelector(".roundHeader");
    roundHeader.classList.remove("dissapear");
    roundHeader.textContent = `Round ${GameBoard.getRoundScore()}`;
  };

  const playNextRound = function () {
    const boardSquares = document.querySelectorAll(".gameSquare");

    boardSquares.forEach((square) => {
      const playedShape = square.querySelector("img");

      if (playedShape) {
        setTimeout(() => {
          playedShape.classList.remove("show");
          playedShape.classList.remove("active");
        }, 2500);
        setTimeout(() => {
          playedShape.remove();
          roundActive = true;
          GameBoard.resetRound();
          showRoundNumber();
        }, 2800);
      }
    });
  };

  const playGame = function () {
    const board = document.querySelector(".gameBoard");
    screen.classList.add("gameScreen");
    wrtPlayerInfo();
    board.addEventListener("click", gameEventHandler);
  };

  return {
    startGame,
  };
})();

displayController.startGame();
