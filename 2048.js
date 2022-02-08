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

function removeZeros(bm, ab) {
  for (let j = 0; j < 3; j++) {
    let space = bm[i][j];
    let spacep1 = bm[i][j + 1];
    if (ab[space] === 0) {
      ab[space] = ab[spacep1];
      ab[spacep1] = 0;
    }
  }
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    // pass 1a and 1b - remove zeros
    removeZeros(boardMap, activeBoard);
    removeZeros(boardMap, activeBoard);
    // for (let j = 0; j < 3; j++) {
    //   let space = boardMap[i][j];
    //   let spacep1 = boardMap[i][j + 1];
    //   if (activeBoard[space] === 0) {
    //     activeBoard[space] = activeBoard[spacep1];
    //     activeBoard[spacep1] = 0;
    //   }
    // }

    // pass 2 - merge matches
    for (let j = 0; j < 3; j++) {
      let space = boardMap[i][j];
      let spacep1 = boardMap[i][j + 1];
      if (activeBoard[space] === activeBoard[spacep1]) {
        activeBoard[spacep1] += activeBoard[space];
        activeBoard[space] = 0;
      }

      // pass 3 - move fully left
      for (let j = 3; j > 0; j--) {
        let space = boardMap[i][j];
        let spacep1 = boardMap[i][j - 1];
        if (activeBoard[spacep1] === 0) {
          activeBoard[spacep1] = activeBoard[space];
          activeBoard[space] = 0;
        }
      }
    }
  }

  // update the game board
  findOpenSpaces();
  placeNewNumber(openSpaces);
  updateBoard();
}

function moveRight() {
  for (let i = 0; i < 4; i++) {
    // pass 1 - remove zeros
    for (let j = 0; j < 3; j++) {
      let space = boardMap[i][j];
      let spacep1 = boardMap[i][j + 1];
      if (activeBoard[spacep1] === 0) {
        activeBoard[spacep1] = activeBoard[space];
        activeBoard[space] = 0;
      }
    }

    // pass 2 - merge matches
    for (let j = 3; j > 0; j--) {
      let space = boardMap[i][j];
      let spacep1 = boardMap[i][j - 1];
      if (activeBoard[space] === activeBoard[spacep1]) {
        activeBoard[spacep1] += activeBoard[space];
        activeBoard[space] = 0;
      }

      // pass 3 - move fully left
      for (let j = 0; j < 3; j++) {
        let space = boardMap[i][j];
        let spacep1 = boardMap[i][j + 1];
        if (activeBoard[spacep1] === 0) {
          activeBoard[spacep1] = activeBoard[space];
          activeBoard[space] = 0;
        }
      }
    }
  }

  // update the game board
  findOpenSpaces();
  placeNewNumber(openSpaces);
  updateBoard();
}

function moveUp() {
  for (let j = 0; j < 4; j++) {
    // pass 1 - remove zeros
    for (let i = 3; i > 0; i--) {
      let space = boardMap[i][j];
      let spacep1 = boardMap[i - 1][j];
      if (activeBoard[spacep1] === 0) {
        activeBoard[spacep1] = activeBoard[space];
        activeBoard[space] = 0;
      }
    }

    // pass 2 - merge matches
    for (let i = 0; i < 3; i++) {
      let space = boardMap[i][j];
      let spacep1 = boardMap[i + 1][j];
      if (activeBoard[space] === activeBoard[spacep1]) {
        activeBoard[spacep1] += activeBoard[space];
        activeBoard[space] = 0;
      }

      // pass 3 - move fully left
      for (let i = 3; i > 0; i--) {
        let space = boardMap[i][j];
        let spacep1 = boardMap[i - 1][j];
        if (activeBoard[spacep1] === 0) {
          activeBoard[spacep1] = activeBoard[space];
          activeBoard[space] = 0;
        }
      }
    }
  }

  // update the game board
  findOpenSpaces();
  placeNewNumber(openSpaces);
  updateBoard();
}

function moveDown() {
  for (let j = 0; j < 4; j++) {
    // pass 1 - remove zeros
    for (let i = 0; i < 3; i++) {
      let space = boardMap[i][j];
      let spacep1 = boardMap[i + 1][j];
      if (activeBoard[spacep1] === 0) {
        activeBoard[spacep1] = activeBoard[space];
        activeBoard[space] = 0;
      }
    }

    // pass 2 - merge matches
    for (let i = 3; i > 0; i--) {
      let space = boardMap[i][j];
      let spacep1 = boardMap[i - 1][j];
      if (activeBoard[space] === activeBoard[spacep1]) {
        activeBoard[spacep1] += activeBoard[space];
        activeBoard[space] = 0;
      }

      // pass 3 - move fully left
      for (let i = 0; i < 3; i++) {
        let space = boardMap[i][j];
        let spacep1 = boardMap[i + 1][j];
        if (activeBoard[spacep1] === 0) {
          activeBoard[spacep1] = activeBoard[space];
          activeBoard[space] = 0;
        }
      }
    }
  }

  // update the game board
  findOpenSpaces();
  placeNewNumber(openSpaces);
  updateBoard();
}

for (let i = 0; i <= 15; i++) {
  gameBoard.push(document.querySelector(`#d${i}`));
}

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
}

function findOpenSpaces() {
  openSpaces = [];
  activeBoard.forEach((e, ind) => {
    if (e === 0) {
      openSpaces.push(ind);
    }
  });
}

// game initialization
function initGame() {
  openSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  activeBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // get the first two spaces filled in
  placeNewNumber(openSpaces);
  placeNewNumber(openSpaces);
  updateBoard();
}

initGame();
