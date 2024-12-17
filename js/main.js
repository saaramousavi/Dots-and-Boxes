const board = Array(9).fill(null);
let currentPlayer = 'player-1'; // Player 1 starts (blue)
const gameBoard = document.getElementById('gameBoard');
const messageElement = document.getElementById('message');
const modal = document.getElementById('modal');
const restartButton = document.getElementById('restartButton');
const modalMessage = document.getElementById('modalMessage');

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Minimax Algorithm for AI
function minimax(board, depth, isMaximizing) {
    const winner = checkWinner();
    if (winner === 'player-2') return 10 - depth;
    if (winner === 'player-1') return depth - 10;
    if (board.every(cell => cell !== null)) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'player-2';
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = null;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'player-1';
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = null;
            }
        }
        return best;
    }
}

function aiMove() {
    let bestMove = -1;
    let bestValue = -Infinity;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'player-2';
            let moveValue = minimax(board, 0, false);
            board[i] = null;
            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = i;
            }
        }
    }
    board[bestMove] = 'player-2';
    gameBoard.children[bestMove].classList.add('player-2');
    const winner = checkWinner();
    if (winner) {
        showWinnerModal(winner);
    } else if (board.every(cell => cell !== null)) {
        showTieModal();
    } else {
        currentPlayer = 'player-1';
        messageElement.textContent = 'نوبت شماست!';
    }
}

function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (board[index] || checkWinner()) return;

    board[index] = currentPlayer;
    event.target.classList.add(currentPlayer);

    const winner = checkWinner();
    if (winner) {
        showWinnerModal(winner);
    } else if (board.every(cell => cell !== null)) {
        showTieModal();
    } else {
        currentPlayer = currentPlayer === 'player-1' ? 'player-2' : 'player-1';
        messageElement.textContent = currentPlayer === 'player-1' ? 'نوبت شماست!' : 'نوبت هوش مصنوعی است!';
        if (currentPlayer === 'player-2') aiMove();
    }
}

function showWinnerModal(winner) {
    const winnerText = winner === 'player-1' ? 'شما برنده شدید!' : 'هوش مصنوعی برنده شد!';
    modalMessage.textContent = winnerText;
    messageElement.textContent = winnerText;
    modal.style.display = 'flex';
}

function showTieModal() {
    modalMessage.textContent = 'مساوی شد!';
    messageElement.textContent = 'مساوی شد!';
    modal.style.display = 'flex';
}

function resetGame() {
    board.fill(null);
    currentPlayer = 'player-1';
    messageElement.textContent = 'نوبت شماست!';
    gameBoard.style.pointerEvents = 'auto';
    modal.style.display = 'none';
    Array.from(gameBoard.children).forEach(cell => {
        cell.classList.remove('player-1', 'player-2');
    });
}

restartButton.addEventListener('click', resetGame);
gameBoard.addEventListener('click', handleCellClick);