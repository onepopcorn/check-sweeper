(function(){

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
	
	for(var i=0;var len = all.length;i<len;i++)
	{
		all[i].addEventListener('contextmenu',markCheckbox);
		all[i].addEventListener('click',revealCheckbox);	
	}
})();