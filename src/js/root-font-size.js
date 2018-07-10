(function(win,doc){
	function rootFontsize(){
		var docWidth = doc.documentElement.clientWidth,
			fontSize = docWidth * 10 / 320;
		
		doc.getElementsByTagName('html')[0].style.fontSize = ((fontSize > 10 ? fontSize : 10) > 20 ? 20 : fontSize) + 'px';
	}

	rootFontsize();
	win.addEventListener('resize',rootFontsize,false);
})(window,document);