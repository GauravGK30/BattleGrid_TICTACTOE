
const mainBoardEle = document.getElementById('main-board');
const subBoardEle = document.getElementById('sub-board');
const model = document.getElementById('modal');
const subPlayerEle = document.getElementById('sub-player');
const cancelBtn = document.getElementById('cancel-sub');
const resetBtn = document.getElementById('reset')
cancelBtn.addEventListener('click', () => {
  cancelSubGame(); 
});

const statusEle = document.getElementById('status');

const cell = document.querySelectorAll("#main-board .cell");
const subCells =document.querySelectorAll('#sub-board .cell');

let mainBoard = Array(9).fill(null);
let mainTurn = "X";
let waitingForMainClick = false;
let pendingMainSymbol = null;

let subBoard = Array(9).fill(null);
let subTurn ='X';
let activeCellIndex = null;
let gameOver = false;



function createMainBoard(){
  const cell = document.querySelectorAll("#main-board .cell");

  cell.forEach(cells => {
    const index =parseInt(cells.dataset.index);

    cells.addEventListener('click',()=>{
      if(gameOver)return;
      if(waitingForMainClick){
        if(index !== activeCellIndex || mainBoard[index])

        cells.innerHTML = pendingMainSymbol;
        mainBoard[index] = pendingMainSymbol;
        cells.classList.add('locked');
        
        if(checkWinner(mainBoard)){
          updateStatus(`Player ${pendingMainSymbol} wins the Battle Grid Game!`);
          gameOver = true;
        } else if (isDraw(mainBoard)) {
          updateStatus(`The Battle Grid Game is a draw!`);
          gameOver = true;
        }else {
          mainTurn = switchTurn(mainTurn);
          updateStatus();
        }
        pendingMainSymbol= null;
        waitingForMainClick = false;
        return
      }
      
      if (mainBoard[index]) return;
      if(!model.classList.contains('hidden')) return;

      openSubGame(index);
    })
  });
};



function createSubBoard(){
  // subBoardEle.innerHTML = '';
  const subCells =document.querySelectorAll('#sub-board .cell');

  subCells.forEach(cell => {
    const i = parseInt(cell.dataset.index);
    cell.addEventListener('click',()=>{
      playSubGame(i,cell);
    })
  })
};



function openSubGame(index){

  if(mainBoard[index] || model.classList.contains('hidden')===false || gameOver) return; //not open if maingame is done
  activeCellIndex = index ;  //set all cell index

  //reset sub boards
  subBoard = Array(9).fill(null)
  subTurn = mainTurn;
  subPlayerEle.textContent = subTurn;

  //clear all sub cells visually
  document.querySelectorAll('#sub-board .cell').forEach(cell =>{
    cell.innerHTML = '';
    cell.classList.remove('locked');
  });
  model.classList.remove('hidden');

};



function playSubGame(index,cell){
  if(subBoard[index] || gameOver) return;

  subBoard[index] = subTurn;
  cell.innerHTML = subTurn;

  if(checkWinner(subBoard)){
    pendingMainSymbol = subTurn;
    waitingForMainClick =true;
    model.classList.add('hidden');

    const mainCell = document.querySelectorAll('#main-board .cell')[activeCellIndex];

    mainCell.classList.remove('locked'); 
    updateStatus(`Player ${subTurn} won sub-game. Click on main board cell to place move.`);

    if(checkWinner(mainBoard)){
      document.getElementById('status').innerText = `Player ${subTurn} wins the BattelGrid Game`;
      gameOver = true;
    }else if (isDraw(mainBoard)) {
      updateStatus(`The Battle Grid Game is a draw!`);
      gameOver = true;
    }

    endSubGame();
    

  }else if(subBoard.every(val => val !== null)){
    model.classList.add('hidden');
    updateStatus(`Sub-game is a draw. No move will be placed on main board.`);

    waitingForMainClick = false;
    pendingMainSymbol = null;
    endSubGame();

  }else{
    subTurn = switchTurn(subTurn)  
    subPlayerEle.textContent = subTurn;
  }

};



function checkWinner(board){
  const winPatterns=[
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [6, 7, 8],
    [2, 4, 6],
    [3, 4, 5],
  ];

  return winPatterns.some(pattern => {
    const [a,b,c] = pattern;
    return board[a]&&board[a] === board[b]&&board[b] === board[c]&&board[c]
  })
};


function isDraw(board) {
  return board.every(cell => cell !== null);
}


function switchTurn(current){
  return current ==='X'?'O':'X';
}



function endSubGame(){
  model.classList.add('hidden')
  subBoard = Array(9).fill(null);
  activeCellIndex = null;
  subTurn = 'X';
};



function cancelSubGame(){

  model.classList.add('hidden');

  //resent subboard
  subBoard= Array(9).fill(null);
  activeCellIndex = null;
  subTurn ="X";

  document.querySelectorAll('#sub-board .cell').forEach(cell => {
  cell.innerText = '';
  cell.classList.remove('locked');

  });
  updateStatus();
};





function updateStatus(message = '') {

  if (message) {
    statusEle.innerText = message;
  } else {
    statusEle.innerText = `Player ${mainTurn}'s turn`;
  }
}


function resetGame() {
  mainBoard = Array(9).fill(null);
  mainTurn = 'X';
  waitingForMainClick = false;
  pendingMainSymbol = null;
  document.querySelectorAll('#main-board .cell').forEach(cell => {
  cell.innerHTML = '';
  cell.classList.remove('locked');
  });

  statusEle.textContent = `Main Turn: ${mainTurn}`;
  createMainBoard();
}

createMainBoard()
createSubBoard()
updateStatus();

resetBtn.addEventListener('click',()=>{
  resetGame();
})

