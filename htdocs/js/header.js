FB.Modules.Header = function() {
	this.getHtml();
	this.initHtml();
	this.addListeners();
};

FB.Modules.Header.prototype = {
	html: null,
	menuPanelHtml: null,
	linksContainerHtml: null,
	linksHtml: {},
	isMouseOverLinks: false,
	isMouseOverMenuPanel: false,

	getHtml: function() {
		this.html = FB.util.Dom.get('hd');
		this.menuPanelHtml = FB.util.Dom.getElementsByClassName('menu-panel', this.html)[0];
		this.linksContainerHtml = FB.util.Dom.getElementsByClassName('links-container', this.html)[0];
		this.linksHtml.home = FB.util.Dom.getElementsByClassName('home-link', this.html)[0];
		this.linksHtml.about = FB.util.Dom.getElementsByClassName('about-link', this.html)[0];
		this.linksHtml.portfolio = FB.util.Dom.getElementsByClassName('portfolio-link', this.html)[0];
		this.linksHtml.documents = FB.util.Dom.getElementsByClassName('documents-link', this.html)[0];
		this.linksHtml.contact = FB.util.Dom.getElementsByClassName('contact-link', this.html)[0];
	},

	initHtml: function() {
		FB.util.Dom.setOpacity(this.menuPanelHtml, 0.9);
	},

	addListeners: function() {
		var hd = this;
		FB.util.Event.addListener(this.linksContainerHtml, 'mouseover', function() { hd.linksMouseOver(); });
		FB.util.Event.addListener(this.linksContainerHtml, 'mouseout', function() { hd.linksMouseOut(); });
		FB.util.Event.addListener(this.menuPanelHtml, 'mouseover', function() { hd.menuPanelMouseOver(); });
		FB.util.Event.addListener(this.menuPanelHtml, 'mouseout', function() { hd.menuPanelMouseOut(); });
		FB.util.Event.addListener(this.linksHtml.about, 'mouseover', function() { hd.showMenuPanel(); });
		FB.util.Event.addListener(this.linksHtml.portfolio, 'mouseover', function() { hd.showMenuPanel(); });
		FB.util.Event.addListener(this.linksHtml.documents, 'mouseover', function() { hd.showMenuPanel(); });
		FB.util.Event.addListener(this.linksHtml.contact, 'mouseover', function() { hd.showMenuPanel(); });
	},

	showMenuPanel: function() {
		this.menuPanelHtml.style.display = 'block';
	},

	hideMenuPanel: function() {
		this.menuPanelHtml.style.display = 'none';
	},

	linksMouseOver: function() {
		this.isMouseOverLinks = true;
	},

	linksMouseOut: function() {
		this.isMouseOverLinks = false;
		this.mouseOut();
	},

	menuPanelMouseOver: function() {
		this.isMouseOverMenuPanel = true;
	},

	menuPanelMouseOut: function() {
		this.isMouseOverMenuPanel = false;
		this.mouseOut();
	},

	mouseOut: function() {
		var hd = this;
		setTimeout(function() { hd.checkMouseOut() }, 100);
	},

	checkMouseOut: function() {
		if (!this.isMouseOverLinks && !this.isMouseOverMenuPanel) {
			this.hideMenuPanel();
		}
	}
};