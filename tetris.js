document.addEventListener('DOMContentLoaded', () => {
    const width = 10;
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const easy = document.querySelector('#easy');
    const medium = document.querySelector('#medium');
    const hard = document.querySelector('#hard');
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        "rgb(229, 122, 225)",
        "rgb(128, 182, 243)",
        "rgb(159, 225, 170)",
        "rgb(202, 178, 219)",
        "rgb(218, 219, 178)"
    ]

    const l = [
      [1, width + 1, width * 2 + 1, 2],
      [width, width + 1, width + 2, width * 2 + 2],
      [1, width + 1, width * 2 + 1, width * 2],
      [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];
  
    const z = [
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1]
    ];
  
    const t = [
      [1, width, width + 1, width + 2],
      [1, width + 1, width + 2, width * 2 + 1],
      [width, width + 1, width + 2, width * 2 + 1],
      [1, width, width + 1, width * 2 + 1]
    ];
  
    const o = [
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1]
    ];
  
    const i = [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3]
    ];
  
    const theTetrominoes = [l, z, t, o, i];
    let currRotation = 0
    let currPos = 4;

    let random = Math.floor(Math.random()*theTetrominoes.length)
    let curr = theTetrominoes[random][currRotation];
  
    function draw() {
        curr.forEach(index => {
          squares[currPos + index].classList.add('tetromino')
          squares[currPos+index].style.backgroundColor = colors[random]
        });
      }      
  
    function undraw() {
        curr.forEach(index => {
            squares[currPos + index].classList.remove('tetromino')
            squares[currPos+index].style.backgroundColor = ''
        });
    }

    function moveDown() {
        undraw()
        currPos += width
        draw()
        freeze()
    }

    function control(e) {
        if(e.keyCode === 65) {
            moveLeft()
        }
        if(e.keyCode === 87){
            rotate()
        }
        if(e.keyCode === 68){
            moveRight()
        }
        if(e.keyCode === 83){
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    function freeze() {
        if(curr.some(index => squares[currPos + index + width].classList.contains('taken'))) {
            curr.forEach(index => squares[currPos + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            curr = theTetrominoes[random][currRotation]
            currPos = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function moveLeft() {
        undraw()
        const isAtLeftEdge = curr.some(index => (currPos+index)%width === 0)

        if(!isAtLeftEdge) currPos -=1

        if(curr.some(index => squares[currPos + index].classList.contains('taken'))) {
            currPos += 1
        }
        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = curr.some(index => (currPos+index)%width === 9)

        if(!isAtRightEdge) currPos +=1

        if(curr.some(index => squares[currPos + index].classList.contains('taken'))) {
            currPos -= 1
        }
        draw()
    }

    function rotate() {
        undraw()
        currRotation++

        if(currRotation === curr.length) {
            currRotation = 0
        }
        curr = theTetrominoes[random][currRotation]
        draw()
    }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    const upNext = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNext[nextRandom].forEach(index => {
            displaySquares[displayIndex+index].classList.add('tetromino')
            displaySquares[displayIndex+index].style.backgroundColor = colors[nextRandom]
        })
    }

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            clearBoard();
            draw();
            displayShape();
            score = 0; // Reset the score to 0
            scoreDisplay.innerHTML = score; // Update the score display
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            gameOver();
        }
    });
    

    easy.addEventListener('click', () => {
        timerId = setInterval(moveDown, 1000);
    })

    medium.addEventListener('click', () => {
        timerId = setInterval(moveDown, 500);
    })

    hard.addEventListener('click', () => {
        timerId = setInterval(moveDown, 200);
    })


    function addScore() {
        for(let n = 0; n < 199; n+=width){
            const row = [n, n+1, n+2, n+3, n+4, n+5, n+6, n+7, n+8, n+9]
            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(n, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function clearBoard() {
        for(let n = 0; n < 199; n+=width){
            const row = [n, n+1, n+2, n+3, n+4, n+5, n+6, n+7, n+8, n+9]
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(n, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
        }
    }

    function gameOver() {
        if(curr.some(index => squares[currPos+index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over...'
            clearInterval(timerId)
        }
    }

  });
  