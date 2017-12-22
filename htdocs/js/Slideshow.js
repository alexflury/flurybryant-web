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
  isSliding: false,
  photoPickerPrevLinkHtml: null,
  photoPickerNextLinkHtml: null,
  defaultArrowOpacity: 0.4,
  hoverArrowOpacity: 0.7,
  centeredThumb: null,
  fullScreenClickAreaHtml: null,
  photoContainerHtml: null,
  isFullScreen: false,
  isMaximizing: false,
  isMinimizing: false,

  getHtml: function() {
    this.html = FB.util.Dom.get('slideshow');
    this.photoHtml = FB.util.Dom.getElementsByClassName('photo', this.html)[0];
    this.photoSequenceHtml = FB.util.Dom.getElementsByClassName('photo-sequence', this.html)[0];
    this.prevLinkHtml = FB.util.Dom.getElementsByClassName('left-arrow', this.photoHtml)[0];
    this.nextLinkHtml = FB.util.Dom.getElementsByClassName('right-arrow', this.photoHtml)[0];
    this.photoPickerHtml = FB.util.Dom.getElementsByClassName('photo-picker', this.html)[0];
    this.thumbContainerHtml = FB.util.Dom.getElementsByClassName('thumb-container', this.html)[0];
    if (this.photoPickerHtml !== undefined) {
      this.photoPickerPrevLinkHtml = FB.util.Dom.getElementsByClassName('left-arrow', this.photoPickerHtml)[0];
      this.photoPickerNextLinkHtml = FB.util.Dom.getElementsByClassName('right-arrow', this.photoPickerHtml)[0];
    }
    this.fullScreenClickAreaHtml = FB.util.Dom.getElementsByClassName('full-screen-click-area', this.html)[0];
    this.photoContainerHtml = FB.util.Dom.getElementsByClassName('photo-container', this.html)[0];
  },

  initHtml: function() {
    this.lightenNextLink();
    this.lightenPrevLink();
    if (this.thumbContainerHtml !== undefined) {
      this.lightenPhotoPickerNextLink();
      this.lightenPhotoPickerPrevLink();
      this.clickThumb(0);
    }
  },

  addListeners: function() {
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
    FB.util.Event.addListener(this.html, 'click', function() { header.hideMenuPanel(); });
    if (this.photoPickerHtml !== undefined) {
      FB.util.Event.addListener(this.photoPickerHtml, 'mouseover', function() { slideshow.showPhotoPickerButtons() });
      FB.util.Event.addListener(this.photoPickerHtml, 'mouseout', function() { slideshow.hidePhotoPickerButtons() });
      FB.util.Event.addListener(this.photoPickerNextLinkHtml, 'mouseover', function() { slideshow.darkenPhotoPickerNextLink(); });
      FB.util.Event.addListener(this.photoPickerNextLinkHtml, 'mouseout', function() { slideshow.lightenPhotoPickerNextLink(); });
      FB.util.Event.addListener(this.photoPickerPrevLinkHtml, 'mouseover', function() { slideshow.darkenPhotoPickerPrevLink(); });
      FB.util.Event.addListener(this.photoPickerPrevLinkHtml, 'mouseout', function() { slideshow.lightenPhotoPickerPrevLink(); });
      FB.util.Event.addListener(this.photoPickerNextLinkHtml, 'click', function() { slideshow.clickPhotoPickerNext(); });
      FB.util.Event.addListener(this.photoPickerPrevLinkHtml, 'click', function() { slideshow.clickPhotoPickerPrev(); });
    }
    if (this.fullScreenClickAreaHtml !== undefined) {
      FB.util.Event.addListener(this.fullScreenClickAreaHtml, 'click', function() { slideshow.toggleFullScreen(); });
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
    this.clickThumb(this.photoSequence.getPhotoNum());
  },

  clickPrev: function() {
    this.clickThumb(this.photoSequence.getPhotoNum() - 2);
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
    if (this.isSliding) {
      return false;
    }
    photoNum = (photoNum % this.photos.length + this.photos.length) % this.photos.length;
    if (photoNum == this.selectedThumb) {
      return false;
    }
    this.isAuto = false;
    clearTimeout(this.currentTimeout);
    this.photoSequence.loadPhoto(photoNum, this.manualSpeed);
    photoNum = this.photoSequence.getPhotoNum() - 1;
    if (this.photoPickerHtml !== undefined) {
      if (this.selectedThumb !== null && this.thumbsHtml[this.selectedThumb] !== undefined) {
        FB.util.Dom.removeClassName(this.thumbsHtml[this.selectedThumb], 'selected');
      }
      if (this.thumbsHtml[photoNum] !== undefined) {
        FB.util.Dom.addClassName(this.thumbsHtml[photoNum], 'selected');
      }
    }
    this.selectedThumb = photoNum;
    if (this.photoPickerHtml !== undefined) {
      this.slidePhotoPickerTo(photoNum);
    }
  },

  slidePhotoPickerTo: function(photoNum) {
    if (this.isSliding) {
      return false;
    }
    photoNum = (photoNum % this.photos.length + this.photos.length) % this.photos.length;
    if (photoNum == this.centeredThumb) {
      return false;
    }
    if (this.centeredThumb === null || this.thumbsHtml[this.centeredThumb] === undefined || this.thumbsHtml[photoNum] === undefined) {
      this.centeredThumb = photoNum;
      this.renderPhotoPicker();
    } else {
      var startThumbLeft = this.thumbsHtml[this.centeredThumb].offsetLeft;
      if (this.centeredThumb == this.selectedThumb) {
        startThumbLeft += 5;
      }
      var endThumbLeft = this.thumbsHtml[photoNum].offsetLeft;
      if (photoNum == this.selectedThumb) {
        endThumbLeft += 5;
      }
      this.isSliding = true;
      this.slidePhotoPicker(this.thumbContainerHtml.offsetLeft, this.thumbContainerHtml.offsetLeft + startThumbLeft - endThumbLeft);
      this.centeredThumb = photoNum;
    }
  },

  slidePhotoPicker: function(start, end, progress) {
    if (progress === undefined) {
      progress = 0.025;
    }
    if (progress < 1 && this.isSliding) {
      var newLeft = start + (end - start) * (0.5 - 0.5 * Math.cos(progress * Math.PI));
      this.thumbContainerHtml.style.left = start + (end - start) * (0.5 - 0.5 * Math.cos(progress * Math.PI)) + 'px';
      var slideshow = this;
      setTimeout(function() { slideshow.slidePhotoPicker(start, end, progress + 0.025) }, 10);
    } else {
      this.thumbContainerHtml.style.left = end + 'px';
      this.renderPhotoPicker();
    }
  },

  renderPhotoPicker: function() {
    this.isSliding = false;
    var photoPickerRect = this.photoPickerHtml.getBoundingClientRect();
    var thumbWidth = Math.floor((photoPickerRect.height - 20) * 4/3);
    var numThumbs = Math.ceil((photoPickerRect.width * 3/2) / (thumbWidth + 10));
    this.thumbContainerHtml.innerHTML = '';
    this.thumbsHtml = [];
    for (var t = this.centeredThumb - numThumbs; t <= this.centeredThumb + numThumbs; t++) {
      this.createThumb(((t % this.photos.length) + this.photos.length) % this.photos.length);
    }
    if (this.thumbsHtml[this.selectedThumb] !== undefined) {
      FB.util.Dom.addClassName(this.thumbsHtml[this.selectedThumb], 'selected');
    }
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
    if (this.selectedThumb !== null && this.thumbsHtml[this.selectedThumb] !== undefined) {
      FB.util.Dom.removeClassName(this.thumbsHtml[this.selectedThumb], 'selected');
    }
    FB.util.Dom.addClassName(this.thumbsHtml[photoNum], 'selected');
  },

  mouseOutThumb: function(photoNum) {
    FB.util.Dom.removeClassName(this.thumbsHtml[photoNum], 'selected');
    if (this.selectedThumb !== null && this.thumbsHtml[this.selectedThumb] !== undefined) {
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
    if (this.autoResizeDelta !== null && !this.isFullScreen) {
      FB.util.Dom.resizeHeight(this.photoSequenceHtml, this.autoResizeDelta, this.autoResizeMin);
      var framesHtml = this.photoSequence.getFramesHtml();
      for (var e = 0; e < framesHtml.length; e++) {
        FB.util.Dom.resizeHeight(framesHtml[e], this.autoResizeDelta, this.autoResizeMin);
      }
      if (this.fullScreenClickAreaHtml !== undefined) {
        FB.util.Dom.resizeHeight(this.fullScreenClickAreaHtml, this.autoResizeDelta, this.autoResizeMin);
      }
    }
    this.renderArrows();
    if (this.photoPickerHtml !== undefined) {
      this.renderPhotoPicker();
    }
  },

  renderArrows: function() {
    var photoSequenceRect = this.photoSequenceHtml.getBoundingClientRect();
    var leftArrowRect = this.prevLinkHtml.getBoundingClientRect();
    var rightArrowRect = this.nextLinkHtml.getBoundingClientRect();
    this.prevLinkHtml.style.top = Math.floor((photoSequenceRect.height - leftArrowRect.height) / 2) + 'px';
    this.nextLinkHtml.style.top = Math.floor((photoSequenceRect.height - rightArrowRect.height) / 2) + 'px';
  },

  showButtons: function() {
    this.prevLinkHtml.style.display = 'block';
    this.nextLinkHtml.style.display = 'block';
    this.renderArrows();
  },

  hideButtons: function() {
    this.prevLinkHtml.style.display = 'none';
    this.nextLinkHtml.style.display = 'none';
  },

  darkenNextLink: function() {
    FB.util.Dom.setOpacity(this.nextLinkHtml, this.hoverArrowOpacity);
  },

  lightenNextLink: function() {
    FB.util.Dom.setOpacity(this.nextLinkHtml, this.defaultArrowOpacity);
  },

  darkenPrevLink: function() {
    FB.util.Dom.setOpacity(this.prevLinkHtml, this.hoverArrowOpacity);
  },

  lightenPrevLink: function() {
    FB.util.Dom.setOpacity(this.prevLinkHtml, this.defaultArrowOpacity);
  },

  showPhotoPickerButtons: function() {
    this.photoPickerPrevLinkHtml.style.display = 'block';
    this.photoPickerNextLinkHtml.style.display = 'block';
  },

  hidePhotoPickerButtons: function() {
    this.photoPickerPrevLinkHtml.style.display = 'none';
    this.photoPickerNextLinkHtml.style.display = 'none';
  },

  darkenPhotoPickerNextLink: function() {
    FB.util.Dom.setOpacity(this.photoPickerNextLinkHtml, this.hoverArrowOpacity);
  },

  lightenPhotoPickerNextLink: function() {
    FB.util.Dom.setOpacity(this.photoPickerNextLinkHtml, this.defaultArrowOpacity);
  },

  darkenPhotoPickerPrevLink: function() {
    FB.util.Dom.setOpacity(this.photoPickerPrevLinkHtml, this.hoverArrowOpacity);
  },

  lightenPhotoPickerPrevLink: function() {
    FB.util.Dom.setOpacity(this.photoPickerPrevLinkHtml, this.defaultArrowOpacity);
  },

  clickPhotoPickerNext: function() {
    var photoPickerRect = this.photoPickerHtml.getBoundingClientRect();
    var thumbWidth = Math.floor((photoPickerRect.height - 20) * 4/3);
    var numThumbs = Math.floor(photoPickerRect.width / (thumbWidth + 10));
    this.slidePhotoPickerTo(this.centeredThumb + numThumbs);
  },

  clickPhotoPickerPrev: function() {
    var photoPickerRect = this.photoPickerHtml.getBoundingClientRect();
    var thumbWidth = Math.floor((photoPickerRect.height - 20) * 4/3);
    var numThumbs = Math.floor(photoPickerRect.width / (thumbWidth + 10));
    this.slidePhotoPickerTo(this.centeredThumb - numThumbs);
  },

  toggleFullScreen: function() {
    if (this.isMaximizing) {
      return;
    }
    var photoRect = this.photoSequenceHtml.getBoundingClientRect();
    var photoPickerRect = this.photoPickerHtml.getBoundingClientRect();
    var pageHeight = FB.util.getPageSize()[3];
    if (this.isFullScreen) {
      this.isMinimizing = true;
      this.minimizePhoto(photoRect.top, photoRect.height, photoPickerRect.bottom, Math.max(this.autoResizeMin, pageHeight - this.autoResizeDelta));
    } else {
      this.isFullScreen = true;
      this.isMaximizing = true;
      FB.util.Dom.addClassName(this.html, 'full-screen');
      this.maximizePhoto(photoRect.top, photoRect.height, 0, pageHeight);
    }
  },

  maximizePhoto: function(startTop, startHeight, endTop, endHeight, progress) {
    if (progress === undefined) {
      progress = 0.025;
    }
    if (progress < 1 && this.isMaximizing) {
      var newTop = startTop + (endTop - startTop) * (0.5 - 0.5 * Math.cos(progress * Math.PI));
      var newHeight = startHeight + (endHeight - startHeight) * (0.5 - 0.5 * Math.cos(progress * Math.PI));
      this.setPhotoTop(newTop + 'px');
      this.setPhotoHeight(newHeight + 'px');
      this.renderArrows();
      var slideshow = this;
      setTimeout(function() { slideshow.maximizePhoto(startTop, startHeight, endTop, endHeight, progress + 0.025) }, 10);
    } else {
      this.isMaximizing = false;
      this.setPhotoTop('0');
      this.setPhotoHeight('100%');
      this.render();
    }
  },

  minimizePhoto: function(startTop, startHeight, endTop, endHeight, progress) {
    if (progress === undefined) {
      progress = 0.025;
    }
    if (progress < 1 && this.isMinimizing) {
      var newTop = startTop + (endTop - startTop) * (0.5 - 0.5 * Math.cos(progress * Math.PI));
      var newHeight = startHeight + (endHeight - startHeight) * (0.5 - 0.5 * Math.cos(progress * Math.PI));
      this.setPhotoTop(newTop + 'px');
      this.setPhotoHeight(newHeight + 'px');
      this.renderArrows();
      var slideshow = this;
      setTimeout(function() { slideshow.minimizePhoto(startTop, startHeight, endTop, endHeight, progress + 0.025) }, 10);
    } else {
      this.isMinimizing = false;
      this.isFullScreen = false;
      this.setPhotoTop(endTop);
      this.setPhotoHeight(endHeight);
      this.render();
    }
  },

  setPhotoHeight: function(height) {
    this.photoHtml.style.height = height;
    this.photoSequenceHtml.style.height = height;
    var framesHtml = this.photoSequence.getFramesHtml();
    for (var e = 0; e < framesHtml.length; e++) {
      framesHtml[e].style.height = height;
    }
    if (this.fullScreenClickAreaHtml !== undefined) {
      this.fullScreenClickAreaHtml.style.height = height;
    }
  },

  setPhotoTop: function(top) {
    this.photoHtml.style.top = top;
  }

};
