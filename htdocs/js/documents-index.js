FB.Modules.DocumentsIndex = function() {
	this.getHtml();
	this.initHtml();
	this.addListeners();
};

FB.Modules.DocumentsIndex.prototype = {
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
			FB.util.Dom.setOpacity(linkShadeHtml, 0.7);
			FB.util.Dom.setOpacity(linkTextHtml, 0.8);
		}
	},

	addListeners: function() {
		var documentsIndex = this;
		FB.util.Event.addListener(window, 'load', function() { documentsIndex.render(); });
		FB.util.Event.addListener(window, 'resize', function() { documentsIndex.render(); });
	},

	render: function() {
		var pageSize = FB.util.getPageSize();
		var windowWidth = pageSize[2];
		var windowHeight = pageSize[3];
		var linkWidth = Math.max(Math.floor((windowWidth - 60) / 2), 420);
		var top = FB.util.Dom.getBoundingRect(FB.util.Dom.get('banner')).bottom;
		var footRect = FB.util.Dom.getBoundingRect(FB.util.Dom.get('ft'));
		var bottom = footRect.top;
		var height = Math.max(300, bottom - top);
		var linkHeight = height - 40;
		for (var s = 0; s < this.slideshowLinksHtml.length; s++) {
			this.html.style.height = (height + footRect.height) + 'px';
			this.slideshowLinksHtml[s].style.width = linkWidth + 'px';
			this.slideshowLinksHtml[s].style.height = linkHeight + 'px';
			var linkShadeHtml = FB.util.Dom.getElementsByClassName('slideshow-link-shade', this.slideshowLinksHtml[s])[0];
			linkShadeHtml.style.height = linkHeight + 'px';
			linkShadeHtml.style.width = linkWidth + 'px';
			var linkTextHtml = FB.util.Dom.getElementsByClassName('slideshow-link-text', this.slideshowLinksHtml[s])[0];
			var linkTextHeight = FB.util.Dom.getBoundingRect(linkTextHtml).height;
			linkTextHtml.style.marginTop = Math.floor((linkHeight - linkTextHeight) / 2) + 'px';
		}
	}

};