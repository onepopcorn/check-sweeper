(function(){
	// Cache the board element
	var board       = document.querySelector('#gameboard'),
		tiles       = [],
		disarmed    = 0,
		MINES_NUM   = 10,
		ROWS_NUM    = 7,
		COLS_NUM    = 7,
		CLEAR_TILES = ROWS_NUM * COLS_NUM - MINES_NUM,
		TYPE        = {"CLEAR":0,"BOMB":1,"CHECKED" : -1},
		DIRECTIONS  = [
			{"row":-1,"col":-1}, // Upper left tile
			{"row":-1,"col":0}, // Upper tile
			{"row":-1,"col":1}, // Upper right tile
			{"row":0,"col":1}, // Right tile
			{"row":+1,"col":+1}, // Right down tile
			{"row":+1,"col":0}, // Down tile
			{"row":+1,"col":-1}, // Down left tile
			{"row":0,"col":-1}, // Left tile
		];

	// Initialize game
	function init (){
		var i,j,len  = ROWS_NUM * COLS_NUM;

		// Create game board
		for(i=0;i<len;i++)
		{	
			// Create needed elements
			var div = document.createElement('div'),
				checkbox = document.createElement('input');
			// Set their attributes
			div.className = 'tile';
			div.setAttribute('id',i); // It's better that way than check for index position for each element
			checkbox.setAttribute('type','checkbox');
			// Append it 
			div.appendChild(checkbox);
			board.appendChild(div);
			// Bind mouse events
			checkbox.addEventListener('contextmenu',rightClickHandler);
			checkbox.addEventListener('click',leftClickHandler);
		}

		// Create game array
		for(i=0;i<ROWS_NUM;i++)
		{
			tiles.push([]);
			for(j=0;j<COLS_NUM;j++)
			{
				tiles[i][j] = TYPE.CLEAR;
			}
		}

		// Set random mines
		var totalMines = MINES_NUM;
		while(totalMines > 0)
		{
			var idx    =  getRandomTileIndex(),
				coords = getTileFromIndex(idx),
				tile   = tiles[coords[0]][coords[1]];
			if(tile === 0)
			{
				tiles[coords[0]][coords[1]] = TYPE.BOMB;
				/* DEBUG -- SHOW WHERE MINES ARE */ 
				var el = document.querySelector('#' + toUnicode(idx));
				el.children[0].checked = true;
				/* END DEBUG */
				totalMines--;
			}
		}
	}

	// This is used to remove a checkbox and reveal whats it's behind
	function revealCheckbox (id){
		// Get the value "behind" the tile
		var coords = getTileFromIndex(id),
			val    = tiles[coords[0]][coords[1]];

		// If value is a mine you lose if not continue playing
		if(val === TYPE.BOMB)
		{
			setValueById(id,'x');
			gameover();
		} else {
			// Mark as revealed
			tiles[coords[0]][coords[1]] = TYPE.CHECKED;
			// Check if all mines has been removed
			disarmed++;
			if(disarmed ===  CLEAR_TILES)
			{
				gameover(true);
			}

			// Check how many mines are near
			var minesNear = checkNearMines(coords[0],coords[1]);
			if(minesNear === 0) {
				setValueById(id,'');
				// removeNearMines here? Check near mines again?
				clearNearMines(coords[0],coords[1]);
			} else {
				setValueById(id,minesNear);
			}
		}
		return false;
	}

	function setValueById (id,val){

		var el = document.querySelector("#" + toUnicode(id));
		el.innerHTML = val;
	}

	/* This is a helper function that gets the Unicode representation of any number. 
	 * This is needed to use querySelect when ID's are numbers
	 */
	function toUnicode(number){
		var str = "";
		for(var i in String(number))
		{
			str += "\\" + String(number).charCodeAt(i).toString(16);
		}

		return str;
	}

	function gameover (win){
		unbindEvents();
		var message = win === true ? "CONGRATULATIONS YOU WIN" : "GAME OVER";
		var confirm = window.confirm(message+"\nplay again?");
		if (confirm)
		{
			window.location = "/";
		}
		
	}

	function clearNearMines (row,col){
		for(var i in DIRECTIONS)
		{
			var dir = DIRECTIONS[i];
			if(!isInBounds(row + dir.row, col + dir.col))
			{
				continue;
			}

			if(tiles[row + dir.row][col + dir.col] !== TYPE.CHECKED)
			{
				var el = getTileFromCoords(col + dir.col,row + dir.row);
				console.log(el.getAttribute('id'));
				revealCheckbox(parseInt(el.getAttribute('id')));
			}
		}
	}

	function leftClickHandler (e){
		// Left click makes the input disappear
		e.preventDefault();
		e.currentTarget.className = 'hidden';
		revealCheckbox(e.currentTarget.parentNode.getAttribute('id'));
	}

	// This is used to mark a checkbox as a minesweeper "flag" with the right mouse button
	function rightClickHandler (e){
		e.preventDefault();
		e.currentTarget.checked = !e.currentTarget.checked;
		return false;
	}

	// Remove all custom mouse events
	function unbindEvents (){
		var inputs = document.querySelectorAll('input');
		for(var i in inputs)
		{
			if(typeof inputs[i] === 'object')
			{
				inputs[i].removeEventListener('contextmenu',rightClickHandler);
				inputs[i].removeEventListener('click',leftClickHandler);
			}
		}
	}

	// Helper function to check if analized tile exists or it's already checked
	function isInBounds (row,col){
		return row >= 0 && row < ROWS_NUM && col >= 0 && col < COLS_NUM;
	}
	// TODO: Look at flood fill algorithm
	function checkNearMines (row,col){
		var mines = 0;
		for(var i in DIRECTIONS)
		{
			var dir = DIRECTIONS[i];
			if(!isInBounds(row + dir.row, col + dir.col))
			{
				continue;	
			} 

			if(tiles[row + dir.row][col + dir.col] === TYPE.BOMB){
				mines++;
			}
		}
		
		return mines;
	}

	// Get a child at given row & col
	function getTileFromCoords (row,col){
		var index = row * ROWS_NUM + col;
		var el = board.children[index];
		return el;
	}

	// Get row and col for a given child index
	function getTileFromIndex(idx){
		var col = Math.floor(idx / COLS_NUM),
			row = idx - col * ROWS_NUM;
		return [row,col];
	}

	function getRandomTileIndex(){
		var rdn = Math.round(ROWS_NUM * COLS_NUM * Math.random() );
		return rdn;
	}

	// Let's start
	init();
})();