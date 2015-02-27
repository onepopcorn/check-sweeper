(function(){
	// Cache the board element
	var board      = document.querySelector('#gameboard'),
		tiles      = [],
		totalMines = 10,
		ROWS_NUM   = 7,
		COLS_NUM   = 7,
		DIRECTIONS = [
			{"row":-1,"col":-1}, // Upper left tile
			{"row":-1,"col":0}, // Upper tile
			{"row":-1,"col":1}, // Upper right tile
			{"row":0,"col":+1}, // Right tile
			{"row":+1,"col":+1}, // Right down tile
			{"row":+1,"col":0}, // Down tile
			{"row":+1,"col":-1}, // Down left tile
			{"row":0,"col":-1}, // Left tile
		];

	// This is used to remove a checkbox and reveal whats it's behind
	var revealCheckbox = function(el){
		// Get the value "behind" the tile
		var coords = getTileFromIndex(el.getAttribute('id')),
			val    = tiles[coords[0]][coords[1]];
		// If value is a mine you lose if not continue playing
		if(val)
		{
			el.innerHTML = 'x';
			alert("Boooooom you died!");
			unbindEvents();
		} else {
			el.innerHTML = checkNearMines(coords[0],coords[1]);
		}

		return false;
	};

	var leftClickHandler = function(e){
		// Left click makes the input disappear
		e.preventDefault();
		e.currentTarget.className = 'hidden';
		revealCheckbox(e.currentTarget.parentNode);
	}

	// This is used to mark a checkbox as a minesweeper "flag" with the right mouse button
	var rightClickHandler = function(e){
		e.preventDefault();
		e.currentTarget.checked = !e.currentTarget.checked;
		return false;
	};

	// Remove all custom mouse events
	var unbindEvents = function(){
		var inputs = document.querySelectorAll('input');
		for(var i in inputs)
		{
			if(typeof inputs[i] === 'object')
			{
				inputs[i].removeEventListener('contextmenu',rightClickHandler);
				inputs[i].removeEventListener('click',leftClickHandler);
			}
		}
	};

	// Helper function to check know if analized tile exists or not
	var isInBounds = function(row,col){
		return row >= 0 && row < ROWS_NUM && col >= 0 && col < COLS_NUM;
	};
	// TODO: Look at flood fill algorithm
	var checkNearMines = function(row,col){
		var mines = 0;
		
		for(var i in DIRECTIONS)
		{
			var dir = DIRECTIONS[i];
			if(!isInBounds(row + dir.row, col + dir.col))
			{
				continue;
			}
			if(tiles[row + dir.row][col + dir.col])
			{
				mines++;
			}
		}
		
		return mines;
	};

	// Get a child at given row & col
	var getTileFromCoords = function(row,col){
		var index = row * ROWS_NUM + col;
		var el = board.children[index];
		return el;
	};

	// Get row and col for a given child index
	var getTileFromIndex = function(idx){
		var col = Math.floor(idx / COLS_NUM),
			row = idx - col * ROWS_NUM;
		return [row,col];
	};

	var getRandomTileIndex = function(){
		var rdn = Math.round(ROWS_NUM * COLS_NUM * Math.random() );
		return rdn;
	};

	// Initialize game
	var init = function(){
		var i,j,len  = ROWS_NUM * COLS_NUM;

		// Create game board
		for(i=0;i<len;i++)
		{	
			// Create needed elements
			var div = document.createElement('div'),
				checkbox = document.createElement('input');
			// Set their attributes
			div.className = 'tile';
			div.setAttribute('id',i); // It's better that way than check por index position for each element
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
				tiles[i][j] = 0;
			}
		}

		// Set random mines
		while(totalMines > 0)
		{
			var coords = getTileFromIndex(getRandomTileIndex()),
				tile   = tiles[coords[0]][coords[1]];
			if(tile === 0)
			{
				tiles[coords[0]][coords[1]] = 1;
				totalMines--;
			}
		}
	};

	// Let's start
	init();
})();