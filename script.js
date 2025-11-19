const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const pvpBtn = document.getElementById('pvp');
const pvcBtn = document.getElementById('pvc');
const resetBtn = document.getElementById('reset');

let gameState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = false;
let isVsComputer = false;

const winLine = document.getElementById("winLine");

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (gameState[index] !== '' || !isGameActive) return;

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');
    cell.classList.add(currentPlayer);

    const winCombo = checkWin();
    if (winCombo) {
        drawWinLine(winCombo);
        message.textContent = `Player ${currentPlayer} wins!`;
        isGameActive = false;
        return;
    }

    if (gameState.every(cell => cell !== '')) {
        message.textContent = "It's a draw!";
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}'s turn`;

    if (isVsComputer && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    let availableCells = [];
    gameState.forEach((cell, index) => {
        if (cell === '') availableCells.push(index);
    });

    if (availableCells.length === 0) return;

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    gameState[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';
    cells[randomIndex].classList.add('taken');
    cells[randomIndex].classList.add('O');

    const winCombo = checkWin();
    if (winCombo) {
        drawWinLine(winCombo);
        message.textContent = 'Computer wins!';
        isGameActive = false;
        return;
    }

    if (gameState.every(cell => cell !== '')) {
        message.textContent = "It's a draw!";
        isGameActive = false;
        return;
    }

    currentPlayer = 'X';
    message.textContent = "Player X's turn";
}

function checkWin() {
    for (let combo of winningConditions) {
        if (
            gameState[combo[0]] === currentPlayer &&
            gameState[combo[1]] === currentPlayer &&
            gameState[combo[2]] === currentPlayer
        ) {
            return combo;
        }
    }
    return null;
}

function drawWinLine(combo) {
    const boardRect = board.getBoundingClientRect();
    const rects = [...cells].map(c => c.getBoundingClientRect());

    const startRect = rects[combo[0]];
    const endRect = rects[combo[2]];

    let startX = startRect.left + startRect.width / 2 - boardRect.left;
    let startY = startRect.top + startRect.height / 2 - boardRect.top;

    let endX = endRect.left + endRect.width / 2 - boardRect.left;
    let endY = endRect.top + endRect.height / 2 - boardRect.top;

    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);

    const extend = 28;

    const ux = dx / length; 
    const uy = dy / length; 

    startX -= ux * extend;
    startY -= uy * extend;

    endX += ux * extend;
    endY += uy * extend;

    const finalLength = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    winLine.style.left = `${startX}px`;
    winLine.style.top = `${startY}px`;
    winLine.style.width = `${finalLength}px`;
    winLine.style.transform = `rotate(${angle}deg)`;
    winLine.style.opacity = 1;
}

function clearWinLine() {
    winLine.style.opacity = 0;
    winLine.style.width = "0px";
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = false;
    message.textContent = 'Choose a mode to start!';

    clearWinLine();

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'X', 'O');
    });
}

function startPvP() {
    resetGame();
    isVsComputer = false;
    isGameActive = true;
    message.textContent = "Player X's turn";
}

function startPvC() {
    resetGame();
    isVsComputer = true;
    isGameActive = true;
    message.textContent = "Player X's turn";
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
pvpBtn.addEventListener('click', startPvP);
pvcBtn.addEventListener('click', startPvC);
resetBtn.addEventListener('click', resetGame);