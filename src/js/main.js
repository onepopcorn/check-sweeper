(function(){
	// Caché the board element
	var board = document.querySelector('#gameboard');

	// This is used to 
	var revealCheckbox = function(e){
		e.preventDefault();
		e.currentTarget.className = 'hidden';
		return false;
	};

	var markCheckbox = function(e){
		e.preventDefault();
		e.currentTarget.checked = !e.currentTarget.checked;
		return false;
	};

	var all = document.querySelectorAll('#gameboard>.tile>input');
	for(var i=0, len = all.length;i<len;i++)
	{
		all[i].addEventListener('contextmenu',markCheckbox);
		all[i].addEventListener('click',revealCheckbox);	
	};
	var getCell = function(row,col){
		// 7 rows & 7 columns
		var index = row * 7 + col;
		var el = board.children[index];
		return el;
	};

	var tile = getCell(2,4);
	tile.innerHTML = "x";

})();