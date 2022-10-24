const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const X_CLASS = "x";
const O_CLASS = "o";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
const winningMessageElement = document.getElementById("winningMessage");
const heading = document.getElementById("heading");
const turn = document.getElementById("turn");
const scorex = document.getElementById("scorex");
const scorey = document.getElementById("scorey");
const restartButton = document.getElementById("restartButton");
const player = document.getElementById("player");
const reset = document.getElementById("reset");
const c0 = document.getElementById("0");
const c1 = document.getElementById("1");
const c2 = document.getElementById("2");
const c3 = document.getElementById("3");
const c4 = document.getElementById("4");
const c5 = document.getElementById("5");
const c6 = document.getElementById("6");
const c7 = document.getElementById("7");
const c8 = document.getElementById("8");
let oTurn;
restartButton.addEventListener("click", startGame);
reset.addEventListener("click", res);
player.addEventListener("click", single);

reset.innerText = "Reset";
let sx = 0,
  so = 0;
scorex.innerText = `X : ${sx}`;
scorey.innerText = `O : ${so}`;

function single() {
  check = !check;
  console.log(check);
  if (check) {
    runSingle();
  } else {
    player.innerText = "Double";
    startGame();
  }
}

function res() {
  sx = 0;
  so = 0;
  scorex.innerText = `X : ${sx}`;
  scorey.innerText = `O : ${so}`;
  begin();
}

function runSingle() {
  player.innerText = "Single";

  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  oTurn = false;
  let c = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
  if (c == 0) c0.click();
  else if (c == 1) c1.click();
  else if (c == 2) c2.click();
  else if (c == 3) c3.click();
  else if (c == 4) c4.click();
  else if (c == 5) c5.click();
  else if (c == 6) c6.click();
  else if (c == 7) c7.click();
  else if (c == 8) c8.click();
}

function startSingle() {
  let board = makeBoard();
  let ai = "x";
  let human = "o";
  let currentPlayer = human;

  function equals3(a, b, c) {
    return a == b && b == c && a != "_";
  }

  function checkWinner() {
    let winner = null;

    for (let i = 0; i < 3; i++) {
      if (equals3(board[i][0], board[i][1], board[i][2])) {
        winner = board[i][0];
      }
    }

    for (let i = 0; i < 3; i++) {
      if (equals3(board[0][i], board[1][i], board[2][i])) {
        winner = board[0][i];
      }
    }

    if (equals3(board[0][0], board[1][1], board[2][2])) {
      winner = board[0][0];
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
      winner = board[2][0];
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "_") {
          openSpots++;
        }
      }
    }

    if (winner == null && openSpots == 0) {
      return "tie";
    } else {
      return winner;
    }
  }

  let scores = {
    x: 10,
    o: -10,
    tie: 0,
  };

  function max(i, j) {
    if (i > j) return i;
    return j;
  }

  function min(i, j) {
    if (i < j) return i;
    return j;
  }
  bestMove();

  function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "_") {
          board[i][j] = ai;
          let score = minimax(board, 0, false);
          board[i][j] = "_";
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    board[move.i][move.j] = ai;
    currentPlayer = human;
    if (move.i == 0 && move.j == 0) c0.click();
    else if (move.i == 0 && move.j == 1) c1.click();
    else if (move.i == 0 && move.j == 2) c2.click();
    else if (move.i == 1 && move.j == 0) c3.click();
    else if (move.i == 1 && move.j == 1) c4.click();
    else if (move.i == 1 && move.j == 2) c5.click();
    else if (move.i == 2 && move.j == 0) c6.click();
    else if (move.i == 2 && move.j == 1) c7.click();
    else if (move.i == 2 && move.j == 2) c8.click();
  }

  function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result != null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == "_") {
            board[i][j] = ai;
            let score = minimax(board, depth + 1, false);
            board[i][j] = "_";
            bestScore = max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == "_") {
            board[i][j] = human;
            let score = minimax(board, depth + 1, true);
            board[i][j] = "_";
            bestScore = min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }
}

function makeBoard() {
  var ans = new Array(3);
  for (var i = 0; i < 3; i++) {
    ans[i] = new Array(3);
  }

  ans[0][0] = "_";
  ans[0][1] = "_";
  ans[0][2] = "_";
  ans[1][0] = "_";
  ans[1][1] = "_";
  ans[1][2] = "_";
  ans[2][0] = "_";
  ans[2][1] = "_";
  ans[2][2] = "_";

  if (c0.classList.contains(X_CLASS)) ans[0][0] = "x";
  if (c1.classList.contains(X_CLASS)) ans[0][1] = "x";
  if (c2.classList.contains(X_CLASS)) ans[0][2] = "x";
  if (c3.classList.contains(X_CLASS)) ans[1][0] = "x";
  if (c4.classList.contains(X_CLASS)) ans[1][1] = "x";
  if (c5.classList.contains(X_CLASS)) ans[1][2] = "x";
  if (c6.classList.contains(X_CLASS)) ans[2][0] = "x";
  if (c7.classList.contains(X_CLASS)) ans[2][1] = "x";
  if (c8.classList.contains(X_CLASS)) ans[2][2] = "x";

  if (c0.classList.contains(O_CLASS)) ans[0][0] = "o";
  if (c1.classList.contains(O_CLASS)) ans[0][1] = "o";
  if (c2.classList.contains(O_CLASS)) ans[0][2] = "o";
  if (c3.classList.contains(O_CLASS)) ans[1][0] = "o";
  if (c4.classList.contains(O_CLASS)) ans[1][1] = "o";
  if (c5.classList.contains(O_CLASS)) ans[1][2] = "o";
  if (c6.classList.contains(O_CLASS)) ans[2][0] = "o";
  if (c7.classList.contains(O_CLASS)) ans[2][1] = "o";
  if (c8.classList.contains(O_CLASS)) ans[2][2] = "o";

  return ans;
}

begin();

function begin() {
  turn.innerText = "";
  restartButton.innerText = "Start";
  winningMessageTextElement.innerText = "";
  winningMessageElement.classList.add("show");
}

let check = 0;
player.innerText = "Double";

function startGame() {
  oTurn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
  turn.innerText = `${oTurn ? "O's" : "X's"} Turn`;
  if (check) runSingle();
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    if (check == 1 && !oTurn) startSingle();
  }
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function isEmpty() {
  return [...cellElements].every((cell) => {
    return (
      !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
    );
  });
}

function endGame(draw) {
  if (draw) {
    turn.innerText = "";
    sx++;
    so++;
    scorex.innerText = `X : ${sx}`;
    scorey.innerText = `O : ${so}`;
    winningMessageTextElement.innerText = "DRAW";
  } else {
    turn.innerText = "";
    winningMessageTextElement.innerText = `${oTurn ? "O" : "X"} Wins`;
    if (oTurn) so++;
    else sx++;
    scorex.innerText = `X : ${sx}`;
    scorey.innerText = `O : ${so}`;
  }
  restartButton.innerText = "Replay";
  winningMessageElement.classList.add("show");
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  oTurn = !oTurn;
  turn.innerText = `${oTurn ? "O's" : "X's"} Turn`;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if (oTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

heading.innerText = "Tic-Tac-Toe";
