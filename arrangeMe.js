function buildGameBoard(number_of_blocks_in_side) {
	var table = document.getElementById("gameBoard");
	var counter = number_of_blocks_in_side * number_of_blocks_in_side;
	for (var i = 0; i < number_of_blocks_in_side; i++) {
		var row = table.insertRow(0);
		for (var j = 0; j < number_of_blocks_in_side; j++) {
			var cell = row.insertCell(0);
			cell.className="game_block"
			cell.textContent = counter;
			counter--;
		}
	}
	table.rows[number_of_blocks_in_side - 1].cells[number_of_blocks_in_side - 1].textContent = "";
}