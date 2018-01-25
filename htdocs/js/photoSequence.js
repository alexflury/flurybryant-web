FB.Modules.PhotoSequence = function(photos, photoNum, speed, width, height, id, thumbs) {
  this.speed = speed;
  this.width = width;
  this.height = height;
  this.id = id;
  this.photos = photos;
  this.thumbs = thumbs;
  this.getHtml();
  this.initFrames();
  this.loadPhoto(photoNum - 1, 1);
}

FB.Modules.PhotoSequence.prototype = {
  width: -1,
  height: -1,
  speed: null,
  thumbs: false,
  fadeWait: 50,
  photoNum: 0,
  frameNum: 0,
  numFutureFrames: 0,
  photos: new Array(),
  frames: new Array(),
  loading: false,
  loadLater: null,
  finishLoadingCallback: null,
  html: null,
  isZooming: false,

  getRootHtml: function() {
    return this.html;
  },

  getFramesHtml: function() {
    return FB.util.Dom.getElementsByClassName('photo-frame', this.html);
  },

  getHtml: function() {
    this.html = FB.util.Dom.get(this.id);
    var frameHtmls = FB.util.Dom.getElementsByClassName('photo-frame', this.html);
    this.frames = new Array();
    for (var f = 0; f < frameHtmls.length; f++) {
      this.frames.push(new FB.Modules.PhotoSequence.Frame(frameHtmls[f], this.speed, this.width, this.height, this.thumbs));
    }
  },

  initFrames: function() {
    for (var f = 0; f < this.frames.length; f++) {
      this.frames[f].hide();
    }
    this.numFutureFrames = this.frames.length - Math.floor(this.frames.length / 2);
  },

  getLength: function() {
    return this.photos.length;
  },

  getPhotoNum: function() {
    return this.photoNum + 1;
  },

  isLoading: function() {
    return this.loading;
  },

  loadPhoto: function(photoNum, speed) {
    if (speed === undefined || speed === null) {
      speed = this.speed;
    }
    if (this.loading || photoNum < 0 || photoNum >= this.photos.length) {
      return false;
    }
    this.loading = true;
    this.photoNum = photoNum;
    var prevFrameNum = this.prevFrameNum(this.frameNum);
    var newFrameNum;
    if (this.frames[prevFrameNum].curPhoto == this.photos[this.photoNum]) {
      newFrameNum = prevFrameNum;
    } else {
      newFrameNum = this.nextFrameNum(this.frameNum);
    }
    var frameNum = newFrameNum;
    var photoNum = this.photoNum
    for (var f = 0; f < this.numFutureFrames; f++) {
      if (frameNum == this.frameNum) {
        this.loadLater = this.photos[photoNum];
      } else {
        this.frames[frameNum].loadPhoto(this.photos[photoNum]);
      }
      frameNum = this.nextFrameNum(frameNum);
      photoNum = this.nextPhotoNum(photoNum);
    }
    frameNum = this.prevFrameNum(newFrameNum);
    photoNum = this.prevPhotoNum(this.photoNum);
    for (var f = 0; f < this.frames.length - this.numFutureFrames; f++) {
      if (frameNum == this.frameNum) {
        this.loadLater = this.photos[photoNum];
      } else {
        this.frames[frameNum].loadPhoto(this.photos[photoNum]);
      }
      frameNum = this.prevFrameNum(frameNum);
      photoNum = this.prevPhotoNum(photoNum);
    }
    this.frames[newFrameNum].zoomLevel = 0;
    this.frames[newFrameNum].focalPoint = {x: 0.5, y: 0.5};
    this.renderFrame(this.frames[newFrameNum]);
    this.showFrame(newFrameNum, speed);
    return true;
  },

  getPhotoUrl: function() {
    return FB.util.getPhotoUrl(this.photos[this.photoNum]);
  },

  prevFrameNum: function(frameNum) {
    if (frameNum <= 0) {
      return this.frames.length - 1;
    }
    return frameNum - 1;
  },

  nextFrameNum: function(frameNum) {
    if (frameNum >= this.frames.length - 1) {
      return 0;
    }
    return frameNum + 1;
  },

  prevPhotoNum: function(photoNum) {
    if (photoNum <= 0) {
      return this.photos.length - 1;
    }
    return photoNum - 1;
  },

  nextPhotoNum: function(photoNum) {
    if (photoNum >= this.photos.length - 1) {
      return 0;
    }
    return photoNum + 1;
  },

  showFrame: function(newFrameNum, speed) {
    this.frames[this.frameNum].setZIndex(0);
    this.frames[newFrameNum].setOpacity(0);
    this.frames[newFrameNum].setZIndex(1);
    this.frames[newFrameNum].show();
    this.fadeIn(newFrameNum, speed);
  },

  fadeIn: function(newFrameNum, speed) {
    var fadingOut = false; //this.frames[this.frameNum].fadeOut();
    var fadingIn = this.frames[newFrameNum].fadeIn(speed)
    if (fadingIn || fadingOut) {
      var ps = this;
      setTimeout(function() { ps.fadeIn(newFrameNum, speed); }, this.fadeWait);
    } else {
      this.frames[this.frameNum].hide();
      if (this.loadLater) {
        this.frames[this.frameNum].loadPhoto(this.loadLater);
        this.loadLater = null;
      }
      this.frameNum = newFrameNum;
      this.loading = false;
      this.fireFinishLoading();
    }
  },

  next: function(speed) {
    return this.loadPhoto(this.nextPhotoNum(this.photoNum), speed);
  },

  prev: function(speed) {
    return this.loadPhoto(this.prevPhotoNum(this.photoNum), speed);
  },

  fireFinishLoading: function() {
    if (this.finishLoadingCallback) {
      this.finishLoadingCallback();
    }
  },

  setOnFinishLoading: function(finishLoadingCallback) {
    this.finishLoadingCallback = finishLoadingCallback;
  },

  zoomIn: function() {
    if (this.frames[this.frameNum].zoomLevel < 3) {
      this.startSmoothZoom(this.frames[this.frameNum].zoomLevel + 1, this.frames[this.frameNum]);
    }
  },

  zoomOut: function() {
    if (this.frames[this.frameNum].zoomLevel > 0) {
      this.startSmoothZoom(this.frames[this.frameNum].zoomLevel - 1, this.frames[this.frameNum]);
    }
  },

  startSmoothZoom: function(zoomLevel, frame) {
    if (this.isZooming) {
      return;
    }
    if (frame === undefined) {
      frame = this.frames[this.frameNum];
    }
    this.isZooming = true;
    this.smoothZoom(frame.zoomLevel, zoomLevel, frame);
  },

  smoothZoom: function(startZoomLevel, endZoomLevel, frame, progress) {
    if (progress == undefined) {
      progress = 0.025;
    }
    if (progress < 1) {
      frame.zoomLevel = startZoomLevel + (endZoomLevel - startZoomLevel) * (0.5 - 0.5 * Math.cos(progress * Math.PI));
      this.renderFrame(frame);
      var photoSequence = this;
      setTimeout(function() { photoSequence.smoothZoom(startZoomLevel, endZoomLevel, frame, progress + 0.025); }, 10);
    } else {
      this.isZooming = false;
      frame.zoomLevel = endZoomLevel;
      this.renderFrame(frame);
    }
  },

  setZoomLevel: function(zoomLevel, frame) {
    if (frame === undefined) {
      frame = this.frames[this.frameNum];
    }
    frame.zoomLevel = zoomLevel;
    this.renderFrame(frame);
  },

  getZoomLevel: function(frame) {
    if (frame == undefined) {
      frame = this.frames[this.frameNum];
    }
    return frame.zoomLevel;
  },

  getCurrentFrame: function() {
    return this.frames[this.frameNum];
  },

  render: function() {
    for (var f = 0; f < this.frames.length; f++) {
      this.renderFrame(this.frames[f]);
    }
  },

  setFocalPoint: function(x, y, frame) {
    if (frame === undefined) {
      frame = this.frames[this.frameNum];
    }
    var rect = frame.html.getBoundingClientRect();
    frame.focalPoint = {
      x: x / rect.width,
      y: y / rect.height
    };
    this.renderFrame(frame);
  },

  getFocalPoint: function(frame) {
    if (frame === undefined) {
      frame = this.frames[this.frameNum];
    }
    var rect = frame.html.getBoundingClientRect();
    return {
      x: Math.floor(frame.focalPoint.x * rect.width),
      y: Math.floor(frame.focalPoint.y * rect.height)
    };
  },

  renderFrame: function(frame) {
    var photoSequenceRect = this.html.getBoundingClientRect();
    console.log('photoSequenceRect=' + JSON.stringify(photoSequenceRect));
    if (typeof photoSequenceRect == 'undefined') {
      console.log('photoSequenceRect is undefined');
      return;
    }
    console.log('photoSequenceRect is defined');
    var frameRect = frame.html.getBoundingClientRect();
    var height = photoSequenceRect.height * Math.pow(2, frame.zoomLevel);
    var width = photoSequenceRect.width * Math.pow(2, frame.zoomLevel);
    var x = frame.focalPoint.x * width - Math.floor(photoSequenceRect.width / 2);
    console.log(JSON.stringify({focalPoint: frame.focalPoint, height: height, photoSequenceRect: photoSequenceRect}));
    var y = frame.focalPoint.y * height - Math.floor(photoSequenceRect.height / 2);
    console.log(JSON.stringify({width: width, height: height}));
    frame.html.style.height = height + 'px';
    frame.html.style.width = width + 'px';
    x = Math.max(0, Math.min(width - photoSequenceRect.width, x));
    y = Math.max(0, Math.min(height - photoSequenceRect.height, y));
    frame.html.style.left = (-x) + 'px';
    frame.html.style.top = (-y) + 'px';
    frame.focalPoint = {
      x: (x + photoSequenceRect.width / 2) / width,
      y: (y + photoSequenceRect.height / 2) / height
    };
  }

};

FB.Modules.PhotoSequence.Frame = function(html, speed, width, height, thumbs) {
  this.html = html
  this.opacityStep = speed;
  this.width = width;
  this.height = height;
  this.thumbs = thumbs;
  if (width >= 0) {
    this.html.style.width = width + 'px';
  }
  if (height >= 0) {
    this.html.style.height = height + 'px';
  }
  this.focalPoint = {x: 0.5, y: 0.5};
};

FB.Modules.PhotoSequence.Frame.prototype = {
  width: -1,
  height: -1,
  opacityStep: null,
  html: null,
  curPhoto: null,
  opacity: 1,
  thumbs: false,
  zoomLevel: 0,
  focalPoint: null,

  hide: function() {
    this.html.style.visibility = 'hidden';
  },

  show: function() {
    this.html.style.visibility = 'visible';
  },

  loadPhoto: function(photo) {
    if (this.isZooming || this.curPhoto == photo) { return; }
    this.curPhoto = photo;
    var sizeProps = '';
    var photoUrl = '';
    if (this.thumbs) {
      photoUrl = FB.util.getThumbUrl(photo);
    } else {
      photoUrl = FB.util.getPhotoUrl(photo);
    }
    this.html.style.backgroundImage = 'url(' + photoUrl + ')';
  },

  curPhoto: function() {
    return this.curPhoto;
  },

  setOpacity: function(opacity) {
    FB.util.Dom.setOpacity(this.html, opacity - Math.sin(2 * Math.PI * opacity) / (2 * Math.PI));
    this.opacity = opacity;
  },

  setZIndex: function(zIndex) {
    this.html.style.zIndex = zIndex;
  },

  fadeOut: function() {
    if (this.opacity < this.opacityStep) {
      if (this.opacity > 0) {
        this.setOpacity(0);
      }
      return false;
    }
    this.setOpacity(this.opacity - this.opacityStep);
    return true;
  },

  fadeIn: function(speed) {
    if (this.opacity > 1 - speed) {
      if (this.opacity < 1) {
        this.setOpacity(1);
      }
      return false;
    }
    this.setOpacity(this.opacity + speed);
    return true;
  }

};
