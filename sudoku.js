const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});


const inputs = document.querySelector('#puzzle')
const solve = document.querySelector('#solve-button')
const reset = document.querySelector('#reset')
const squares = 81
let board = []
const random = document.querySelector('#random')
const animate = document.querySelector('#animate-button')

for(let i = 0; i < squares; i++) {
    const input = document.createElement('input')
    input.setAttribute('type', 'number')
    input.setAttribute('min', '1')
    input.setAttribute('max', '9')
    inputs.appendChild(input)
 }

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function resetBoard() {
    const remove = document.querySelector('#puzzle');
    removeAllChildNodes(remove);
    for(let i = 0; i < squares; i++) {
        const input = document.createElement('input')
        input.setAttribute('type', 'number')
        input.setAttribute('min', '1')
        input.setAttribute('max', '9')
        inputs.appendChild(input)
     }
     board = []
     createBoard()
}

const createBoard = () => {
    const inputs = document.querySelectorAll('input');
    let row = 0;
    let col = 0;
    board = [];
    inputs.forEach((input) => {
      if (col === 9) {
        col = 0;
        row++;
      }
      if (!board[row]) {
        board[row] = []; // Initialize each row of the board array
      }
      if (input.value) board[row].push(parseInt(input.value));
      else board[row].push(0);
      col++;
    });
  };  
  

function isSolvable() {
    for(let row = 0; row < 9; row++){
        if(duplicateInRow(board, row))
            return false
        for(let col = 0; col < 9; col++){
            if(duplicateInCol(board, col))
                return false
            if(row%3 === 0 && col%3 === 0){
                if(duplicateInBox(board, row, col))
                    return false
            }
        }
    }
    return true
}

function duplicateInRow(board, row) {
    let check = new Set()
    for(let i = 0; i < 9; i++) {
        if(check.has(board[row][i]))
            return true
        else if(board[row][i] !== 0) 
            check.add(board[row][i])
    }
    return false
}

function duplicateInCol(board, col) {
    let check = new Set()
    for(let i = 0; i < 9; i++){
        if(check.has(board[i][col])) 
            return true
        else if(board[i][col] !== 0) 
            check.add(board[i][col])
    }
    return false
}

function duplicateInBox(board, row, col) {
    let check = new Set()
    for(let i = row; i < row + 3; i++){
        for(let j = col; j < col + 3; j++){
            if(check.has(board[i][j])) 
                return true 
            else if(board[i][j] !== 0)
                check.add(board[i][j])
        }
    }
    return false
}


async function animateBoard() {
  let row = -1;
  let col = -1;
  let isEmpty = true;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = false;
        break;
      }
    }
    if (!isEmpty) {
      break;
    }
  }

  if (isEmpty) {
    return true;
  }

  for (let num = 1; num <= 9; num++) {
    if (isValidMove(row, col, num)) {
      const input = document.querySelector(`#puzzle input:nth-child(${row * 9 + col + 1})`);
      board[row][col] = num;
      input.style.backgroundColor = 'turquoise';
      input.value = num;
      await new Promise((resolve) => setTimeout(resolve, 50));

      if (await animateBoard()) {
        return true;
      } else {
        board[row][col] = 0;
        input.style.backgroundColor = '';
        input.value = '';
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
  }

  return false;
}

function solveSudoku() {
  let row = -1;
  let col = -1;
  let isEmpty = true;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = false;
        break;
      }
    }
    if (!isEmpty) {
      break;
    }
  }

  if (isEmpty) {
    return true;
  }

  for (let num = 1; num <= 9; num++) {
    if (isValidMove(row, col, num)) {
      board[row][col] = num;

      if (solveSudoku()) {
        return true;
      } else {
        board[row][col] = 0;
      }
    }
  }

  return false;
}



function isValidMove(row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }
  
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }
  
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
  
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }
    
    return true; 
}

function findEmptyCell() {
    for(let row = 0; row < 9; row++){
        for(let col = 0; col < 9; col++){
            if(board[row][col] !== 0)
                return [row,col]
        }
    }
    return null;
}

function solveBoard() {
    createBoard()
    if (isSolvable()) {
      solveSudoku()
          for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
              const input = document.querySelector(`#puzzle input:nth-child(${row * 9 + col + 1})`)
              input.value = board[row][col]
            }
          }
        }
       else {
        alert('The puzzle is not solvable.')
      }
  }

  function solveBoardAnimate() {
    createBoard()
    if (isSolvable()) {
      animateBoard()
          for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
              const input = document.querySelector(`#puzzle input:nth-child(${row * 9 + col + 1})`)
              input.value = board[row][col]
            }
          }
        }
       else {
        alert('The puzzle is not solvable.')
      }
  }

function randomBoard() {
    resetBoard()
    for(let row = 0; row < 9; row++) {
        for(let col = 0; col < 9; col++) {
            let random = Math.floor(Math.random() * 50)
            if(random < 10 && random !== 0) {
                const input = document.querySelector(`#puzzle input:nth-child(${row * 9 + col + 1})`)
                input.value = random
                board[row][col] = random
                while(!isValidMove(row, col, random))
                  random = Math.floor(Math.random() * 8) + 1
                input.value = random
                board[row][col] = random
            }
        }
    }
    createBoard()
}

solve.addEventListener('click', solveBoard)
reset.addEventListener('click', resetBoard)
random.addEventListener('click', randomBoard)
animate.addEventListener('click', solveBoardAnimate)