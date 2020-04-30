//global variables
var initGame = {
	//e for empty spot, r for red, b for blue
	board: [
		[ 'e', 'e', 'e', 'e', 'e', 'e', 'e' ],
		[ 'e', 'e', 'e', 'e', 'e', 'e', 'e' ],
		[ 'e', 'e', 'e', 'e', 'e', 'e', 'e' ],
		[ 'e', 'e', 'e', 'e', 'e', 'e', 'e' ],
		[ 'e', 'e', 'e', 'e', 'e', 'e', 'e' ],
		[ 'e', 'e', 'e', 'e', 'e', 'e', 'e' ]
	],
	player1: {
		color: 'red',
		moves: []
	},
	player2: {
		color: 'blue',
		moves: []
	},
	currPlayer: null,
	player1Turn: true,
	currentlyPlaying: true,
	winner: null,
	tie: false
};
var game = initGame;
game.currPlayer = game.player1;

var rows = game.board.length;
var cols = game.board[0].length;
var numInARow = 4;

//functions for behind the scenes game logic

//checks to see if spot on board is empty
function isSpotEmpty(r, c) {
	return game.board[r][c] == 'e';
}

//checks to see if column of board is full
function isColFull(c) {
	for (var r = 0; r < rows; r++) {
		if (isSpotEmpty(r, c)) return false; //if there's an empty spot in the column then it is not full
	}
	return true;
}

//checks to see if board is full
function isBoardFull() {
	for (var r = 0; r < rows; r++) {
		for (var c = 0; c < cols; c++) {
			if (isSpotEmpty(r, c)) return false;
		}
	}
	console.log('Board is full!');
	return true;
}

//checks to see if there are 4 spots in a row for the inputted player (checks horizontal, vertical, and diagonal combinations)
//	and if there is it returns array of tuples of the coordinates, if not returns empty array
function checkWinner(player) {
	var horizontalWinner = checkHorizontalWinner(player);
	var verticalWinner = checkVerticalWinner(player);
	var diagonalWinner = checkDiagonalWinner(player);
	if (horizontalWinner.length !== 0) {
		return horizontalWinner;
	} else if (verticalWinner.length !== 0) {
		return verticalWinner;
	} else if (diagonalWinner.length !== 0) {
		return diagonalWinner;
	} else return [];
}

//checks each row to see if there are 4 moves in a row by player horizontally - returns array of tuples of coordinates if so, if not returns empty array
function checkHorizontalWinner(player) {
	for (var r = 0; r < rows; r++) {
		//loops through and checks each row
		var coords = horizontalNInARow(r, player);
		if (coords.length !== 0) return coords;
	}
	return [];
}

/**
	 * checks to see if there are 4 moves in a row horizontally 
	 	if 2 characters next to each other are same character, increases counter by 1. if different, then resets counter to 1
		goes pair by pair through whole row, if counter gets to 4, then returns the coordinates of the cells.
		
	 * @param row - row number you're searching through
	 * @param player - player's character 
	 * @return - coords - either empty array, or array of tuples of all coords of winning combination
	 */
function horizontalNInARow(row, player) {
	var coords = [];
	var counter = 1; //always have 1 in a row
	for (var col = 0; col < cols - 1; col++) {
		//loop through columns (cells) in the row
		if (game.board[row][col] === player && game.board[row][col + 1] === player) {
			//if current column cell and the next column cell in the row are the same player than increase counter
			counter++;
			if (counter >= numInARow) {
				//if the counter has reached the desired numberInARow (4) then push all of the winning coordinates to coords and then return coords
				for (var i = 1; i <= numInARow; i++) {
					coords.push([ row, col - numInARow + i + 1 ]); //need to add 1 at the end because the last col is the 2nd to last coord
				}
				return coords;
			}
			//if pair of cells doesnt match, then counter is back to 1
		} else counter = 1;
	}
	return coords;
}

//checks each column to see if there are 4 moves in a row by a player vertically - returns array of tuples of coordinates if so, if not returns empty array
function checkVerticalWinner(player) {
	for (var col = 0; col < cols; col++) {
		//loops through and checks each column
		var coords = verticalNInARow(col, player);
		if (coords.length !== 0) return coords;
	}
	return [];
}

/**
	 * checks to see if there are 4 moves in a row vertically 
		if 2 characters next to each other are same character, increases counter by 1. if different, then resets counter to 1
		goes pair by pair through the whole column, if counter gets to 4, then returns the coordinates of the cells.
	 * 
	 * @param col - column number you're searching through
	 * @param player - player's character
	 * @return - consecInARow - true if there are 4 characters in a row vertically
	 */
function verticalNInARow(col, player) {
	var coords = [];
	var counter = 1; //always have 1 in a row
	for (var r = 0; r < rows - 1; r++) {
		//loop through cells in the column
		if (game.board[r][col] === player && game.board[r + 1][col] === player) {
			//if current row and the next row in column are same player than increase counter
			counter++;
			if (counter >= numInARow) {
				//if the counter has reached the desired 4 in a row then return true
				//want to get these coords now: r-numInARow+1 will be the row of the first in the sequence -> return array of arrays with coords for all spots?
				for (var i = 1; i <= numInARow; i++) {
					coords.push([ r - numInARow + i + 1, col ]); //need to add 1 at the end because the last col is the 2nd to last coord
				}
				return coords;
			}
		} else counter = 1;
	}
	return coords;
}

//checks all possible diagonals to see if there are 4 moves in a row by player, if so returns the an array of the tuples of coordinates for the winning cells
function checkDiagonalWinner(player) {
	if (checkTLBR_DiagWinner(player).length !== 0) return checkTLBR_DiagWinner(player);
	else if (checkTRBL_DiagWinner(player).length !== 0) return checkTRBL_DiagWinner(player);
	else return [];
}

//checks all possible diagonals of 4 length going from top left to bottom right
function checkTLBR_DiagWinner(player) {
	var coords = [];
	var counter = 1;
	for (var r = 0; r <= rows - numInARow; r++) {
		for (var col = 0; col <= cols - numInARow; col++) {
			//looks at only the possible starting places where you can make a N-length diagonal from TL to BR
			for (var d = 0; d < numInARow - 1; d++) {
				if (game.board[r + d][col + d] === player && game.board[r + d + 1][col + d + 1] === player) {
					//starting at the (r,c) point found above, goes in a diagonal in the south-east direction to see if there are N consecutive spots (checking in pairs)
					counter++;
					if (counter >= numInARow) {
						for (var i = 0; i < numInARow; i++) {
							coords.push([ r + i, col + i ]);
						}
						console.log(coords);
						return coords;
					}
					//else the 2 spots are not the same player, so reset counter to 1
				} else counter = 1;
			}
		}
	}
	return coords;
}

//checks all possible diagonals of 4 length going from top right to bottom left
function checkTRBL_DiagWinner(player) {
	var coords = [];
	var counter = 1;
	for (var r = 0; r <= rows - numInARow; r++) {
		for (var col = cols - 1; col >= numInARow - 1; col--) {
			//looks at only the possible starting places where you can make a N-length diagonal from TL to BR
			for (var d = 0; d < numInARow - 1; d++) {
				//starting at the (r,c) point found above, goes in a diagonal in the south-west direction to see if there are N consecutive spots (checking in pairs)
				if (game.board[r + d][col - d] === player && game.board[r + d + 1][col - d - 1] === player) {
					counter++;
					if (counter >= numInARow) {
						for (var i = 0; i < numInARow; i++) {
							coords.push([ r + i, col - i + 2 ]); //since row and column are at the top right coordinates of the diagonol, we need to add to the row coordinates since we're going down, and we need to subtract from the column coordinate since we're going left
						}
						console.log(coords);
						return coords;
					}
				} else counter = 1;
			}
		}
	}
	return coords;
}

//gets called after a move - either there was a winner, board is full, or it initiates game play for next move
function updateGameStatus() {
	var winner = checkWinner(game.currPlayer.color);
	if (winner.length !== 0) {
		console.log('WINNER');
		highlightWinningCells(winner);
		game.currentlyPlaying = false;
		game.winner = game.currPlayer;
	} else if (isBoardFull()) {
		console.log('tie');
		game.currentlyPlaying = false;
		game.tie = true;
	} else {
		initiateNextMove();
	}
	updateScoreBoard();
}

//resets the game to initial board, playersMoves, etc.
function resetGame() {
	game = initGame;
	game.currPlayer = game.player1;
}

function initiateNextMove() {
	//game still going - change game's playerTurn and game's current player
	game.player1Turn = !game.player1Turn; //change player turn
	if (game.player1Turn) game.currPlayer = game.player1;
	else game.currPlayer = game.player2;
}

//adds player's move to the game board and players' moves array and returns the coordinates of the row/col where move was made
function move(player, col) {
	if (!isColFull(col)) {
		for (var r = rows - 1; r >= 0; r--) {
			//need to find lowest point in column where there is an empty spot to move
			if (isSpotEmpty(r, col)) {
				game.board[r][col] = player.color; //fill in board array with move
				player.moves.push(col); //add move to player's moveTracker array
				return [ r, col ]; //have this return the coordinates??
			}
		}
	} else {
		console.log('column is full');
		return null;
	}
}

//GUI
//set up IDs for divs that represent the cells and add event listeners
var rowDivs = document.querySelectorAll('.row');
for (var rowID = 0; rowID < rowDivs.length; rowID++) {
	//top to bottom (row 0 is above the board)
	var cellsForRow = rowDivs[rowID].children;
	for (var colID = 0; colID < cellsForRow.length; colID++) {
		var cell = cellsForRow[colID];
		cell.id = 'row' + rowID + 'Col' + colID;
		cell.addEventListener('mouseover', placeTop);
		cell.addEventListener('mouseout', removeTop);
		cell.addEventListener('click', dropPiece);
	}
}

//this function is called when mouse scrolls over a column
//  updates the top row display above the board by adding a circle
function placeTop() {
	if (game.currentlyPlaying) {
		var col = parseInt(this.id.slice(-1)); //"this" is the cell that has the event listener that was triggered - we want to grab the ID of the cell and then take the last character from the string which is the col number
		var span = topRowSpanForCol(col);
		addCircle(span);
	}
}

//this function is called when mouse leaves a column
//  updates the top row display above the board by removing the circle
function removeTop() {
	if (game.currentlyPlaying) {
		var col = parseInt(this.id.slice(-1)); //"this" is the cell that has the event listener that was triggered - we want to grab the ID of the cell and then take the last character from the string which is the col number
		var span = topRowSpanForCol(col);
		removeCircle(span);
	}
}

//this function is called when a column is clicked
//  function uses guiPlayerMove to calculate the move and then visually represent it on the board,
//  THEN it checks to see if there is a winner or a tie
//  then updates the top row display above the board
function dropPiece() {
	if (game.currentlyPlaying) {
		var col = parseInt(this.id.slice(-1)); //"this" is the div that has the event listener that was triggered - we want to grab the ID of the cell and then take the last character from the string which is the col number
		if (guiPlayerMove(game.currPlayer, col) === null) return;
		//check to see if game is still going on
		updateGameStatus();

		//update top row display above the board
		var span = topRowSpanForCol(col);
		if (game.currentlyPlaying)
			addCircle(span); //if game is still playing (previous move didn't end in a winner or tie)
		else removeCircle(span); //game is over, so want to get rid of the hoverTop above the board
	}
}

//takes the coords from move function and then visually displays the move on the screen
function guiPlayerMove(player, col) {
	// var col = prompt('Player ' + player.color + ': what column?');
	try {
		var coords = move(player, col);
		var rowDisplay = coords[0] + 1;
		var colDisplay = coords[1];
		displayCircleOnBoard(rowDisplay, colDisplay);
		displayMovesHistory(player);
		return coords;
	} catch (error) {
		console.log('gui player invalid move');
		return null;
	}
}

function updateScoreBoard() {
	//game still going - change game's playerTurn and game's current player
	var scoreboard = document.querySelector('#scoreboard');
	scoreboard.textContent = '';
	scoreboard.classList.remove('redPlayer', 'bluePlayer');
	var currColor = game.currPlayer.color;
	if (game.currentlyPlaying) {
		scoreboard.textContent = currColor.charAt(0).toUpperCase() + currColor.slice(1) + "'s Turn";
		scoreboard.classList.add(currColor + 'Player');
	} else {
		if (game.tie) {
			scoreboard.textContent = 'Tie Game!';
		}
		if (game.winner) {
			scoreboard.textContent = currColor.charAt(0).toUpperCase() + currColor.slice(1) + ' is the WINNER!!!';
			scoreboard.classList.add(currColor + 'Player');
		}
	}
}

function highlightWinningCells(winningCellCoords) {
	for (var i = 0; i < winningCellCoords.length; i++) {
		var rowDisplay = winningCellCoords[i][0] + 1;
		var colDisplay = winningCellCoords[i][1];
		var div = document.querySelector('#row' + rowDisplay + 'Col' + colDisplay);
		div.style.border = '.1rem green solid';
	}
}

//adds visual display of circle of current player's color to desired spot on the board
function displayCircleOnBoard(row, col) {
	var div = document.querySelector('#row' + row + 'Col' + col);
	var span = div.children[0];
	addCircle(span);
}

//changes text content of the span that tracks each players' moves (game.player.moves)
function displayMovesHistory(player) {
	var spanPlayerMoves = document.querySelector('#' + player.color + 'PlayerMoves');
	spanPlayerMoves.textContent = player.moves;
}

//helper function to quickly grab span in top row for adding circles for topRowDisplay
function topRowSpanForCol(col) {
	var topRow = document.querySelector('#topRow');
	return topRow.children[col].children[0];
}

//adds visual display of circle of current player's color to inputted span
function addCircle(span) {
	span.classList.add('circle');
	span.classList.remove(game.player1.color, game.player2.color);
	span.classList.add(game.currPlayer.color);
}

//removes circle from inputted span
function removeCircle(span) {
	span.classList.remove('circle', game.player1.color, game.player2.color);
}
