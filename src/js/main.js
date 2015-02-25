(function(){
	// Cache the board element
	var board = document.querySelector('#gameboard'),
		tiles = [],
		totalMines = 10,
		ROWS_NUM = 7,
		COLS_NUM = 7;

	// This is used to remove a checkbox and reveal whats it's behind
	var revealCheckbox = function(e){
		e.preventDefault();
		e.currentTarget.className = 'hidden';
		// getTile(e.currentTarget.index);
		console.log(board.childNodes);
		return false;
	};

	// This is used to mark a checkbox as a minesweeper "flag"
	var markCheckbox = function(e){
		e.preventDefault();
		e.currentTarget.checked = !e.currentTarget.checked;
		return false;
	};

	// Get a child at given row & col
	var getCell = function(row,col){
		var index = row * ROWS_NUM + col;
		var el = board.children[index];
		return el;
	};

	// Get row and col for a given child index
	var getTile = function(idx){
		var col = Math.floor(idx / COLS_NUM);
		console.log(col);
	}

	var getRandomMine = function(){
		var rdn = Math.round(Math.random());
		return rdn;
	}

	// Initialize game
	var start = function(){
		var i,
			j,
			len  = ROWS_NUM * COLS_NUM;
			
		// Create game board
		for(i=0;i<len;i++)
		{	
			// Create needed elements
			var div = document.createElement('div'),
				checkbox = document.createElement('input');
			
			// Set their attributes
			div.className = 'tile';
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
				tiles[i][j] = getRandomMine();
			}
		}

		console.log(tiles);
	};

	start();

})();