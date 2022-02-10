// initial setup and variables

document.addEventListener('keyup', e => {
  console.log(e);
  if (e.key === 'ArrowLeft') {
    moveLeft();
  } else if (e.key === 'ArrowRight') {
    moveRight();
  } else if (e.key === 'ArrowUp') {
    moveUp();
  } else if (e.key === 'ArrowDown') {
    moveDown();
  }
});

let gameBoard = [];
let ababactiveBoard = [];
let openSpaces = [];
let boardMap = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
];

for (let i = 0; i <= 15; i++) {
  gameBoard.push(document.querySelector(`#d${i}`));
}

const scoreSPAN = document.querySelector('#score');
let score = 0;
const hiscoreSPAN = document.querySelector('#hiscore');
let hiscore = 0;

const newGameBtn = document.querySelector('.newgame');
newGameBtn.addEventListener('click', initGame);

const result = document.querySelector('#title');

let numberMap = new Map([
  [2, 'two'],
  [4, 'four'],
  [8, 'eight'],
  [16, 'sixteen'],
  [32, 'thirtytwo'],
  [64, 'sixtyfour'],
  [128, 'onetwentyeight'],
  [256, 'twofiftysix'],
  [512, 'fivetwelve'],
  [1024, 'tentwentyfour'],
  [2048, 'twentyfortyeight'],
]);

// key movement functionality

function removeZerosLeftRight(bm, ab, i, asc) {
  let loop = asc ? [0, 1, 2] : [3, 2, 1];

  loop.forEach(e => {
    let space = bm[i][e];
    let spacep1 = bm[i][e + (loop[1] - loop[0])];
    if (ab[spacep1] === 0) {
      ab[spacep1] = ab[space];
      ab[space] = 0;
    }
  });
}

function removeZerosUpDown(bm, ab, j, asc) {
  let loop = asc ? [0, 1, 2] : [3, 2, 1];

  loop.forEach(e => {
    let space = bm[e][j];
    let spacep1 = bm[e + (loop[1] - loop[0])][j];
    if (ab[spacep1] === 0) {
      ab[spacep1] = ab[space];
      ab[space] = 0;
    }
  });
}

function updateScore(amnt) {
  score += amnt;
  scoreSPAN.textContent = score;
  if (score > hiscore) {
    hiscore = score;
    hiscoreSPAN.textContent = hiscore;
  }
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    // pass 1a and 1b - remove zeros
    removeZerosLeftRight(boardMap, activeBoard, i, false);
    removeZerosLeftRight(boardMap, activeBoard, i, false);

    // pass 2 - merge matches
    for (let j = 0; j < 3; j++) {
      let space = boardMap[i][j];
      let spacep1 = boardMap[i][j + 1];
      if (activeBoard[space] === activeBoard[spacep1]) {
        activeBoard[spacep1] += activeBoard[space];
        activeBoard[space] = 0;
        // add up the score
        updateScore(activeBoard[spacep1]);
      }
    }

    // pass 3 - move fully left
    removeZerosLeftRight(boardMap, activeBoard, i, false);
    removeZerosLeftRight(boardMap, activeBoard, i, false);
  }

  // update the game board
  findOpenSpaces();
  placeNewNumber(openSpaces);
  updateBoard();
}

function moveRight() {
  for (let i = 0; i < 4; i++) {
    // pass 1a and 1b - remove zeros
    removeZerosLeftRight(boardMap, activeBoard, i, true);
    removeZerosLeftRight(boardMap, activeBoard, i, true);

    // pass 2 - merge matches
    for (let j = 3; j > 0; j--) {
      let space = boardMap[i][j];
      let spacep1 = boardMap[i][j - 1];
      if (activeBoard[space] === activeBoard[spacep1]) {
        activeBoard[spacep1] += activeBoard[space];
        activeBoard[space] = 0;
        // add up the score
        updateScore(activeBoard[spacep1]);
      }

      // pass 3a and 3b - remove zeros
      removeZerosLeftRight(boardMap, activeBoard, i, true);
      removeZerosLeftRight(boardMap, activeBoard, i, true);
    }
  }

  // update the game board
  findOpenSpaces();
  placeNewNumber(openSpaces);
  updateBoard();
}

function moveUp() {
  for (let j = 0; j < 4; j++) {
    // pass 1a and 1b - remove zeros
    removeZerosUpDown(boardMap, activeBoard, j, false);
    removeZerosUpDown(boardMap, activeBoard, j, false);

    // pass 2 - merge matches
    for (let i = 0; i < 3; i++) {
      let space = boardMap[i][j];
      let spacep1 = boardMap[i + 1][j];
      if (activeBoard[space] === activeBoard[spacep1]) {
        activeBoard[spacep1] += activeBoard[space];
        activeBoard[space] = 0;
        // add up the score
        updateScore(activeBoard[spacep1]);
      }

      // pass 3a and 3b - remove zeros
      removeZerosUpDown(boardMap, activeBoard, j, false);
      removeZerosUpDown(boardMap, activeBoard, j, false);
    }
  }

  // update the game board
  findOpenSpaces();
  placeNewNumber(openSpaces);
  updateBoard();
}

function moveDown() {
  for (let j = 0; j < 4; j++) {
    // pass 1a and 1b - remove zeros
    removeZerosUpDown(boardMap, activeBoard, j, true);
    removeZerosUpDown(boardMap, activeBoard, j, true);

    // pass 2 - merge matches
    for (let i = 3; i > 0; i--) {
      let space = boardMap[i][j];
      let spacep1 = boardMap[i - 1][j];
      if (activeBoard[space] === activeBoard[spacep1]) {
        activeBoard[spacep1] += activeBoard[space];
        activeBoard[space] = 0;
        // add up the score
        updateScore(activeBoard[spacep1]);
      }

      // pass 3a and 3b - move fully left
      removeZerosUpDown(boardMap, activeBoard, j, true);
      removeZerosUpDown(boardMap, activeBoard, j, true);
    }
  }

  // update the game board
  findOpenSpaces();
  placeNewNumber(openSpaces);
  updateBoard();
}

// logic for updating the display

// get a random number, either 2 or 4
function getNewNumber() {
  let tmp = Math.random() < 0.5 ? 2 : 4;
  return tmp;
}

function getRandomElement(arr) {
  let len = arr.length;
  let ind = Math.floor(Math.random() * len);
  return ind;
}

function placeNewNumber(arr) {
  let space = getRandomElement(arr);
  activeBoard[openSpaces[space]] = getNewNumber();
  openSpaces.splice(space, 1);
}

function updateBoard() {
  activeBoard.forEach((element, index) => {
    if (element > 1) {
      gameBoard[index].innerHTML = `<span>${element}</span>`;
      gameBoard[index].className = `empty-space ${numberMap.get(element)}`;
    } else {
      gameBoard[index].innerHTML = `<span></span>`;
      gameBoard[index].className = 'empty-space';
    }
  });

  // check for win or loss
  gameState();
}

function findOpenSpaces() {
  openSpaces = [];
  activeBoard.forEach((e, ind) => {
    if (e === 0) {
      openSpaces.push(ind);
    }
  });
}

// check for win or loss
function gameState() {
  // get max number
  let max = 0;
  activeBoard.forEach(e => {
    if (e > max) {
      max = e;
    }
  });
  if ((openSpaces.length === 0) & (max < 2048)) {
    result.textContent = 'GAME OVER';
    result.className = 'lose';
  } else if (max == 2048) {
    result.textContent = 'YOU WIN!';
    result.className = 'win';
  } else {
    result.textContent = '2048';
    result.className = '';
  }
}

// game initialization
function initGame() {
  openSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  activeBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  score = 0;
  updateScore(0);

  // get the first two spaces filled in
  placeNewNumber(openSpaces);
  placeNewNumber(openSpaces);
  updateBoard();
}

initGame();
