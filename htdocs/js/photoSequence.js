FB.Modules.PhotoSequence = function(photos, photoNum, speed, width, height, id, thumbs) {
  this.speed = speed;
  this.width = width;
  this.height = height;
  this.id = id;
  this.photos = photos;
  this.thumbs = thumbs;
  this.getHtml();
  this.initFrames();
  this.loadPhoto(photoNum - 1);
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

  loadPhoto: function(photoNum) {
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
    this.showFrame(newFrameNum);
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

  showFrame: function(newFrameNum) {
    this.frames[this.frameNum].setZIndex(0);
    this.frames[newFrameNum].setOpacity(0);
    this.frames[newFrameNum].setZIndex(1);
    this.frames[newFrameNum].show();
    this.fadeIn(newFrameNum);
  },

  fadeIn: function(newFrameNum) {
    var fadingOut = false; //this.frames[this.frameNum].fadeOut();
    var fadingIn = this.frames[newFrameNum].fadeIn()
    if (fadingIn || fadingOut) {
      var ps = this;
      setTimeout(function() { ps.fadeIn(newFrameNum); }, this.fadeWait);
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

  next: function() {
    return this.loadPhoto(this.nextPhotoNum(this.photoNum));
  },

  prev: function() {
    return this.loadPhoto(this.prevPhotoNum(this.photoNum));
  },

  fireFinishLoading: function() {
    if (this.finishLoadingCallback) {
      this.finishLoadingCallback();
    }
  },

  setOnFinishLoading: function(finishLoadingCallback) {
    this.finishLoadingCallback = finishLoadingCallback;
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
};

FB.Modules.PhotoSequence.Frame.prototype = {
  width: -1,
  height: -1,
  opacityStep: null,
  html: null,
  curPhoto: null,
  opacity: 1,
  thumbs: false,

  hide: function() {
    this.html.style.visibility = 'hidden';
  },

  show: function() {
    this.html.style.visibility = 'visible';
  },

  loadPhoto: function(photo) {
    if (this.curPhoto == photo) { return; }
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

  fadeIn: function() {
    if (this.opacity > 1 - this.opacityStep) {
      if (this.opacity < 1) {
        this.setOpacity(1);
      }
      return false;
    }
    this.setOpacity(this.opacity + this.opacityStep);
    return true;
  }
};
