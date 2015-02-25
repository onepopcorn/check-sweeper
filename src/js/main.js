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
		}

		return false;
	};

	// This is used to mark a checkbox as a minesweeper "flag" with the right mouse button
	var markCheckbox = function(e){
		e.preventDefault();
		e.currentTarget.checked = !e.currentTarget.checked;
		return false;
	};

	// Get a child at given row & col
	// var getCell = function(row,col){
	// 	var index = row * ROWS_NUM + col;
	// 	var el = board.children[index];
	// 	return el;
	// };

	// Get row and col for a given child index
	var getTileFromIndex = function(idx){
		var col = Math.floor(idx / COLS_NUM),
			row = idx - col * ROWS_NUM;
		return [row,col];
	}

	var getRandomTileIndex = function(){
		var rdn = Math.round(ROWS_NUM * COLS_NUM * Math.random() );
		return rdn;
	}

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
		};
		// Create game array
		for(i=0;i<ROWS_NUM;i++)
		{
			tiles.push([]);
			for(j=0;j<COLS_NUM;j++)
			{
				tiles[i][j] = 0;
			}
		}

		// Set random mines TODO: Do this with a while loop and substract bombs left from totalMines
		for(i=0;i<totalMines;i++)
		{
			var coords = getTileFromIndex(getRandomTileIndex()),
				tile   = tiles[coords[0],coords[1]];

			if(tile == 0)
			{
				tiles[coords[0],coords[1]] = 1;
			} else 
			{

			}
		}
		console.log(tiles);
	};
	init();
})();