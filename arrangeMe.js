function setup(number_of_blocks_in_side) {
	buildGameBoard(number_of_blocks_in_side);
	scrumbleBoard();
}


function buildGameBoard(number_of_blocks_in_side) {
	var table = document.getElementById("gameBoard");
	var counter = number_of_blocks_in_side * number_of_blocks_in_side;
	for (var i = 0; i < number_of_blocks_in_side; i++) {
		var row = table.insertRow(0);
		for (var j = 0; j < number_of_blocks_in_side; j++) {
			var cell = row.insertCell(0);
			cell.className = "game_block";
			cell.id = counter;
			cell.textContent = counter;
			cell.onclick = function() {moveBlock(this)}
			counter--;
		}
	}
	table.rows[number_of_blocks_in_side - 1].cells[number_of_blocks_in_side - 1].textContent = "";
}


function checkIfBlockEmpty(id) {
	var block = document.getElementById(id);
	if (block.textContent == "") {
		return true;
	}
	return false;
}


function getEmptyCoupledBlocksId(id) {
	id = parseInt(id)
	var table = document.getElementById("gameBoard");
	var row_length = table.rows.length;
	var number_of_cells = row_length * row_length;
	//check upper block
	if (id > row_length) {
		var upper_block_id = id - row_length;
		if (checkIfBlockEmpty(upper_block_id)) {
			return upper_block_id;
		}
	}
	//check bottom block
	if (id <= number_of_cells - row_length) {
		var bottom_block_id = id + row_length;
		if (checkIfBlockEmpty(bottom_block_id)) {
			return bottom_block_id;
		}
	}
	//check left block
	if (id % row_length !== 1) {
		var left_block_id = id - 1;
		if (checkIfBlockEmpty(left_block_id)) {
			return left_block_id;
		}
	}
	//check right block
	if (id % row_length !== 0) {
		var right_block_id = id + 1;
		if (checkIfBlockEmpty(right_block_id)) {
			return right_block_id;
		}
	}
	return null;
}


function moveBlock(cellObject) {
	var empty_coupled_block_id = getEmptyCoupledBlocksId(cellObject.id);
	if (empty_coupled_block_id) {
		var illegalMove = document.getElementById("illegalMove");
		illegalMove.style.display = "none";
		var empty_coupled_block = document.getElementById(empty_coupled_block_id);
		empty_coupled_block.textContent = cellObject.textContent;
		cellObject.textContent = "";
		var winMessage = document.getElementById("winMessage");
		var is_board_arranged = checkIfBoardIsArranged();
		if (is_board_arranged) {
			winMessage.style.display = "inline";
		}
		else {
			winMessage.style.display = "none";
		}
	}
	else {
		var illegalMove = document.getElementById("illegalMove");
		illegalMove.style.display = "inline";
	}
}


function checkIfBoardIsArranged() {
	var table = document.getElementById("gameBoard");
	var row_length = table.rows.length;
	var number_of_cells = row_length * row_length;
	for (var i = 1; i < number_of_cells; i++) {
		var cell = document.getElementById(i);
		if (cell.id !== cell.textContent) {
			return false;
		}
	}
	return true;
}


function createsSidesDictionary() {
	var sides_dictionary = {};
	sides_dictionary[1] = "upper_block";
	sides_dictionary[2] = "bottom_block";
	sides_dictionary[3] = "left_block";
	sides_dictionary[4] = "right_block";
	return sides_dictionary
}


function scrumbleBoard() {
	var table = document.getElementById("gameBoard");
	var row_length = table.rows.length;
	var number_of_cells = row_length * row_length;
	var number_of_moves = 1000;
	var empty_cell_id = number_of_cells;
	for (var i = 0; i < number_of_moves; i++) {
		var random_side = Math.floor((Math.random() * 4) + 1);
		var sides_dictionary = createsSidesDictionary();
		//switch with upper block
		if (sides_dictionary[random_side] === "upper_block") {
			if (empty_cell_id > row_length) {
				empty_cell_id = empty_cell_id - row_length;
				upper_block = document.getElementById(empty_cell_id);
				moveBlock(upper_block);
			}
		}
		//switch with bottom block
		if (sides_dictionary[random_side] === "bottom_block") {
			if (empty_cell_id <= number_of_cells - row_length) {
				empty_cell_id = empty_cell_id + row_length;
				bottom_block = document.getElementById(empty_cell_id);
				moveBlock(bottom_block);
			}
		}
		//switch with left block
		if (sides_dictionary[random_side] === "left_block") {
			if (empty_cell_id % row_length !== 1) {
				empty_cell_id = empty_cell_id - 1
				left_block = document.getElementById(empty_cell_id);
				moveBlock(left_block);
			}
		}
		//switch with right block
		if (sides_dictionary[random_side] === "right_block") {
			if (empty_cell_id % row_length !== 0) {
				empty_cell_id = empty_cell_id + 1;
				right_block = document.getElementById(empty_cell_id);
				moveBlock(right_block);
			}
		}
	}
}