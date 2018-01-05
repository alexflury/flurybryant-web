FB.Modules.PortfolioIndex = function() {
	this.getHtml();
	this.initHtml();
	this.addListeners();
};

FB.Modules.PortfolioIndex.prototype = {

	getHtml: function() {

	},

	initHtml: function() {

	},

	addListeners: function() {
		var portfolioIndex = this;
		FB.util.Event.addListener(window, 'resize', function() { portfolioIndex.render(); });
	},

	render: function() {

	}

};