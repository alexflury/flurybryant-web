FB.Modules.Documents = function(docPhotoSequence, magPhotoSequence) {
  this.docPhotoSequence = docPhotoSequence;
  this.magPhotoSequence = magPhotoSequence;
  this.getHtml();
  this.addListeners();
};

FB.Modules.Documents.prototype = {
  docOffsetX: 0,
  docOffsetY: 0,
  docWidth: 0,
  docHeight: 0,
  magWidth: 0,
  magHeight: 0,
  magOuterWidth: 0,
  magOuterHeight: 0,
  sensorSize: 25,
  numSensorsX: -1,
  numSensorsY: -1,
  activeSensor: 0,
  albumName: '',
  pageNum: 0,
  albums: new Array(),
  albumsByName: new Array(),
  docPhotoSequence: null,
  magPhotoSequence: null,
  html: null,
  documentHtml: null,
  magnifierHtml: null,
  magPhotoPositionerHtml: null,
  sensorsHtml: null,
  explanationHtml: null,
  photoLinkHtml: null,
  pageNumberHtml: null,
  prevLinkHtml: null,
  nextLinkHtml: null,
  viewHtml: null,

  getHtml: function() {
    this.html = FB.util.Dom.get('documents');
    var albumLinkHtmls = FB.util.Dom.getElementsByClassName('album-link', this.html);
    for (var a = 0; a < albumLinkHtmls.length; a++) {
      var albumName = albumLinkHtmls[a].href;
      albumName = albumName.substr(albumName.indexOf('?album=') + 7);
      var album = new FB.Modules.Documents.Album(a, albumName, albumLinkHtmls[a]);
      this.albums[a] = album;
      this.albumsByName[albumName] = album;
    }
    this.explanationHtml = FB.util.Dom.getElementsByClassName('explanation', this.html)[0];
    this.photoLinkHtml = FB.util.Dom.get('photo-link');
    this.pageNumberHtml = FB.util.Dom.get('page-number');
    this.prevLinkHtml = FB.util.Dom.get('prev-link');
    this.nextLinkHtml = FB.util.Dom.get('next-link');
    this.viewHtml = FB.util.Dom.get('view');
    this.documentHtml = FB.util.Dom.get('document');
    this.magnifierHtml = FB.util.Dom.get('magnifier');
    this.magPhotoPositionerHtml = FB.util.Dom.get('mag-photo-positioner');
    this.sensorsHtml = FB.util.Dom.get('sensors');
    this.docWidth = FB.util.getNumFromPx(this.documentHtml.style.width);
    this.docHeight = FB.util.getNumFromPx(this.documentHtml.style.height);
    this.magWidth = FB.util.getNumFromPx(this.magnifierHtml.style.width);
    this.magHeight = FB.util.getNumFromPx(this.magnifierHtml.style.height);
    var borderWidth = FB.util.getNumFromPx(this.magnifierHtml.style.borderWidth);
    this.magOuterWidth = this.magWidth + 2 * borderWidth;
    this.magOuterHeight = this.magHeight + 2 * borderWidth;
    this.docPhotoSequence.setOnFinishLoading(this.getOnPhotoLoad());
 },

  addListeners: function() {
    for (var a = 0; a < this.albums.length; a++) {
      linkHtml = this.albums[a].getLinkHtml();
      linkHtml.href = 'javascript:void(0);';
      FB.util.Event.addListener(linkHtml, 'click', this.getAlbumSetter(this.albums[a].getName()));
    }
    this.prevLinkHtml.href = 'javascript:void(0);';
    FB.util.Event.addListener(this.prevLinkHtml, 'click', this.getPrevPager());
    this.nextLinkHtml.href = 'javascript:void(0);';
    FB.util.Event.addListener(this.nextLinkHtml, 'click', this.getNextPager());
  },

  createSensors: function() {
    var x = 0;
    var y = 0;
    for (y = 0; y * this.sensorSize < this.docHeight; y++) {
      for (x = 0; x * this.sensorSize < this.docWidth; x++) {
        sensor = document.createElement('div');
        this.sensorsHtml.appendChild(sensor);
        sensor.style.width = this.sensorSize + 'px';
        sensor.style.height = this.sensorSize + 'px';
        sensor.style.left = (x * this.sensorSize) + 'px';
        sensor.style.top = (y * this.sensorSize) + 'px';
        FB.util.Dom.setOpacity(sensor, 0);
        FB.util.Event.addListener(sensor, 'mouseover', this.getMouseUpdater(x, y));
        FB.util.Event.addListener(sensor, 'mouseout', this.getOnSensorMouseout(x, y));
      }
    }
    this.numSensorsX = x;
    this.numSensorsY = y;
    this.sensorsHtml.style.display = 'block';
  },

  setViewHeight: function(viewHeight) {
    this.viewHeight = viewHeight;
    this.viewHtml.style.height = viewHeight + 'px';
  },

  setAlbum: function(albumName, pageNum) {
    if (this.docPhotoSequence.isLoading() || this.magPhotoSequence.isLoading()) {
      return;
    }
    this.albumName = albumName;
    for (var a = 0; a < this.albums.length; a++) {
      if (this.albums[a].getName() == albumName) {
        FB.util.Dom.addClassName(this.albums[a].getLinkHtml(), 'selected');
      } else {
        FB.util.Dom.removeClassName(this.albums[a].getLinkHtml(), 'selected');
      }
    }
    this.setPageNum(pageNum);
  },

  getAlbum: function() {
    return this.albumsByName[this.albumName];
  },

  getAlbumSetter: function(albumName) {
    var docs = this;
    return function() { docs.setAlbum(albumName, 1); };
  },

  setPageNum: function(pageNum) {
    var album = this.getAlbum();
    var numDocuments = album.getNumDocuments();
    var photoNum = album.getPhotosPos() + pageNum - 1;
    if (pageNum < 1 || pageNum > numDocuments || !this.docPhotoSequence.loadPhoto(photoNum)) {
      return;
    }
    this.magPhotoSequence.loadPhoto(photoNum);
    this.pageNum = pageNum;
    this.photoLinkHtml.href = this.magPhotoSequence.getPhotoUrl();
    this.explanationHtml.style.visibility = 'visible';
    this.pageNumberHtml.innerHTML = 'Document ' + pageNum + ' of ' + numDocuments;
    this.prevLinkHtml.style.visibility = (pageNum > 1) ? 'visible' : 'hidden';
    this.nextLinkHtml.style.visibility = (pageNum < numDocuments) ? 'visible' : 'hidden';
  },

  onPhotoLoad: function() {
    if (this.numSensorsX < 0) {
      this.createSensors();
    }
  },

  getOnPhotoLoad: function() {
    docs = this;
    return function() { docs.onPhotoLoad(); };
  },

  nextPage: function() {
    this.setPageNum(this.pageNum + 1);
  },

  prevPage: function() {
    this.setPageNum(this.pageNum - 1);
  },

  getNextPager: function() {
    var docs = this;
    return function() { docs.nextPage(); };
  },

  getPrevPager: function() {
    var docs = this;
    return function() { docs.prevPage(); };
  },

  setDocPosition: function(x, y) {
    this.docX = x;
    this.docY = y;
    this.documentHtml.style.left = x + 'px';
    this.documentHtml.style.top = y + 'px';
  },

  resetDocPosition: function() {
    this.setDocPosition((this.viewWidth - this.docWidth) / 2, (this.viewHeight - this.docHeight) / 2);
  },

  startDrag: function(mouseX, mouseY) {
    document.body.style.cursor = 'url(/cursors/closedhand.cur), default';
    this.viewHtml.style.cursor = 'url(/cursors/closedhand.cur), default';
    FB.util.Dom.addClassName(this.viewHtml, 'dragged');
    this.dragging = true;
    this.mouseOffsetX = mouseX - this.docX;
    this.mouseOffsetY = mouseY - this.docY;
  },

  stopDrag: function() {
    document.body.style.cursor = '';
    this.viewHtml.style.cursor = 'url(/cursors/openhand.cur), default';
    FB.util.Dom.removeClassName(this.viewHtml, 'dragged');
    this.dragging = false;
  },

  getDragStarter: function() {
    var docs = this;
    return function(e) { docs.startDrag(e.clientX, e.clientY); };
  },

  getDragStopper: function() {
    var docs = this;
    return function() { docs.stopDrag(); };
  },

  showMagnifierAt: function(x, y) {
    if (x < 0 || x > this.docWidth - this.magOuterWidth || y < 0 || y > this.docHeight - this.magOuterHeght) {
      return false;
    }
    this.magnifierHtml.style.left = x + 'px';
    this.magnifierHtml.style.top = y + 'px';
    this.magPhotoPositionerHtml.style.left = (this.magOuterWidth - this.magPhotoSequence.width) * x / (this.docWidth - this.magOuterWidth) + 'px';
    this.magPhotoPositionerHtml.style.top = (this.magOuterHeight - this.magPhotoSequence.height) * y / (this.docHeight - this.magOuterHeight) + 'px';
    this.magnifierHtml.style.display = 'block';
  },

  hideMagnifier: function() {
    this.magnifierHtml.style.display = 'none';
  },

  onSensorMouseout: function(sensorX, sensorY) {
    this.hideMagnifier();
  },

  updateMouse: function(sensorX, sensorY) {
    this.activeSensor = sensorX + '-' + sensorY;
    this.showMagnifierAt(
      (this.docWidth - this.magOuterWidth) * sensorX / (this.numSensorsX - 1),
      (this.docHeight - this.magOuterHeight) * sensorY / (this.numSensorsY - 1)
    );
  },

  getOnSensorMouseout: function(sensorX, sensorY) {
    var docs = this;
    return function() { docs.onSensorMouseout(sensorX, sensorY); };
  },

  getMouseUpdater: function(sensorX, sensorY) {
    var docs = this;
    return function() { docs.updateMouse(sensorX, sensorY); };
  },

  getOnMouseMove: function() {
    var docs = this;
    return function(e) {
      docs.updateMouse(e.clientX - docs.docOffsetX, e.clientY - docs.docOffsetY);
    };
  },

  setAlbumDocuments: function(albumName, photosPos, documents) {
    var album = this.albumsByName[albumName];
    if (!album) { return; }
    album.setDocuments(documents);
    album.setPhotosPos(photosPos);
  }
};

FB.Modules.Documents.Album = function(albumNum, name, linkHtml) {
  this.albumNum = albumNum;
  this.name = name;
  this.linkHtml = linkHtml;
};

FB.Modules.Documents.Album.prototype = {
  name: '',
  albumNum: 0,
  photosPos: 0,
  linkHtml: null,
  documents: new Array(),

  getName: function() {
    return this.name;
  },

  getAlbumNum: function() {
    return this.albumNum;
  },

  getLinkHtml: function() {
    return this.linkHtml;
  },

  setDocuments: function(documents) {
    this.documents = documents;
  },

  setPhotosPos: function(photosPos) {
    this.photosPos = photosPos;
  },

  getPhotosPos: function() {
    return this.photosPos;
  },

  getNumDocuments: function() {
    return this.documents.length;
  },

  getDocumentUrl: function(docNum) {
    return '/images/photos/' + this.documents[docNum - 1];
  }
};
