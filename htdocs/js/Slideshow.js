FB.Modules.Slideshow = function(photoSequence, isAuto, period, autoResizeDelta, autoResizeMin) {
  this.photoSequence = photoSequence;
  this.isAuto = isAuto;
  this.period = period;
  this.autoResizeDelta = autoResizeDelta;
  this.autoResizeMin = autoResizeMin
  this.getHtml();
  this.initHtml();
  this.addListeners();
  if (this.isAuto) {
    this.scheduleNext();
  }
};

FB.Modules.Slideshow.prototype = {
  html: null,
  photoSequenceHtml: null,
  prevLinkHtml: null,
  nextLinkHtml: null,
  thumbsHtml: [],
  photoSequence: null,
  isAuto: true,
  period: null,
  autoResizeDelta: null,
  currentTimeout: null,
  autoSpeed: 0.025,
  manualSpeed: 0.2,
  photoPickerHtml: null,
  selectedThumb: null,

  getHtml: function() {
    this.html = FB.util.Dom.get('slideshow');
    this.photoSequenceHtml = FB.util.Dom.getElementsByClassName('photo-sequence', this.html)[0];
    this.prevLinkHtml = FB.util.Dom.getElementsByClassName('left-arrow', this.html)[0];
    this.nextLinkHtml = FB.util.Dom.getElementsByClassName('right-arrow', this.html)[0];
    this.photoPickerHtml = FB.util.Dom.getElementsByClassName('photo-picker', this.html)[0];
    if (this.photoPickerHtml !== undefined) {
      this.thumbsHtml = FB.util.Dom.getElementsByClassName('thumb', this.photoPickerHtml);
    }
  },

  initHtml: function() {
    this.lightenNextLink();
    this.lightenPrevLink();
    if (this.photoPickerHtml !== undefined) {
      this.clickThumb(0);
    }
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
    if (this.photoPickerHtml !== undefined) {
      for (var t = 0; t < this.thumbsHtml.length; t++) {
        FB.util.Event.addListener(this.thumbsHtml[t], 'click', this.clickThumbHandler(this.thumbsHtml[t].dataset.photoNum));
        FB.util.Event.addListener(this.thumbsHtml[t], 'mouseover', this.mouseOverThumbHandler(this.thumbsHtml[t].dataset.photoNum));
        FB.util.Event.addListener(this.thumbsHtml[t], 'mouseout', this.mouseOutThumbHandler(this.thumbsHtml[t].dataset.photoNum));
      }
    }
  },

  prev: function(speed) {
    this.photoSequence.prev(speed);
  },

  next: function(speed) {
    this.photoSequence.next(speed);
    if (this.isAuto) {
      this.scheduleNext();
    }
  },

  clickNext: function() {
    this.isAuto = false;
    clearTimeout(this.currentTimeout);
    this.next(this.manualSpeed);
  },

  clickPrev: function() {
    this.isAuto = false;
    clearTimeout(this.currentTimeout);
    this.prev(this.manualSpeed);
  },

  clickThumbHandler: function(photoNum) {
    var slideshow = this;
    return function () { slideshow.clickThumb(photoNum); };
  },

  mouseOverThumbHandler: function(photoNum) {
    var slideshow = this;
    return function() { slideshow.mouseOverThumb(photoNum); };
  },

  mouseOutThumbHandler: function(photoNum) {
    var slideshow = this;
    return function() { slideshow.mouseOutThumb(photoNum); };
  },

  clickThumb: function(photoNum) {
    this.isAuto = false;
    clearTimeout(this.currentTimeout);
    this.photoSequence.loadPhoto(photoNum, this.manualSpeed);
    if (this.selectedThumb !== null) {
      FB.util.Dom.removeClassName(this.thumbsHtml[this.selectedThumb], 'selected');
    }
    FB.util.Dom.addClassName(this.thumbsHtml[photoNum], 'selected');
    this.selectedThumb = photoNum;
  },

  mouseOverThumb: function(photoNum) {
    if (this.selectedThumbs !== null) {
      FB.util.Dom.removeClassName(this.thumbsHtml[this.selectedThumb], 'selected');
    }
    FB.util.Dom.addClassName(this.thumbsHtml[photoNum], 'selected');
  },

  mouseOutThumb: function(photoNum) {
    FB.util.Dom.removeClassName(this.thumbsHtml[photoNum], 'selected');
    if (this.selectedThumb !== null) {
      FB.util.Dom.addClassName(this.thumbsHtml[this.selectedThumb], 'selected');
    }
  },

  scheduleNext: function() {
    var slideshow = this;
    var speed = this.autoSpeed;
    clearTimeout(this.currentTimeout);
    this.currentTimeout = setTimeout(function() { slideshow.next(speed); }, this.period);
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
    FB.util.Dom.setOpacity(this.nextLinkHtml, 0.7);
  },

  lightenNextLink: function() {
    FB.util.Dom.removeClassName(this.nextLinkHtml, 'hover');
    FB.util.Dom.setOpacity(this.nextLinkHtml, 0.4);
  },

  darkenPrevLink: function() {
    FB.util.Dom.addClassName(this.prevLinkHtml, 'hover');
    FB.util.Dom.setOpacity(this.prevLinkHtml, 0.7);
  },

  lightenPrevLink: function() {
    FB.util.Dom.removeClassName(this.prevLinkHtml, 'hover');
    FB.util.Dom.setOpacity(this.prevLinkHtml, 0.4);
  }

};
