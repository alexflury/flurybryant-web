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
	sublinkPanelsHtml: {},
	isMouseOverLinks: false,
	isMouseOverMenuPanel: false,
	isContactClicked: false,

	getHtml: function() {
		this.html = FB.util.Dom.get('hd');
		this.menuPanelHtml = FB.util.Dom.getElementsByClassName('menu-panel', this.html)[0];
		this.linksContainerHtml = FB.util.Dom.getElementsByClassName('links-container', this.html)[0];
		this.linksHtml.home = FB.util.Dom.getElementsByClassName('home-link', this.html)[0];
		this.linksHtml.about = FB.util.Dom.getElementsByClassName('about-link', this.html)[0];
		this.linksHtml.portfolio = FB.util.Dom.getElementsByClassName('portfolio-link', this.html)[0];
		this.linksHtml.documents = FB.util.Dom.getElementsByClassName('documents-link', this.html)[0];
		this.linksHtml.contact = FB.util.Dom.getElementsByClassName('contact-link', this.html)[0];
		this.sublinkPanelsHtml.about = FB.util.Dom.getElementsByClassName('about-menu-panel', this.menuPanelHtml)[0];
		this.sublinkPanelsHtml.portfolio = FB.util.Dom.getElementsByClassName('portfolio-menu-panel', this.menuPanelHtml)[0];
		this.sublinkPanelsHtml.documents = FB.util.Dom.getElementsByClassName('documents-menu-panel', this.menuPanelHtml)[0];
		this.sublinkPanelsHtml.contact = FB.util.Dom.getElementsByClassName('contact-menu-panel', this.menuPanelHtml)[0];
	},

	initHtml: function() {
		FB.util.Dom.setOpacity(this.menuPanelHtml, 0.9);
		for (var linkName in this.linksHtml) {
			var linkElement = this.linksHtml[linkName].getElementsByTagName('a')[0]
			if (linkName == 'contact') {
				linkElement.href = 'javascript:void(0);';
			} else {
				var destination = linkElement.href;
				FB.util.Event.addListener(this.linksHtml[linkName], 'click', function() {
					document.location.href = destination
				});
			}
		}
		for (var linkName in this.sublinkPanelsHtml) {
			var linkRect = this.linksHtml[linkName].getBoundingClientRect();
			this.sublinkPanelsHtml[linkName].style.left = linkRect.left + 'px';
		}
		this.sublinkPanelsHtml.contact.style.left = '0';
	},

	addListeners: function() {
		var hd = this;
		FB.util.Event.addListener(this.html, 'mouseover', function() { hd.headerMouseOver(); });
		FB.util.Event.addListener(this.html, 'mouseout', function() { hd.headerMouseOut(); });
		FB.util.Event.addListener(this.menuPanelHtml, 'mouseover', function() { hd.menuPanelMouseOver(); });
		FB.util.Event.addListener(this.menuPanelHtml, 'mouseout', function() { hd.menuPanelMouseOut(); });
		FB.util.Event.addListener(this.linksHtml.about, 'mouseover', function() { hd.showMenuPanel('about'); });
		FB.util.Event.addListener(this.linksHtml.portfolio, 'mouseover', function() { hd.showMenuPanel('portfolio'); });
		FB.util.Event.addListener(this.linksHtml.documents, 'mouseover', function() { hd.showMenuPanel('documents'); });
		FB.util.Event.addListener(this.linksHtml.contact, 'mouseover', function() { hd.showMenuPanel('contact'); });
		FB.util.Event.addListener(this.linksHtml.contact, 'click', function() { hd.contactClick(); });
		FB.util.Event.addListener(window, 'resize', function() { hd.renderContactMenu(); });
	},

	showMenuPanel: function(activeLinkName) {
		if (activeLinkName != 'contact') {
			this.isContactClicked = false;
		}
		for (linkName in this.sublinkPanelsHtml) {
			if (linkName == activeLinkName) {
				this.sublinkPanelsHtml[linkName].style.display = 'block';
			} else {
				this.sublinkPanelsHtml[linkName].style.display = 'none';
			}
		}
		this.menuPanelHtml.style.display = 'block';
		if (activeLinkName == 'contact') {
			this.renderContactMenu();
		}
	},

	hideMenuPanel: function() {
		this.menuPanelHtml.style.display = 'none';
	},

	headerMouseOver: function() {
		this.isMouseOverHeader = true;
	},

	headerMouseOut: function() {
		this.isMouseOverHeader = false;
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
		if (!this.isMouseOverHeader && !this.isMouseOverMenuPanel && !this.isContactClicked) {
			this.hideMenuPanel();
		}
	},

	contactClick: function() {
		this.isContactClicked = true;
	},

	renderContactMenu: function() {
		this.sublinkPanelsHtml.contact.style.display = 'block';
		panelWidth = this.sublinkPanelsHtml.contact.getBoundingClientRect().width;
		var contactListItems = this.sublinkPanelsHtml.contact.getElementsByTagName("li");
		var contactListItemsTotalWidth = 0;
		for (var i = 0; i < contactListItems.length; i++) {
			contactListItems[i].style.display = 'block';
			contactListItemsTotalWidth += contactListItems[i].getBoundingClientRect().width;
			var rect = contactListItems[i].getBoundingClientRect();
		}
		var padding = Math.max(10, Math.floor((panelWidth - contactListItemsTotalWidth) / (1 + contactListItems.length)));
		for (var i = 0; i < contactListItems.length; i++) {
			contactListItems[i].style.marginLeft = padding + 'px';
		}
	}
};