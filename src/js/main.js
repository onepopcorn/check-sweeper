(function(){
	// Caché the board element
	var board = document.querySelector('#gameboard');

	// 
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
		var el = board.children[row * col];
		return el;
	};
	var tile = getCell(0,5);
	console.log(tile);

})();