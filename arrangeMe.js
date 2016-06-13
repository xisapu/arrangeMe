var actions_history = [];
var image_src = "http://fc00.deviantart.net/fs70/f/2013/359/b/7/anime_quote__138_by_anime_quotes-d6zbr3w.jpg";


function setup(number_of_blocks_in_side) {
	buildGameBoardWithImage(number_of_blocks_in_side);
	//buildGameBoardWithNumbers(number_of_blocks_in_side);
	//scrumbleBoard();
}


function buildGameBoardWithNumbers(number_of_blocks_in_side) {
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


function buildGameBoardWithImage(number_of_blocks_in_side) {
	var image = document.getElementById("hiddenImage");
	var image_X_width = image.width;
	var image_Y_height = image.height;
	var block_X_size = image_X_width / number_of_blocks_in_side;
	var block_Y_size = image_Y_height / number_of_blocks_in_side;
	var FromX = 0;
	var FromY = 0;
	var ToX = block_X_size;
	var ToY = block_Y_size;
	var table = document.getElementById("gameBoard");
	var counter = number_of_blocks_in_side * number_of_blocks_in_side;
	table.style.width = image.width + "px";
	table.style.height = image.height + "px";
	for (var i = 0; i < number_of_blocks_in_side; i++) {
		var row = table.insertRow(0);
		var FromX = 0;
		var ToX = block_X_size;
		for (var j = 0; j < number_of_blocks_in_side; j++) {
			var cell = row.insertCell(0);
			cell.className = "game_block";
			cell.id = counter;
			cell.appendChild(document.createElement("img"))
			var cellImage = cell.getElementsByTagName("img")[0];
			cellImage.id = "i" + counter;
			cellImage.className = "cropedImage";
			cellImage.src = image_src;
			var rect_string = "rect(" + FromY + "px, " + ToX + "px, " + ToY + "px, " + FromX + "px)";
			cellImage.style.clip = "rect(" + FromY + "px, " + ToX + "px, " + ToY + "px, " + FromX + "px)";
			cell.onclick = function() {moveBlock(this)};
			FromX += block_X_size;
			ToX += block_X_size;
			counter--;
		}
		FromY += block_Y_size;
		ToY += block_Y_size;
	}
	table.rows[number_of_blocks_in_side - 1].cells[number_of_blocks_in_side - 1].textContent = "";
}


function checkIfBlockEmpty(id) {
	var block = document.getElementById(id);
	if ((block.textContent == "") && (block.children == [])) {
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
}


function moveBlock(cellObject) {
	var empty_coupled_block_id = getEmptyCoupledBlocksId(cellObject.id);
	if (empty_coupled_block_id) {
		var illegalMove = document.getElementById("illegalMove");
		illegalMove.style.display = "none";
		actions_history.push(empty_coupled_block_id);
		var empty_coupled_block = document.getElementById(empty_coupled_block_id);
		switchBlocksContent(cellObject, empty_coupled_block)
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
		if (block.textContent === "") {
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