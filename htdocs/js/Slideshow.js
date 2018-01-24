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
  closeLinkHtml: null,
  plusLinkHtml: null,
  minusLinkHtml: null,
  thumbsHtml: [],
  thumbPhotoNums: [],
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
  isResizing: false,
  isDragging: false,
  dragStartPos: null,
  bodyHtml: null,

  getHtml: function() {
    this.html = FB.util.Dom.get('slideshow');
    this.bodyHtml = document.getElementsByTagName('body')[0];
    this.photoHtml = FB.util.Dom.getElementsByClassName('photo', this.html)[0];
    this.photoSequenceHtml = FB.util.Dom.getElementsByClassName('photo-sequence', this.html)[0];
    this.prevLinkHtml = FB.util.Dom.getElementsByClassName('left-arrow', this.photoHtml)[0];
    this.nextLinkHtml = FB.util.Dom.getElementsByClassName('right-arrow', this.photoHtml)[0];
    this.closeLinkHtml = FB.util.Dom.getElementsByClassName('close-icon', this.photoHtml)[0];
    this.plusLinkHtml = FB.util.Dom.getElementsByClassName('plus-icon', this.photoHtml)[0];
    this.minusLinkHtml = FB.util.Dom.getElementsByClassName('minus-icon', this.photoHtml)[0];
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
    if (this.closeLinkHtml !== undefined) {
      this.lightenCloseLink();
    }
    if (this.plusLinkHtml !== undefined && this.minusLinkHtml !== undefined) {
      this.lightenPlusLink();
      this.lightenMinusLink();
    }
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
    if (this.closeLinkHtml !== undefined) {
      FB.util.Event.addListener(this.closeLinkHtml, 'mouseover', function() { slideshow.darkenCloseLink(); });
      FB.util.Event.addListener(this.closeLinkHtml, 'mouseout', function() { slideshow.lightenCloseLink(); });
      FB.util.Event.addListener(this.closeLinkHtml, 'click', function() { slideshow.exitFullScreen(); });
    }
    if (this.plusLinkHtml !== undefined && this.minusLinkHtml !== undefined) {
      FB.util.Event.addListener(this.plusLinkHtml, 'mouseover', function() { slideshow.darkenPlusLink(); });
      FB.util.Event.addListener(this.plusLinkHtml, 'mouseout', function() { slideshow.lightenPlusLink(); });
      FB.util.Event.addListener(this.plusLinkHtml, 'click', function() { slideshow.zoomIn(); });
      FB.util.Event.addListener(this.minusLinkHtml, 'mouseover', function() { slideshow.darkenMinusLink(); });
      FB.util.Event.addListener(this.minusLinkHtml, 'mouseout', function() { slideshow.lightenMinusLink(); });
      FB.util.Event.addListener(this.minusLinkHtml, 'click', function() { slideshow.zoomOut(); });
      FB.util.Event.addListener(this.fullScreenClickAreaHtml, 'mousedown', function(e) { slideshow.photoMouseDown(e); });
      FB.util.Event.addListener(this.fullScreenClickAreaHtml, 'mouseup', function() { slideshow.photoMouseUp(); });
      FB.util.Event.addListener(this.fullScreenClickAreaHtml, 'mousemove', function(e) { slideshow.photoMouseMove(e); });
    }
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
      FB.util.Event.addListener(this.fullScreenClickAreaHtml, 'click', function() { slideshow.clickPhoto(); });
    }
    FB.util.Event.addListener(document, 'keyup', function(e) {
      if (e.keyCode == 27) {
        slideshow.exitFullScreen();
      }
    });
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
    this.highlightThumb(photoNum);
    this.selectedThumb = photoNum;
    if (this.photoPickerHtml !== undefined) {
      this.slidePhotoPickerToPhoto(photoNum);
    }
  },

  getThumbIndex: function(photoNum) {
    var middleThumb = Math.floor(this.thumbsHtml.length / 2);
    for (var t = 0; t < middleThumb; t++) {
      if (this.thumbPhotoNums[middleThumb - t] == photoNum) {
        return middleThumb - t;
      } else if (this.thumbPhotoNums[middleThumb + t] == photoNum) {
        return middleThumb + t;
      }
    }
    return null;
  },

  slidePhotoPickerToPhoto: function(photoNum) {
    if (this.isSliding) {
      return false;
    }
    if (photoNum == this.centeredThumb) {
      return false;
    }
    var thumbIndex = this.getThumbIndex(photoNum);
    if (thumbIndex == null) {
      this.centeredThumb = photoNum;
      this.renderPhotoPicker();
    } else {
      this.slidePhotoPickerToThumb(thumbIndex);
    }
  },

  slidePhotoPickerToThumb: function(thumbIndex) {
    if (this.isSliding) {
      return false;
    }
    var centeredThumbIndex = this.getThumbIndex(this.centeredThumb);
    var startThumbLeft = this.thumbsHtml[centeredThumbIndex].offsetLeft;
    if (FB.util.Dom.hasClassName(this.thumbsHtml[centeredThumbIndex], 'selected')) {
      startThumbLeft += 5;
    }
    var endThumbLeft = this.thumbsHtml[thumbIndex].offsetLeft;
    if (FB.util.Dom.hasClassName(this.thumbsHtml[thumbIndex], 'selected')) {
      endThumbLeft += 5;
    }
    this.isSliding = true;
    this.slidePhotoPicker(this.thumbContainerHtml.offsetLeft, this.thumbContainerHtml.offsetLeft + startThumbLeft - endThumbLeft);
    this.centeredThumb = this.thumbPhotoNums[thumbIndex];
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
    var numThumbsInScreen = Math.ceil((photoPickerRect.width / 2) / (thumbWidth + 10));
    this.thumbContainerHtml.innerHTML = '';
    this.thumbsHtml = [];
    this.thumbPhotoNums = [];
    for (var t = this.centeredThumb - numThumbs; t <= this.centeredThumb + numThumbs; t++) {
      var photoNum = ((t % this.photos.length) + this.photos.length) % this.photos.length;
      var isInScreen = (t >= this.centeredThumb - numThumbsInScreen && t <= this.centeredThumb + numThumbsInScreen)
      this.createThumb(photoNum, isInScreen);
    }
    this.highlightThumb(this.selectedThumb);
    var thumbContainerWidth = 10 * (numThumbs * 2 + 2) + thumbWidth * (numThumbs * 2 + 1);
    var thumbContainerLeft = Math.floor((photoPickerRect.width - thumbContainerWidth) / 2);
    this.thumbContainerHtml.style.width = thumbContainerWidth + 'px';
    this.thumbContainerHtml.style.left = thumbContainerLeft + 'px';
  },

  createThumb: function(photoNum, isInScreen) {
    var thumbHtml = document.createElement("div");
    FB.util.Dom.addClassName(thumbHtml, 'thumb');
    thumbHtml.style.backgroundImage = 'url(' + FB.util.getThumbUrl(this.photos[photoNum]) + ')';
    this.thumbContainerHtml.appendChild(thumbHtml);
    this.thumbsHtml.push(thumbHtml);
    this.thumbPhotoNums.push(photoNum);
    FB.util.Event.addListener(thumbHtml, 'click', this.clickThumbHandler(photoNum));
  },

  highlightThumb: function(photoNum) {
    for (var t = 0; t < this.thumbsHtml.length; t++) {
      if (this.thumbPhotoNums[t] == photoNum) {
        FB.util.Dom.addClassName(this.thumbsHtml[t], 'selected');
      } else {
        FB.util.Dom.removeClassName(this.thumbsHtml[t], 'selected');
      }
    }
  },

  scheduleNext: function() {
    var slideshow = this;
    var speed = this.autoSpeed;
    clearTimeout(this.currentTimeout);
    this.currentTimeout = setTimeout(function() { slideshow.next(speed); }, this.period);
  },

  render: function() {
    if (this.photoPickerHtml !== undefined) {
      this.renderPhotoPicker();
    }
    if (this.isFullScreen) {
      var photoPosition = this.getMaximizedPhotoPosition();
    } else {
      var photoPosition = this.getMinimizedPhotoPosition();
    }
    //alert(JSON.stringify({top: photoPosition.top, height: photoPosition.height}));
    this.setPhotoTop(photoPosition.top + 'px');
    this.setPhotoHeight(photoPosition.height + 'px');
    //alert(JSON.stringify({top: this.photoHtml.style.top, height: this.photoHtml.style.height}));
    //alert('pause 2');
    if (this.fullScreenClickAreaHtml !== undefined) {
      this.fullScreenClickAreaHtml.style.height = photoPosition.height + 'px';
    }
    this.photoSequence.render();
    this.renderArrows();
  },

  getMinimizedPhotoPosition: function() {
    if (this.photoPickerHtml === undefined) {
      var top = FB.util.Dom.get('hd').getBoundingClientRect().bottom;
    } else {
      var top = this.photoPickerHtml.getBoundingClientRect().bottom;
    }
    var bottom = FB.util.Dom.get('ft').getBoundingClientRect().top;
    var height = Math.max(this.autoResizeMin, bottom - top);
    var pageSize = FB.util.getPageSize();
    //alert(JSON.stringify({top: top, bottom: bottom, height: height, windowHeight: pageSize[3], innerHeight: window.innerHeight}));
    var windowHeight = window.innerHeight;
    return {top: window.pageYOffset + top, height: height};
  },

  getMaximizedPhotoPosition: function() {
      var pageSize = FB.util.getPageSize();
      var top = 0;
      var bottom = pageSize[3];
      var height = Math.max(400, bottom - top);
      return {top: window.pageYOffset + top, height: height};
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
    if (this.isFullScreen) {
      this.closeLinkHtml.style.display = 'block';
      if (this.plusLinkHtml !== undefined && this.minusLinkHtml !== undefined) {
        this.plusLinkHtml.style.display = 'block';
        this.minusLinkHtml.style.display = 'block';
      }
    }
    this.renderArrows();
  },

  hideButtons: function() {
    this.prevLinkHtml.style.display = 'none';
    this.nextLinkHtml.style.display = 'none';
    if (this.closeLinkHtml !== undefined) {
      this.closeLinkHtml.style.display = 'none';
    }
    if (this.plusLinkHtml !== undefined && this.minusLinkHtml !== undefined) {
      this.plusLinkHtml.style.display = 'none';
      this.minusLinkHtml.style.display = 'none';
    }
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

  darkenCloseLink: function() {
    FB.util.Dom.setOpacity(this.closeLinkHtml, this.hoverArrowOpacity);
  },

  lightenCloseLink: function() {
    FB.util.Dom.setOpacity(this.closeLinkHtml, this.defaultArrowOpacity);
  },

  darkenPlusLink: function() {
    FB.util.Dom.setOpacity(this.plusLinkHtml, this.hoverArrowOpacity);
  },

  lightenPlusLink: function() {
    FB.util.Dom.setOpacity(this.plusLinkHtml, this.defaultArrowOpacity);
  },

  darkenMinusLink: function() {
    FB.util.Dom.setOpacity(this.minusLinkHtml, this.hoverArrowOpacity);
  },

  lightenMinusLink: function() {
    FB.util.Dom.setOpacity(this.minusLinkHtml, this.defaultArrowOpacity);
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
    this.slidePhotoPickerToThumb(this.getThumbIndex(this.centeredThumb) + numThumbs - 1);
  },

  clickPhotoPickerPrev: function() {
    var photoPickerRect = this.photoPickerHtml.getBoundingClientRect();
    var thumbWidth = Math.floor((photoPickerRect.height - 20) * 4/3);
    var numThumbs = Math.floor(photoPickerRect.width / (thumbWidth + 10));
    this.slidePhotoPickerToThumb(this.getThumbIndex(this.centeredThumb) - numThumbs + 1);
  },

  exitFullScreen: function() {
    if (this.isFullScreen) {
      this.toggleFullScreen();
    }
  },

  toggleFullScreen: function() {
    if (this.isResizing || this.photoSequence.isZooming) {
      return;
    }
    var photoPickerRect = this.photoPickerHtml.getBoundingClientRect();
    var footerRect = FB.util.Dom.get('ft').getBoundingClientRect();
    var pageHeight = FB.util.getPageSize()[3];
    var slideshow = this;
    if (this.isFullScreen) {
      this.isFullScreen = false;
      this.hideButtons();
      this.showButtons();
      var endDimensions = this.getMinimizedPhotoPosition();
      var endPos = {top: endDimensions.top, height: endDimensions.height, zoomLevel: 0};
      var callback = function() {
        FB.util.Dom.removeClassName(slideshow.html, 'full-screen');
      };
      FB.util.Dom.removeClassName(this.bodyHtml, 'full-screen');
      this.startSmoothResizePhoto(endPos, callback);
    } else {
      FB.util.Dom.addClassName(this.html, 'full-screen');
      var endDimensions = this.getMaximizedPhotoPosition();
      this.startSmoothResizePhoto(
        {top: endDimensions.top, height: endDimensions.height, zoomLevel: 0},
        function() {
          FB.util.Dom.addClassName(slideshow.bodyHtml, 'full-screen');
          slideshow.isFullScreen = true;
          slideshow.hideButtons();
          slideshow.showButtons();
        });
    }
  },

  startSmoothResizePhoto: function(endPos, callback) {
    var photoRect = this.photoSequenceHtml.getBoundingClientRect();
    var photoPickerRect = this.photoPickerHtml.getBoundingClientRect();
    var pageHeight = FB.util.getPageSize()[3];
    var startPos = {top: window.pageYOffset + photoRect.top, height: photoRect.height, zoomLevel: this.photoSequence.getZoomLevel()};
    this.isResizing = true;
    this.smoothResizePhoto(startPos, endPos, callback);
  },

  smoothResizePhoto: function(startPos, endPos, callback, progress) {
    if (progress === undefined) {
      progress = 0.025;
    }
    if (progress < 1 && this.isResizing) {
      var newTop = startPos.top + (endPos.top - startPos.top) * (0.5 - 0.5 * Math.cos(progress * Math.PI));
      var newHeight = startPos.height + (endPos.height - startPos.height) * (0.5 - 0.5 * Math.cos(progress * Math.PI));
      var newZoomLevel = startPos.zoomLevel + (endPos.zoomLevel - startPos.zoomLevel) * (0.5 - 0.5 * Math.cos(progress * Math.PI));
      this.setPhotoTop(newTop + 'px');
      this.setPhotoHeight(newHeight + 'px');
      this.photoSequence.setZoomLevel(newZoomLevel);
      this.renderArrows();
      var slideshow = this;
      setTimeout(function() { slideshow.smoothResizePhoto(startPos, endPos, callback, progress + 0.025) }, 10);
    } else {
      this.isResizing = false;
      this.photoSequence.setZoomLevel(endPos.zoomLevel);
      this.setPhotoTop(endPos.top + 'px');
      this.setPhotoHeight(endPos.height + 'px');
      callback();
      this.showButtons();
      this.render();
    }
  },

  setPhotoHeight: function(height) {
    this.photoHtml.style.height = height;
    this.photoSequenceHtml.style.height = height;
    if (this.fullScreenClickAreaHtml !== undefined) {
      this.fullScreenClickAreaHtml.style.height = height;
    }
  },

  setPhotoTop: function(top) {
    this.photoHtml.style.top = top;
  },

  zoomIn: function() {
    this.photoSequence.zoomIn();
  },

  zoomOut: function() {
    this.photoSequence.zoomOut();
  },

  clickPhoto: function() {
    if (!this.isFullScreen || (this.plusLinkHtml === undefined && this.minusLinkHtml === undefined)) {
      this.toggleFullScreen();
    }
  },

  photoMouseDown: function(e) {
    if (this.isFullScreen && !this.photoSequence.isZooming && this.plusLinkHtml !== undefined && this.minusLinkHtml !== undefined) {
      this.startDrag(e.pageX, e.pageY);
    }
  },

  photoMouseUp: function() {
    if (this.isDragging) {
      this.endDrag();
    }
  },

  photoMouseMove: function(e) {
    if (this.isDragging) {
      this.dragTo(e.pageX, e.pageY);
    }
  },

  startDrag: function(x, y) {
    var focalPoint = this.photoSequence.getFocalPoint();
    this.dragStartPos = {mouseX: x, mouseY: y, photoX: focalPoint.x, photoY: focalPoint.y};
    this.isDragging = true;
    FB.util.Dom.addClassName(this.html, 'dragging');
  },

  dragTo: function(x, y) {
    this.photoSequence.setFocalPoint(
      this.dragStartPos.photoX - (x - this.dragStartPos.mouseX),
      this.dragStartPos.photoY - (y - this.dragStartPos.mouseY));
  },

  endDrag: function() {
    this.isDragging = false;
    FB.util.Dom.removeClassName(this.html, 'dragging');
  }

};
