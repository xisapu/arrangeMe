var actions_history = [];


function setup(number_of_blocks_in_side) {
	var table = document.getElementById("gameBoard");
	var image = document.getElementById("hiddenImage");
	table.style.width = image.width + "px";
	table.style.height = image.height + "px";
	buildGameBoardWithNumbers(number_of_blocks_in_side);
	scrumbleBoard();
}


function buildGameBoardWithNumbers(number_of_blocks_in_side) {
	var table = document.getElementById("gameBoard");
	var counter = number_of_blocks_in_side * number_of_blocks_in_side;
	var percentage_for_background = 100 / (number_of_blocks_in_side - 1);
	for (var i = 0; i < number_of_blocks_in_side; i++) {
		var row = table.insertRow(0);
		for (var j = 0; j < number_of_blocks_in_side; j++) {
			var cell = row.insertCell(0);
			cell.className = "game_block";
			cell.id = counter;
			cell.value = counter;
			cell.onclick = function() {moveBlock(this)}
			counter--;
			cell.style.backgroundPositionX = (100 - (j * percentage_for_background)) + "%";
			cell.style.backgroundPositionY = (100 - (i * percentage_for_background)) + "%";;
		}
	}
	var empty_cell = table.rows[number_of_blocks_in_side - 1].cells[number_of_blocks_in_side - 1];
	empty_cell.textContent = "";
	empty_cell.value = "";
	empty_cell.style.backgroundImage = "None";
}


function checkIfBlockEmpty(id) {
	var block = document.getElementById(id);
	if ((block.value === "") && (block.children.length === 0)) {
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


function switchBlocksContent(block1, block2) {
	var temp_text_content = block1.textContent;
	block1.textContent = block2.textContent;
	block2.textContent = temp_text_content;
	var temp_value = block1.value;
	block1.value = block2.value;
	block2.value = temp_value;
	var temp_background_position = block1.style.backgroundPosition;
	block1.style.backgroundPosition = block2.style.backgroundPosition;
	block2.style.backgroundPosition = temp_background_position;
	var temp_background_image = block1.style.backgroundImage;
	block1.style.backgroundImage = block2.style.backgroundImage;
	block2.style.backgroundImage = temp_background_image;
}


function moveBlock(cellObject) {
	var empty_coupled_block_id = getEmptyCoupledBlocksId(cellObject.id);
	if (empty_coupled_block_id) {
		var illegalMove = document.getElementById("illegalMove");
		illegalMove.style.display = "none";
		actions_history.push(empty_coupled_block_id);
		var empty_coupled_block = document.getElementById(empty_coupled_block_id);
		switchBlocksContent(cellObject, empty_coupled_block);
		empty_coupled_block.style.transform = "translateY(3px)";
		cellObject.style.transform = "translateY(3px)";
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
		if (cell.id !== cell.value) {
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
		if (sides_dictionary[random_side] === "upper_block") {
			if (empty_cell_id > row_length) {
				empty_cell_id = empty_cell_id - row_length;
				upper_block = document.getElementById(empty_cell_id);
				moveBlock(upper_block);
			}
		}
		if (sides_dictionary[random_side] === "bottom_block") {
			if (empty_cell_id <= number_of_cells - row_length) {
				empty_cell_id = empty_cell_id + row_length;
				bottom_block = document.getElementById(empty_cell_id);
				moveBlock(bottom_block);
			}
		}
		if (sides_dictionary[random_side] === "left_block") {
			if (empty_cell_id % row_length !== 1) {
				empty_cell_id = empty_cell_id - 1
				left_block = document.getElementById(empty_cell_id);
				moveBlock(left_block);
			}
		}
		if (sides_dictionary[random_side] === "right_block") {
			if (empty_cell_id % row_length !== 0) {
				empty_cell_id = empty_cell_id + 1;
				right_block = document.getElementById(empty_cell_id);
				moveBlock(right_block);
			}
		}
	}
	actions_history = [];
}


function undoAction() {
	if (actions_history.length > 0) {
		var block = document.getElementById(actions_history.pop());
		moveBlock(block);
		actions_history.pop()
	}
}


function createsKeysDictionary() {
	var keys_dictionary = {};
	keys_dictionary['ArrowDown'] = "switch upper block";
	keys_dictionary['s'] = "switch upper block";
	keys_dictionary['S'] = "switch upper block";
	keys_dictionary['ArrowUp'] = "switch bottom block";
	keys_dictionary['w'] = "switch bottom block";
	keys_dictionary['W'] = "switch bottom block";
	keys_dictionary['ArrowRight'] = "switch left block";
	keys_dictionary['d'] = "switch left block";
	keys_dictionary['D'] = "switch left block";
	keys_dictionary['ArrowLeft'] = "switch right block";
	keys_dictionary['a'] = "switch right block";
	keys_dictionary['A'] = "switch right block";
	return keys_dictionary;
}


function findEmptyBlockId() {
	var table = document.getElementById("gameBoard");
	var row_length = table.rows.length;
	var number_of_cells = row_length * row_length;
	for (var i = 1; i <= number_of_cells; i++) {
		var block = document.getElementById(i);
		if (block.value === "") {
			return i;
		}
	}
}


function keyPressManager(event) {
	var key = event.key;
	var keys_dictionary = createsKeysDictionary();
	var empty_block_id = findEmptyBlockId();
	var table = document.getElementById("gameBoard");
	var row_length = table.rows.length;
	var number_of_cells = row_length * row_length;
	if (keys_dictionary[key] === "switch upper block") {
		if (empty_block_id > row_length) {
			empty_block_id = empty_block_id - row_length;
			upper_block = document.getElementById(empty_block_id);
			moveBlock(upper_block);
		}
	}
	if (keys_dictionary[key] === "switch bottom block") {
		if (empty_block_id <= number_of_cells - row_length) {
			empty_block_id = empty_block_id + row_length;
			bottom_block = document.getElementById(empty_block_id);
			moveBlock(bottom_block);
		}
	}
	if (keys_dictionary[key] === "switch left block") {
		if (empty_block_id % row_length !== 1) {
			empty_block_id = empty_block_id - 1
			left_block = document.getElementById(empty_block_id);
			moveBlock(left_block);
		}
	}
	if (keys_dictionary[key] === "switch right block") {
		if (empty_block_id % row_length !== 0) {
			empty_block_id = empty_block_id + 1;
			right_block = document.getElementById(empty_block_id);
			moveBlock(right_block);
		}
	}
}