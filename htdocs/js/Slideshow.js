FB.Modules.Slideshow = function(photoSequence, isAuto, period, autoResizeDelta, autoResizeMin) {
  this.photoSequence = photoSequence;
  this.isAuto = isAuto;
  this.period = period;
  this.autoResizeDelta = autoResizeDelta;
  this.autoResizeMin = autoResizeMin
  this.getHtml();
  this.addListeners();
  this.scheduleNext();
};

FB.Modules.Slideshow.prototype = {
  html: null,
  photoSequenceHtml: null,
  prevLinkHtml: null,
  nextLinkHtml: null,
  photoSequence: null,
  isAuto: true,
  period: null,
  autoResizeDelta: null,
  currentTimeout: null,

  getHtml: function() {
    this.html = FB.util.Dom.get('slideshow');
    this.photoSequenceHtml = FB.util.Dom.getElementsByClassName('photo-sequence', this.html)[0];
    this.prevLinkHtml = FB.util.Dom.getElementsByClassName('left-arrow', this.html)[0];
    this.nextLinkHtml = FB.util.Dom.getElementsByClassName('right-arrow', this.html)[0];
  },

  addListeners: function() {
    if (this.autoResizeDelta !== null) {
      FB.util.Dom.registerAutoResizeHeight(this.photoSequenceHtml, this.autoResizeDelta, this.autoResizeMin);
      var framesHtml = this.photoSequence.getFramesHtml();
      for (var e = 0; e < framesHtml.length; e++) {
        FB.util.Dom.registerAutoResizeHeight(framesHtml[e], this.autoResizeDelta, this.autoResizeMin);
      }
    }
    var slideshow = this;
    FB.util.Event.addListener(window, 'resize', function() { slideshow.render(); });
    FB.util.Event.addListener(window, 'load', function() { slideshow.render(); });
    FB.util.Event.addListener(this.html, 'mouseover', function() { slideshow.showButtons(); });
    FB.util.Event.addListener(this.html, 'mouseout', function() { slideshow.hideButtons(); });
    FB.util.Event.addListener(this.nextLinkHtml, 'mouseover', function() { slideshow.darkenNextLink(); });
    FB.util.Event.addListener(this.nextLinkHtml, 'mouseout', function() { slideshow.lightenNextLink(); });
    FB.util.Event.addListener(this.prevLinkHtml, 'mouseover', function() { slideshow.darkenPrevLink(); });
    FB.util.Event.addListener(this.prevLinkHtml, 'mouseout', function() { slideshow.lightenPrevLink(); });
    FB.util.Event.addListener(this.nextLinkHtml, 'click', function() { slideshow.clickNext(); });
    FB.util.Event.addListener(this.prevLinkHtml, 'click', function() { slideshow.clickPrev(); });
  },

  prev: function() {
    this.photoSequence.prev();
  },

  next: function() {
    this.photoSequence.next();
    if (this.isAuto) {
      this.scheduleNext();
    }
  },

  clickNext: function() {
    this.isAuto = false;
    clearTimeout(this.currentTimeout);
    this.next();
  },

  clickPrev: function() {
    this.isAuto = false;
    clearTimeout(this.currentTimeout);
    this.prev();
  },

  scheduleNext: function() {
    var slideshow = this;
    clearTimeout(this.currentTimeout);
    this.currentTimeout = setTimeout(function() { slideshow.next(); }, this.period);
  },

  render: function() {
    var photoSequenceRect = this.photoSequenceHtml.getBoundingClientRect();
    var leftArrowRect = this.prevLinkHtml.getBoundingClientRect();
    var rightArrowRect = this.nextLinkHtml.getBoundingClientRect();
    this.prevLinkHtml.style.top = Math.floor((photoSequenceRect.height - leftArrowRect.height) / 2) + 'px';
    this.nextLinkHtml.style.top = Math.floor((photoSequenceRect.height - rightArrowRect.height) / 2) + 'px';
  },

  showButtons: function() {
    this.prevLinkHtml.style.display = 'block';
    this.nextLinkHtml.style.display = 'block';
    this.render();
  },

  hideButtons: function() {
    this.prevLinkHtml.style.display = 'none';
    this.nextLinkHtml.style.display = 'none';
  },

  darkenNextLink: function() {
    FB.util.Dom.addClassName(this.nextLinkHtml, 'hover');
  },

  lightenNextLink: function() {
    FB.util.Dom.removeClassName(this.nextLinkHtml, 'hover');
  },

  darkenPrevLink: function() {
    FB.util.Dom.addClassName(this.prevLinkHtml, 'hover');
  },

  lightenPrevLink: function() {
    FB.util.Dom.removeClassName(this.prevLinkHtml, 'hover');
  }

};
