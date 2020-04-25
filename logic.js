//e for empty spot, r for red, b for blue
var game = {
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
	currentlyPlaying: true
};
game.currPlayer = game.player1;
var rows = game.board.length;
var cols = game.board[0].length;

//checks to see if spot on board is empty
function isSpotEmpty(r, c) {
	if (game.board[r][c] == 'e') return true;
	else return false;
}

//checks to see if column of board is full
function isColFull(c) {
	var countEmptySpots = 0;
	for (var r = 0; r < rows; r++) {
		if (isSpotEmpty(r, c)) {
			countEmptySpots++;
			break;
		}
	}
	if (countEmptySpots != 0) return false;
	else return true;
}

//checks to see if board is full
function isBoardFull() {
	var countEmptySpots = 0;
	for (var r = 0; r < rows; r++) {
		for (var c = 0; c < cols; c++) {
			if (isSpotEmpty(r, c)) countEmptySpots++;
		}
	}
	if (countEmptySpots != 0) return false;
	else {
		System.out.println('Board is full!');
		return true;
	}
}

function resetGame() {
	game = {
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
		currPlayer: game.player1,
		player1Turn: true,
		currentlyPlaying: true
	};
}

//checks to see if there are 4 spots in a row for the inputted player (checks horizontal, vertical, and diagonal combinations)
function checkWinner(player) {
	if (checkHorizontalWinner(player) || checkVerticalWinner(player) || checkDiagonalWinner(player)) {
		console.log('Player ' + player + ' is the WINNER!!!');
		return true;
	} else return false;
}

//checks each row to see if there are 4 moves in a row by player horizontally
function checkHorizontalWinner(player) {
	for (var r = 0; r < rows; r++) {
		//loops through and checks each row
		if (horizontal4InARow(r, player)) return true;
	}
	return false;
}

/**
	 * checks to see if there are 4 moves in a row horizontally 
	 	if 2 characters next to each other are same character, increases counter by 1. if different, then resets counter to 1
		goes pair by pair through whole row, if counter gets to 4, then returns true.
		
	 * @param row - row number you're searching through
	 * @param player - player's character 
	 * @return - consecInARow - true if there are 4 characters in a row horizontally
	 */
function horizontal4InARow(row, player) {
	var numInARow = 4;
	var consecInARow = false;
	var counter = 1; //always have 1 in a row
	for (var col = 0; col < cols - 1; col++) {
		//loop through cells in the row
		if (game.board[row][col] === player && game.board[row][col + 1] === player) {
			//if current column and the next column in row are same player than increase counter
			counter++;
			if (counter >= numInARow) {
				//if the counter has reached the desired 4 in a row then return true
				consecInARow = true;
				break;
			}
		} else counter = 1;
	}
	return consecInARow;
}

//checks each column to see if there are 4 moves in a row by a player vertically
function checkVerticalWinner(player) {
	for (var col = 0; col < cols; col++) {
		//loops through and checks each column
		if (vertical4InARow(col, player)) return true;
	}
	return false;
}

/**
	 * checks to see if there are 4 moves in a row vertically 
		if 2 characters next to each other are same character, increases counter by 1. if different, then resets counter to 1
		goes pair by pair through the whole column, if counter gets to 4, then returns true
	 * 
	 * @param col - column number you're searching through
	 * @param player - player's character
	 * @return - consecInARow - true if there are 4 characters in a row vertically
	 */
function vertical4InARow(col, player) {
	var numInARow = 4;
	var consecInARow = false;
	var counter = 1; //always have 1 in a row
	for (var r = 0; r < rows - 1; r++) {
		//loop through cells in the column
		if (game.board[r][col] === player && game.board[r + 1][col] === player) {
			//if current row and the next row in column are same player than increase counter
			counter++;
			if (counter >= numInARow) {
				//if the counter has reached the desired 4 in a row then return true
				//want to get these coords now: r-numInARow+1 will be the row of the first in the sequence -> return array of arrays with coords for all spots?
				consecInARow = true;
				break;
			}
		} else counter = 1;
	}
	return consecInARow;
}

//checks all possible diagonals to see if there are 4 moves in a row by player
function checkDiagonalWinner(player) {
	if (checkTLBR_DiagWinner(player) || checkTRBL_DiagWinner(player)) return true;
	else return false;
}

//checks all possible diagonals of 4 length going from top left to bottom right
function checkTLBR_DiagWinner(player) {
	var numInARow = 4;
	var consec = false;
	var counter = 1;
	for (var r = 0; r <= rows - numInARow; r++) {
		for (var col = 0; col <= cols - numInARow; col++) {
			//looks at only the possible starting places where you can make a N-length diagonal from TL to BR
			for (var d = 0; d < numInARow - 1; d++) {
				if (game.board[r + d][col + d] === player && game.board[r + d + 1][col + d + 1] === player) {
					//starting at the (r,c) point found above, goes in a diagonal in the south-east direction to see if there are N consecutive spots (checking in pairs)
					counter++;
					if (counter >= numInARow) {
						consec = true;
						break;
					}
				} else counter = 1;
			}
		}
	}
	return consec;
}

//checks all possible diagonals of 4 length going from top right to bottom left
function checkTRBL_DiagWinner(player) {
	var numInARow = 4;
	var consec = false;
	var counter = 1;
	for (var r = 0; r <= rows - numInARow; r++) {
		for (var col = cols - 1; col >= numInARow - 1; col--) {
			//looks at only the possible starting places where you can make a N-length diagonal from TL to BR
			for (var d = 0; d < numInARow - 1; d++) {
				//starting at the (r,c) point found above, goes in a diagonal in the south-west direction to see if there are N consecutive spots (checking in pairs)
				if (game.board[r + d][col - d] === player && game.board[r + d + 1][col - d - 1] === player) {
					counter++;
					if (counter >= numInARow) {
						consec = true;
						break;
					}
				} else counter = 1;
			}
		}
	}
	return consec;
}

//gets called after a move - either there was a winner, board is full, or it initiates game play for next move
function updateGameStatus() {
	if (checkWinner(game.currPlayer.color)) {
		console.log('WINNER');
		game.currentlyPlaying = false;
	} else if (isBoardFull()) {
		console.log('tie');
		game.currentlyPlaying = false;
	} else {
		initiateNextMove();
	}
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
		guiPlayerMove(game.currPlayer, col);
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
	} catch (error) {
		console.log('invalid move');
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
