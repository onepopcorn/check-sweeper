'strict mode';
// Define module namespace
var Onepopcorn = Onepopcorn || {};

/*
 * @Class Timer
 * 
 * A stopwatch class to count elapsed minutes and seconds.
 *
 * @namespace Onepopcorn
 * @param {String} Id of the HTML element that holds the counter.
 */
Onepopcorn.Timer = function (id){
	this.el = document.querySelector('#'+id);
	var self = this;
	var _timerId = null;
	var _counter = 0;
	var _isActive = false;

	// Private methods
	function update(){
		_counter++;
		self.el.innerHTML = toTime();
	}

	function toTime(){
		var minutes = parseInt(_counter / 60),
			seconds = parseInt(_counter) % 60;
		
		minutes = minutes.toString().length > 1 ? minutes : "0" + minutes;
		seconds = seconds.toString().length > 1 ? seconds : "0" + seconds;
		
		return minutes + ":" + seconds;
	}

	// Public methods
	Onepopcorn.Timer.prototype.start = function start(){
		if(!_isActive){
			_timerId = setInterval(update,1000);
			_isActive =  true;
		}
	};

	Onepopcorn.Timer.prototype.stop = function stop(){
		if(_isActive)
		{
			clearInterval(_timerId);
			_isActive = false;
		}
	};
};

/*
 * @Class Tile
 * 
 * A class to handle the tile elements and actions
 *
 * @param {Int} ID of the tile
 * @param {Function} Callback to be triggered on click
 */
Onepopcorn.Tile = function(id,callback){
	var self = this;
	this.id = id;
	this.type = 0; // Always initialized as TYPE.CLEAR or 0
	this.callback = callback;
	// Create and assign checkbox element
	this.check = document.createElement('input');
	this.check.setAttribute('type','checkbox');
	// Create and assign div element
	this.el = document.createElement('div');
	this.el.className = "tile";
	this.el.setAttribute('id',id);
	this.el.appendChild(this.check);
	
	function onClick(e){
		e.preventDefault();
		self.callback(self.id);
	}
	this.check.addEventListener('click',onClick);

	// This is used to mark a checkbox as a minesweeper "flag" with the right mouse button
	function onRightClick(e){
		e.preventDefault();
		self.check.checked = !self.check.checked;
	}
	this.check.addEventListener('contextmenu',onRightClick);

	// This must set the near bombs number or empty value.
	Onepopcorn.Tile.prototype.setValue = function(val){
		this.check.removeEventListener('click',onClick);
		this.el.innerHTML = val;
	};
}; 

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

	var timer = new Onepopcorn.Timer("timer");
	
	// Initialize game
	function init (){
		// Set board correct size
		board.style.width = COLS_NUM * 13 + "px";

		// Create game board & array
		var i,j,count = 0;
		for(i=0;i<ROWS_NUM;i++)
		{
			tiles.push([]);
			for(j=0;j<COLS_NUM;j++)
			{
				var tile = new Onepopcorn.Tile(i * ROWS_NUM + j,revealCheckbox);
				tile.type = TYPE.CLEAR;
				board.appendChild(tile.el);
				tiles[i][j] = tile;
				count++;
			}
		}

		// Set random mines
		var totalMines = MINES_NUM;
		while(totalMines > 0)
		{
			var idx    = getRandomTileIndex(),
				coords = getTileFromIndex(idx),
				tile   = tiles[coords[0]][coords[1]];
			
			if(tile.type === TYPE.CLEAR)
			{
				tile.type = TYPE.BOMB;
				totalMines--;
			}
		}

		// Clean unnecessary vars
		i,j,count,totalMines = null;

		// Start timer & keep running only if current tab is in focus
		timer.start();
		window.onfocus = function(){
			timer.start();
		};

		window.onblur = function(){
			timer.stop();
		};
	}

	// This is used to remove a checkbox and reveal what's behind
	function revealCheckbox (id){
		// Get the value "behind" the tile
		var coords = getTileFromIndex(id),
			tile   = tiles[coords[0]][coords[1]];

		// If value is a mine you lose if not continue playing
		if(tile.type === TYPE.BOMB)
		{
			tile.setValue('x');
			gameover();
		} else {
			// Mark as revealed
			tile.type = TYPE.CHECKED;
			// Check how many mines are near
			var minesNear = checkNearMines(coords[0],coords[1]);
			if(minesNear === 0) {
				tile.setValue('');
				// Check near mines again
				clearNearMines(coords[0],coords[1]);
			} else {
				tile.setValue(minesNear);
			}

			// Check if all mines has been removed
			disarmed++;
			if(disarmed ===  CLEAR_TILES)
			{
				gameover(true);
			}
		}
		return false;
	}

	function gameover (win){
		timer.stop();
		var message = win === true ? "CONGRATULATIONS YOU WIN" : "GAME OVER";
		var confirm = window.confirm(message+"\nplay again?");
		if (confirm)
		{
			// I know this is very lazy solution. A real cool cool one 
			//  should clean everything and set a new game.
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
			var tile = tiles[row + dir.row][col + dir.col];
			if(tile.type !== TYPE.CHECKED)
			{
				revealCheckbox(tile.id);
			}
		}
	}

	// Helper function to check if analized tile exists.
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

			if(tiles[row + dir.row][col + dir.col].type === TYPE.BOMB){
				mines++;
			}
		}
		
		return mines;
	}

	// Get row and col for a given child index
	function getTileFromIndex(idx){
		var row = Math.floor(idx / COLS_NUM),
			col = idx - row * ROWS_NUM;
		return [row,col];
	}

	function getRandomTileIndex(){
		var rdn = Math.round(ROWS_NUM * COLS_NUM * Math.random() );
		return rdn;
	}

	// Let's start
	init();
})();