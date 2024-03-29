const Player = function () {
  let _playerName = null;
  let _shape = null;
  let _score = 0;
  let _picksShape = false;

  const setPlayerName = function (name) {
    _playerName = name;
  };
  const getPlayerName = function () {
    return _playerName;
  };

  const checkShapePicker = function () {
    return _picksShape;
  };

  const letPickShape = function () {
    _picksShape = true;
  };

  const getPlayerShape = function () {
    return _shape;
  };

  const setPlayerShape = function (newShape) {
    _shape = newShape;
  };

  const getScore = function () {
    return _score;
  };

  const incrementScore = function () {
    _score++;
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
  const _bot = Player();
  let _difficulity = null;

  const setDifficulity = function (difficulityLevel) {
    _difficulity = difficulityLevel;
  };

  const getDifficulity = function () {
    return _difficulity;
  };

  const letBotChooseShape = function () {
    const shapes = ["cross", "donut"];
    const randomIndex = Math.floor(Math.random() * 2);

    _bot.setPlayerShape(shapes[randomIndex]);

    return shapes[randomIndex];
  };

  const emptyIndexes = function (board) {
    let indexes = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        indexes.push(i);
      }
    }

    return indexes;
  };

  const moveEasy = function (board) {
    const avaliableSpots = emptyIndexes(board);

    const randomPosition = Math.floor(Math.random() * avaliableSpots.length);
    return avaliableSpots[randomPosition];
  };

  //check if adding a shape of a --BOT-- into the board results a winning combination
  const moveMedium = function (board, shapes) {
    const avaliableSpots = emptyIndexes(board);

    for (let position of avaliableSpots) {
      const boardCopy = board.slice();
      boardCopy[position] = shapes.botShape;

      const winInfo = GameBoard.getWinInfo(boardCopy);
      if (winInfo && winInfo.shape === shapes.botShape) {
        return position;
      }
    }

    //check if adding a shape of a --PLAYER-- into the board results a winning combination
    for (let position of avaliableSpots) {
      const boardCopy = board.slice();
      boardCopy[position] = shapes.playerShape;

      const winInfo = GameBoard.getWinInfo(boardCopy);
      if (winInfo && winInfo.shape === shapes.playerShape) {
        return position;
      }
    }

    return moveEasy(board);
  };

  const moveAI = function (board, shapes) {
    const boardCopy = board.slice();
    const move = minimax(boardCopy, shapes, shapes.botShape);
    return move.index;
  };

  const minimax = function (board, shapes, player) {
    let result = GameBoard.getWinInfo(board);
    let moves = [];
    const aviableSpots = emptyIndexes(board);

    if (result !== undefined) {
      if (result.shape === shapes.botShape) {
        return { score: 10 };
      } else if (result.shape === shapes.playerShape) {
        return { score: -10 };
      } else if (aviableSpots.length === 0) {
        return { score: 0 };
      }
    }

    for (let i = 0; i < aviableSpots.length; i++) {
      let move = {};
      move["index"] = aviableSpots[i];
      board[aviableSpots[i]] = player;

      if (player === shapes.botShape) {
        const scoreResult = minimax(board, shapes, shapes.playerShape);
        move.score = scoreResult.score;
      } else if (player === shapes.playerShape) {
        const scoreResult = minimax(board, shapes, shapes.botShape);
        move.score = scoreResult.score;
      }

      board[aviableSpots[i]] = null;
      moves.push(move);
    }

    let bestMove;
    let bestScore;
    if (player === shapes.botShape) {
      bestScore = -Infinity;
      for (let j = 0; j < moves.length; j++) {
        if (moves[j].score > bestScore) {
          bestScore = moves[j].score;
          bestMove = j;
        }
      }
    } else if (player === shapes.playerShape) {
      bestScore = Infinity;
      for (let j = 0; j < moves.length; j++) {
        if (moves[j].score < bestScore) {
          bestScore = moves[j].score;
          bestMove = j;
        }
      }
    }

    if (moves[bestMove]) return moves[bestMove];
  };

  const generateMove = function (gameBoard, shapes, player) {
    if (_difficulity === "Easy") {
      return moveEasy(gameBoard);
    } else if (_difficulity === "Medium") {
      return moveMedium(gameBoard, shapes);
    } else if (_difficulity === "Hard") {
      return moveAI(gameBoard, shapes);
    }
  };

  return Object.assign(_bot, {
    setDifficulity,
    getDifficulity,
    letBotChooseShape,
    generateMove,
  });
};

const GameBoard = (function () {
  let _player = Player();
  let _opponent = null;
  let _player_turn = "cross";
  let _round = 1;
  let _gameBoard = [null, null, null, null, null, null, null, null, null];
  let _roundWinningPattern;
  let _roundWinnerShape;

  const setOpponent = function (newOpponent) {
    _opponent = newOpponent;
  };

  const getOpponent = function () {
    return _opponent;
  };

  const getPlayer = function () {
    return _player;
  };

  const getPlayerTurn = function () {
    return _player_turn;
  };
  const getRandomPlayer = function () {
    const bothPlayers = [_player, _opponent];
    const randomIndex = Math.floor(Math.random() * 2);

    return bothPlayers[randomIndex];
  };

  const setPlayerShapes = function (shape) {
    if (_player.checkShapePicker()) {
      if (shape === "cross") {
        _player.setPlayerShape("cross");
        _opponent.setPlayerShape("donut");
      } else if (shape === "donut") {
        _player.setPlayerShape("donut");
        _opponent.setPlayerShape("cross");
      }
    } else if (_opponent.checkShapePicker) {
      if (shape === "cross") {
        _player.setPlayerShape("donut");
        _opponent.setPlayerShape("cross");
      } else if (shape === "donut") {
        _player.setPlayerShape("cross");
        _opponent.setPlayerShape("donut");
      }
    }
  };

  const getRoundScore = function () {
    return _round;
  };

  const makeMove = function (squareIndex) {
    if (_gameBoard[squareIndex] === null || squareIndex === "noValue") {
      const playerShape = _player.getPlayerShape();
      const opponentShape = _opponent.getPlayerShape();

      if (playerShape === _player_turn) {
        _gameBoard[squareIndex] = playerShape;
        _renderShape(squareIndex);
        _player_turn = opponentShape;
      } else {
        if (
          _opponent.getPlayerName() === "Bot" &&
          opponentShape === _player_turn
        ) {
          makeBotMove(opponentShape);
          _player_turn = playerShape;
        } else if (opponentShape === _player_turn) {
          _gameBoard[squareIndex] = opponentShape;
          _renderShape(squareIndex);
          _player_turn = playerShape;
        }
      }
    }
  };

  const makeBotMove = function (opponentShape) {
    const shapes = {
      botShape: _opponent.getPlayerShape(),
      playerShape: _player.getPlayerShape(),
    };
    const botChoice = _opponent.generateMove(_gameBoard, shapes);
    if (botChoice !== undefined) {
      _gameBoard[botChoice] = opponentShape;
      _renderShape(botChoice);
      _player_turn = playerShape;
    }
  };

  const _givePlayerScore = function (shape) {
    if (_player.getPlayerShape() === shape) {
      _player.incrementScore();
    } else if (_opponent.getPlayerShape() === shape) {
      _opponent.incrementScore();
    }
  };

  const updateWinInfo = function () {
    if (checkWin() === "tie") {
      _givePlayerScore("cross");
      _givePlayerScore("donut");
      _round++;
    } else if (checkWin()) {
      const winnerShape = getWinInfo().shape;
      _givePlayerScore(winnerShape);
      _round++;
    }
  };

  const getWinInfo = function (boardToCheck = _gameBoard) {
    const win = checkWin(boardToCheck);
    if (win === "tie") {
      return "tie";
    } else if (win) {
      return {
        shape: _roundWinnerShape,
        winCombo: _roundWinningPattern,
      };
    }
  };

  const checkWin = function (boardToCheck = null) {
    boardToCheck === null ? (boardToCheck = _gameBoard) : boardToCheck;
    const checkTie = boardToCheck.every((square) => {
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
        boardToCheck[a] !== null &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        _roundWinningPattern = [a, b, c];
        _roundWinnerShape = boardToCheck[a];
        _roundWinner = true;
        return true;
      }
    }

    if (checkTie) {
      return "tie";
    }
  };

  const resetRound = function () {
    _roundWinner = false;
    _gameBoard = [null, null, null, null, null, null, null, null, null];
  };

  const _renderShape = function (squareIndex) {
    const square = document.getElementById(squareIndex);
    const crossIcon = document.createElement("img");
    const donutIcon = document.createElement("img");

    crossIcon.src = "./icons/cross.svg";
    donutIcon.src = "./icons/donut.svg";

    if (_player_turn === "cross") {
      square.appendChild(crossIcon);
      setTimeout(() => {
        crossIcon.classList.add("show");
      }, 50);
    } else if (_player_turn === "donut") {
      square.appendChild(donutIcon);
      setTimeout(() => {
        donutIcon.classList.add("show");
      }, 50);
    }
  };

  const getBoard = function () {
    return _gameBoard;
  };

  const getGameWinner = function () {
    if (_opponent && _opponent.getScore() === 3 && _player.getScore() === 3) {
      return "tie";
    } else if (_opponent && _opponent.getScore() >= 3) {
      return _opponent;
    } else if (_player.getScore() >= 3) {
      return _player;
    }
  };

  const resetGameBoard = function () {
    _player = Player();
    _opponent = null;
    _player_turn = "cross";
    _round = 1;
    _gameBoard = [null, null, null, null, null, null, null, null, null];
    _roundWinningPattern = undefined;
    _roundWinnerShape = undefined;
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
    resetRound,
    getPlayerTurn,
    getWinInfo,
    updateWinInfo,
    getGameWinner,
    resetGameBoard,
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

const DisplayController = (function () {
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

  const showActivePlayer = function () {
    const playerInfo = document.querySelector(".player1-info");
    const opponentInfo = document.querySelector(".player2-info");

    if (player.getPlayerShape() === GameBoard.getPlayerTurn()) {
      playerInfo.classList.add("active");
      opponentInfo.classList.remove("active");
    } else if (opponent.getPlayerShape() === GameBoard.getPlayerTurn()) {
      opponentInfo.classList.add("active");
      playerInfo.classList.remove("active");
    }
  };

  const showWinCombo = function (winner) {
    const [a, b, c] = winner.winCombo;
    const winShapeA = document.querySelector(`[id="${a}"]`).children[0];
    const winShapeB = document.querySelector(`[id="${b}"]`).children[0];
    const winShapeC = document.querySelector(`[id="${c}"]`).children[0];

    setTimeout(() => {
      [winShapeA, winShapeB, winShapeC].forEach((shape) => {
        shape.classList.add("active");
      });
    }, 150);
  };

  const showRoundWinner = function () {
    const roundHeader = document.querySelector(".roundHeader");
    const winner = GameBoard.getWinInfo();

    if (winner === "tie") {
      roundHeader.classList.add("dissapear");
      setTimeout(() => {
        roundHeader.textContent = "IT`S A TIE";
        roundHeader.classList.remove("dissapear");
      }, 600);
      showBothPlayerScores("tie");
    } else if (winner) {
      if (winner.shape === player.getPlayerShape()) {
        roundHeader.classList.add("dissapear");
        setTimeout(() => {
          const str =
            player.getPlayerName() === "You" ? "GET A SCORE" : "GETS A SCORE";
          roundHeader.textContent = `${player.getPlayerName()} ${str}`;
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

      showWinCombo(winner);
      showBothPlayerScores(winner.shape);
    }
  };

  const showPlayerScore = function () {
    const shape = document.createElement("img");
    shape.src = `./icons/${player.getPlayerShape()}.svg`;

    const playerInfo = document.querySelector(".player1-info");
    const playerScoreIndex = player.getScore() - 1;

    const plScores = playerInfo.querySelectorAll(".win");
    const plScore = plScores[playerScoreIndex];

    plScore.appendChild(shape);

    setTimeout(() => {
      plScore.classList.add("dissapear");
    }, 300);
    setTimeout(() => {
      plScore.classList.remove("dissapear");
      plScore.classList.add("score");
    }, 600);
  };

  const showOpponentScore = function () {
    const shape = document.createElement("img");
    shape.src = `./icons/${opponent.getPlayerShape()}.svg`;

    const playerInfo = document.querySelector(".player2-info");
    const opponentScoreIndex = opponent.getScore() - 1;
    const opScores = playerInfo.querySelectorAll(".win");

    const opScore = opScores[opponentScoreIndex];
    opScore.appendChild(shape);
    setTimeout(() => {
      opScore.classList.add("dissapear");
    }, 300);

    setTimeout(() => {
      opScore.classList.remove("dissapear");
      opScore.classList.add("score");
    }, 600);
  };

  const showBothPlayerScores = function (winnerShape) {
    let shape = document.createElement("img");
    shape.src = `./icons/${winnerShape}.svg`;

    if (player.getPlayerShape() === winnerShape) {
      showPlayerScore();
    } else if (opponent.getPlayerShape() === winnerShape) {
      showOpponentScore();
    } else if (winnerShape === "tie") {
      showPlayerScore();
      showOpponentScore();
    }
  };

  const disableGameBoard = function () {
    const winOrTie = GameBoard.checkWin();
    if (winOrTie) {
      roundActive = false;
      playNextRound();
    }
  };

  const gameEventHandler = function (e) {
    if (roundActive) {
      const squareIndex = e.target.id;
      GameBoard.makeMove(squareIndex);
      botGameHandler(squareIndex);
      GameBoard.updateWinInfo();
      showActivePlayer();
      showRoundWinner(); //displays round winner in a header text and animates winning combination shapes
      disableGameBoard(); //disables gameboard if there's a round winner
      showGameWinner();
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

    setTimeout(() => {
      botGameHandler();
    }, 3000);
  };

  const hideGameBoard = function () {
    const playerInfos = document.querySelectorAll(".playerInfo");
    const grid = document.querySelector(".gameBoard");
    const roundHeader = document.querySelector(".roundHeader");
    const game = document.querySelector(".game");

    playerInfos.forEach((info) => {
      setTimeout(() => {
        info.classList.add("moveIn");
        grid.classList.add("hide");
        roundHeader.classList.add("dissapear");
      }, 1500);
      setTimeout(() => {
        info.classList.add("moveOut");
      }, 2000);
      setTimeout(() => {
        game.style.display = "none";
        screen.classList.remove("gameScreen");
      }, 2300);
    });
  };

  const renderWinnerHeading = function (winner) {
    let winHeading = document.querySelector(".winHeading");
    let winnerName = winner;
    if (winner !== "tie") {
      winnerName = winner.getPlayerName();
    }

    switch (winnerName) {
      case "Bot":
        winHeading.textContent =
          "The game may be over, but the memories of your defeat will last a lifetime!";
        break;

      case "You":
        winHeading.textContent = "You`ve won the game!";
        break;

      case "tie":
        winHeading.textContent = "Well, well, well, it`s a draw!";
        break;

      case "Player 1":
        winHeading.textContent = "Player 1, you outplayed your opponent!";
        break;

      case "Player 2":
        winHeading.textContent = "Player 2, you outplayed your opponent!";
        break;
    }

    winHeading.classList.add("show");
  };

  const showGameWinner = function () {
    let winner = GameBoard.getGameWinner();
    const playAgainbtn = document.querySelector("#playAgain");

    if (winner) {
      hideGameBoard();
      setTimeout(() => {
        screen.classList.add("winScreen");
      }, 2300);
      setTimeout(() => {
        renderWinnerHeading(winner);
      }, 2400);
      setTimeout(() => {
        playAgainbtn.classList.add("show");
        TouchButton.active(playAgainbtn);
        playAgainbtn.onclick = () => {
          restartGame();
        };
      }, 2800);
    }
  };

  const removeUnwatedClasses = function () {
    const randomPlayerHeader = document.querySelector("#randomPlayerHeader");
    const gameScreen = document.querySelector(".game");
    const gameBoardGrid = document.querySelector(".gameBoard");
    const playerInfos = document.querySelectorAll(".playerInfo");
    const scores = document.querySelectorAll(".win");

    screen.classList.remove("winScreen");
    randomPlayerHeader.classList.remove("disabled");
    gameBoardGrid.classList.remove("hide");
    gameScreen.style.display = "";

    playerInfos.forEach((plInfo) => {
      plInfo.classList.remove("moveIn");
      plInfo.classList.remove("moveOut");
      console.log("miau");
    });

    scores.forEach((score) => {
      score.classList.remove("score");
    });
  };
  const restartGame = function () {
    GameBoard.resetGameBoard();
    removeUnwatedClasses();
    chooseOpponent();
    roundActive = true;
    player = GameBoard.getPlayer();
    opponent = undefined;
  };

  const botGameHandler = function () {
    if (
      opponent.getPlayerShape() === GameBoard.getPlayerTurn() &&
      opponent.getPlayerName() === "Bot" &&
      !GameBoard.checkWin()
    ) {
      roundActive = false;
      setTimeout(() => {
        GameBoard.makeMove(null);
        roundActive = true;
        GameBoard.makeMove("noValue");
        GameBoard.updateWinInfo();
        showActivePlayer();
        showRoundWinner(); //displays round winner in a header text and animates winning combination shapes

        showGameWinner();
        disableGameBoard(); //disables gameboard if there's a round winner
      }, 700);
    }
  };

  const playGame = function () {
    const board = document.querySelector(".gameBoard");
    screen.classList.add("gameScreen");
    wrtPlayerInfo();
    botGameHandler();
    board.addEventListener("click", gameEventHandler);
  };

  return {
    startGame,
  };
})();

DisplayController.startGame();
