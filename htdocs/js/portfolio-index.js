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
		for (var s = 0; s < this.slideshowLinksHtml.length; s++) {
			var linkShadeHtml = FB.util.Dom.getElementsByClassName('slideshow-link-shade', this.slideshowLinksHtml[s])[0];
			var linkTextHtml = FB.util.Dom.getElementsByClassName('slideshow-link-text', this.slideshowLinksHtml[s])[0];
			FB.util.Dom.setOpacity(linkShadeHtml, 0.5);
			FB.util.Dom.setOpacity(linkTextHtml, 0.8);
		}
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
		var linkWidth = Math.max(Math.floor((windowWidth - 60) / 2), 420);
		var top = FB.util.Dom.get('banner').getBoundingClientRect().bottom;
		var bottom = FB.util.Dom.get('ft').getBoundingClientRect().top;
		var height = bottom - top;
		var linkHeight = Math.max(Math.floor((height - 60) / 2), 150);
		for (var s = 0; s < this.slideshowLinksHtml.length; s++) {
			this.html.style.height = height + 'px';
			this.slideshowLinksHtml[s].style.width = linkWidth + 'px';
			this.slideshowLinksHtml[s].style.height = linkHeight + 'px';
			var linkShadeHtml = FB.util.Dom.getElementsByClassName('slideshow-link-shade', this.slideshowLinksHtml[s])[0];
			linkShadeHtml.style.height = linkHeight + 'px';
			linkShadeHtml.style.width = linkWidth + 'px';
			var linkTextHtml = FB.util.Dom.getElementsByClassName('slideshow-link-text', this.slideshowLinksHtml[s])[0];
			var linkTextHeight = linkTextHtml.getBoundingClientRect().height;
			linkTextHtml.style.marginTop = Math.floor((linkHeight - linkTextHeight) / 2) + 'px';
		}
	}

};