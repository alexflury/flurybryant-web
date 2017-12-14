FB.Modules.Slideshow = function(photoSequence, isAuto, period, autoResizeDelta, autoResizeMin, photos) {
  this.photoSequence = photoSequence;
  this.isAuto = isAuto;
  this.period = period;
  this.autoResizeDelta = autoResizeDelta;
  this.autoResizeMin = autoResizeMin
  this.photos = photos;
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
  photoHtml: null,
  photoSequence: null,
  isAuto: true,
  period: null,
  autoResizeDelta: null,
  currentTimeout: null,
  autoSpeed: 0.025,
  manualSpeed: 0.2,
  photoPickerHtml: null,
  thumbContainerHtml: null,
  selectedThumb: null,
  photos: [],

  getHtml: function() {
    this.html = FB.util.Dom.get('slideshow');
    this.photoHtml = FB.util.Dom.getElementsByClassName('photo', this.html)[0];
    this.photoSequenceHtml = FB.util.Dom.getElementsByClassName('photo-sequence', this.html)[0];
    this.prevLinkHtml = FB.util.Dom.getElementsByClassName('left-arrow', this.html)[0];
    this.nextLinkHtml = FB.util.Dom.getElementsByClassName('right-arrow', this.html)[0];
    this.photoPickerHtml = FB.util.Dom.getElementsByClassName('photo-picker', this.html)[0];
    this.thumbContainerHtml = FB.util.Dom.getElementsByClassName('thumb-container', this.html)[0];
  },

  initHtml: function() {
    this.lightenNextLink();
    this.lightenPrevLink();
    if (this.thumbContainerHtml !== undefined) {
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
    FB.util.Event.addListener(this.photoHtml, 'mouseover', function() { slideshow.showButtons(); });
    FB.util.Event.addListener(this.photoHtml, 'mouseout', function() { slideshow.hideButtons(); });
    FB.util.Event.addListener(this.nextLinkHtml, 'mouseover', function() { slideshow.darkenNextLink(); });
    FB.util.Event.addListener(this.nextLinkHtml, 'mouseout', function() { slideshow.lightenNextLink(); });
    FB.util.Event.addListener(this.prevLinkHtml, 'mouseover', function() { slideshow.darkenPrevLink(); });
    FB.util.Event.addListener(this.prevLinkHtml, 'mouseout', function() { slideshow.lightenPrevLink(); });
    FB.util.Event.addListener(this.nextLinkHtml, 'click', function() { slideshow.clickNext(); });
    FB.util.Event.addListener(this.prevLinkHtml, 'click', function() { slideshow.clickPrev(); });
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
    this.clickThumb(this.photoSequence.getPhotoNum() - 1);
  },

  clickPrev: function() {
    this.isAuto = false;
    clearTimeout(this.currentTimeout);
    this.prev(this.manualSpeed);
    this.clickThumb(this.photoSequence.getPhotoNum() - 1);
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
    this.selectedThumb = photoNum;
    this.renderPhotoPicker();
  },

  renderPhotoPicker: function() {
    var photoPickerRect = this.photoPickerHtml.getBoundingClientRect();
    var thumbWidth = Math.floor((photoPickerRect.height - 20) * 4/3);
    var numThumbs = Math.ceil((photoPickerRect.width * 3/2) / (thumbWidth + 10));
    this.thumbContainerHtml.innerHTML = '';
    for (var t = this.selectedThumb - numThumbs; t <= this.selectedThumb + numThumbs; t++) {
      this.createThumb(((t % this.photos.length) + this.photos.length) % this.photos.length);
    }
    FB.util.Dom.addClassName(this.thumbsHtml[this.selectedThumb], 'selected');
    var thumbContainerWidth = 10 * (numThumbs * 2 + 2) + thumbWidth * (numThumbs * 2 + 1);
    var thumbContainerLeft = Math.floor((photoPickerRect.width - thumbContainerWidth) / 2);
    this.thumbContainerHtml.style.width = thumbContainerWidth + 'px';
    this.thumbContainerHtml.style.left = thumbContainerLeft + 'px';
  },

  createThumb: function(photoNum) {
    var thumbHtml = document.createElement("div");
    FB.util.Dom.addClassName(thumbHtml, 'thumb');
    thumbHtml.style.backgroundImage = 'url(' + FB.util.getThumbUrl(this.photos[photoNum]) + ')';
    this.thumbContainerHtml.appendChild(thumbHtml);
    this.thumbsHtml[photoNum] = thumbHtml;
    FB.util.Event.addListener(thumbHtml, 'click', this.clickThumbHandler(photoNum));
    FB.util.Event.addListener(thumbHtml, 'mouseover', this.mouseOverThumbHandler(photoNum));
    FB.util.Event.addListener(thumbHtml, 'mouseout', this.mouseOutThumbHandler(photoNum));
  },

  mouseOverThumb: function(photoNum) {
    if (this.selectedThumb !== null) {
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
    if (this.photoPickerHtml !== undefined) {
      this.renderPhotoPicker();
    }
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
