FB.Modules.Header = function() {
	this.getHtml();
};

FB.Modules.Header.prototype = {
	html: null,
	menuPanel: null,

	getHtml: function() {
		this.html = FB.util.Dom.get('hd');
		this.menuPanel = FB.util.Dom.getElementsByClassName('hd-menu-panel', this.html);
	}
};