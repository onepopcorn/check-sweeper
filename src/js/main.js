(function(){
	// Cache the board element
	var board      = document.querySelector('#gameboard'),
		tiles      = [],
		totalMines = 10,
		ROWS_NUM   = 7,
		COLS_NUM   = 7;

	// This is used to remove a checkbox and reveal whats it's behind
	var revealCheckbox = function(e){
		// Left click makes the inpu disappear
		e.preventDefault();
		e.currentTarget.className = 'hidden';
		// Get the value "behind" the tile
		var el     = e.currentTarget.parentNode,
			coords = getTileFromIndex(el.getAttribute('id')),
			val    = tiles[coords[0]][coords[1]];
		
		if(val)
		{
			el.innerHTML = 'x';
			alert("Boooooom you died!");
			unbindEvents();
		} else {
			el.innerHTML = checkNearMines(coords[0],coords[1]);
			console.log(checkNearMines(coords[0],coords[1]));
		}

		return false;
	};

	// This is used to mark a checkbox as a minesweeper "flag" with the right mouse button
	var markCheckbox = function(e){
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
				inputs[i].removeEventListener('contextmenu',markCheckbox);
				inputs[i].removeEventListener('click',revealCheckbox);
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
		// Check upper left tile
		if(isInBounds(row-1,col-1))
		{
			if(tiles[row-1][col-1] === 1)
			{
				mines++;
			}
		}
		// Check upper tile
		if(isInBounds(row-1,col))
		{
			if(tiles[row-1][col] === 1)
			{
				mines++;
			} 
		}
		// Check upper right tile
		if(isInBounds(row-1,col+1))
		{
			if(tiles[row-1][col+1] === 1)
			{
				mines++;
			} 
		}
		// Check right tile
		if(isInBounds(row,col+1))
		{
			if(tiles[row][col+1] === 1)
			{
				mines++;
			} 
		}
		// Check right down tile
		if(isInBounds(row+1,col+1))
		{
			if(tiles[row+1][col+1] === 1)
			{
				mines++;
			} 
		}
		// Check down tile
		if(isInBounds(row+1,col))
		{
			if(tiles[row+1][col] === 1)
			{
				mines++;
			} 
		}
		// Check down left tile
		if(isInBounds(row+1,col-1))
		{
			if(tiles[row+1][col-1] === 1)
			{
				mines++;
			}
		} 
		// Check left tile
		if(isInBounds(row,col-1))
		{
			if(tiles[row][col-1] === 1)
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
			checkbox.addEventListener('contextmenu',markCheckbox);
			checkbox.addEventListener('click',revealCheckbox);
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