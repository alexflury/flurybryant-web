FB.Modules.Slideshow = function(photoSequence, isAuto) {
  this.photoSequence = photoSequence;
  this.isAuto = isAuto;
  this.getHtml();
  this.addListeners();
  this.scheduleNext();
};

FB.Modules.Slideshow.prototype = {
  photoSequence: null,
  isAuto: true,
  prevLinkHtml: null,
  nextLinkHtml: null,

  getHtml: function() {
    if (!this.isAuto) {
      this.prevLinkHtml = FB.util.Dom.get('prev-link');
      this.nextLinkHtml = FB.util.Dom.get('next-link');
    }
  },

  addListeners: function() {
    if (!this.isAuto) {
      this.prevLinkHtml.href = 'javascript:void(0);';
      this.nextLinkHtml.href = 'javascript:void(0);';
      FB.util.Event.addListener(this.prevLinkHtml, 'click', this.getPrever());
      FB.util.Event.addListener(this.nextLinkHtml, 'click', this.getNexter());
    }
  },

  prev: function() {
    this.photoSequence.prev();
    if (!this.isAuto) {
      if (this.photoSequence.getPhotoNum() <= 1) {
	this.prevLinkHtml.style.visibility = 'hidden';
      }
      this.nextLinkHtml.style.visibility = 'visible';
    }
  },

  next: function() {
    this.photoSequence.next();
    if (!this.isAuto) {
      if (this.photoSequence.getPhotoNum() >= this.photoSequence.getLength()) {
        this.nextLinkHtml.style.visibility = 'hidden';
      }
      this.prevLinkHtml.style.visibility = 'visible';
    }
    this.scheduleNext();
  },

  getPrever: function() {
    var ss = this;
    return function() { ss.prev(); };
  },

  getNexter: function() {
    var ss = this;
    return function() { ss.next(); };
  },

  scheduleNext: function() {
    if (!this.isAuto) { return; }
    setTimeout('slideshow.next();', 5000);
  }
};
