FB.Modules.PortfolioIndex = function() {
	this.getHtml();
	this.initHtml();
	this.addListeners();
};

FB.Modules.PortfolioIndex.prototype = {
	html: null,
	slideshowLinksHtml: [],

	getHtml: function() {
		this.html = FB.util.Dom.getElementsByClassName('slideshow-links-container')[0];
		this.slideshowLinksHtml = FB.util.Dom.getElementsByClassName('slideshow-link', this.html);
	},

	initHtml: function() {

	},

	addListeners: function() {
		var portfolioIndex = this;
		FB.util.Event.addListener(window, 'load', function() { portfolioIndex.render(); });
		FB.util.Event.addListener(window, 'resize', function() { portfolioIndex.render(); });
	},

	render: function() {
		var pageSize = FB.util.getPageSize();
		var windowWidth = pageSize[2];
		var windowHeight = pageSize[3];
		var linkWidth = Math.floor((windowWidth - 60) / 2);
		var top = FB.util.Dom.get('banner').getBoundingClientRect().bottom;
		var bottom = FB.util.Dom.get('ft').getBoundingClientRect().top;
		var height = bottom - top;
		var linkHeight = Math.floor((height - 60) / 2);
		for (var s = 0; s < this.slideshowLinksHtml.length; s++) {
			this.html.style.height = height + 'px';
			this.slideshowLinksHtml[s].style.width = linkWidth + 'px';
			this.slideshowLinksHtml[s].style.height = linkHeight + 'px';
		}
	}

};