var FB = {
  Modules: {},
  util: {
    isUndefined: function(val) {
      return (val === void(0));
    },

    getNumFromPx: function(px) {
      return Number(px.substr(0, px.indexOf('px')));
    },

    getPxFromNum: function(num) {
      return num + 'px';
    },

    getPhotoUrl: function(photo) {
      return '/images/photos/' + photo;
    },

    getThumbUrl: function(photo) {
      return '/images/thumbs/' + photo;
    },

    getScrollPosition: function() {
      var scrollPosition = {};

      if (window.pageXOffset !== undefined && window.pageYOffset !== undefined) {
        scrollPosition.x = window.pageXOffset;
        scrollPosition.y = window.pageYOffset;
      } else {
        scrollPosition.x = document.documentElement.scrollLeft;
        scrollPosition.y = document.documentElement.scrollTop;
      }

      return scrollPosition;
    },

    //
    // getPageSize()
    // Returns array with page width, height and window width, height
    // Core code from - quirksmode.org
    // Edit for Firefox by pHaez
    //
    getPageSize: function() {
      var xScroll, yScroll;

      if (window.innerHeight && window.scrollMaxY) {
	xScroll = document.body.scrollWidth;
	yScroll = window.innerHeight + window.scrollMaxY;
      } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
	xScroll = document.body.scrollWidth;
	yScroll = document.body.scrollHeight;
      } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
	xScroll = document.body.offsetWidth;
	yScroll = document.body.offsetHeight;
      }

      var windowWidth, windowHeight;
      if (self.innerHeight) {// all except Explorer
	windowWidth = self.innerWidth;
	windowHeight = self.innerHeight;
      } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
	windowWidth = document.documentElement.clientWidth;
	windowHeight = document.documentElement.clientHeight;
      } else if (document.body) { // other Explorers
	windowWidth = document.body.clientWidth;
	windowHeight = document.body.clientHeight;
      }

      // for small pages with total height less then height of the viewport
      if(yScroll < windowHeight){
	pageHeight = windowHeight;
      } else { 
	pageHeight = yScroll;
      }

      // for small pages with total width less then width of the viewport
      if(xScroll < windowWidth){
	pageWidth = windowWidth;
      } else {
	pageWidth = xScroll;
      }

      arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight) 
	return arrayPageSize;
    },

    Dom: {

      autoResizeElements: null,

      getBoundingRect: function(el) {
        var rect = el.getBoundingClientRect();
        return {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          x: rect.left,
          y: rect.top,
          width: rect.right - rect.left,
          height: rect.bottom - rect.top
        };
      },

      get: function(name) {
	return document.getElementById(name);
      },

      hasClassName: function(el, className) {
	var classNames = el.className.split(' ');
	for (var c = 0; c < classNames.length; c++) {
	  if (classNames[c] == className) { return true; }
	}
	return false;
      },

      addClassName: function(el, className) {
	if (!FB.util.Dom.hasClassName(el, className)) {
	  el.className += ' ' + className;
	}
      },

      removeClassName: function(el, className) {
	var classNames = el.className.split(' ');
	var newClassNames = new Array();
	for (var c = 0; c < classNames.length; c++) {
	  if (classNames[c] != className) {
	    newClassNames.push(classNames[c]);
	  }
	}
	el.className = newClassNames.join(' ');
      },

      getElementsByClassName: function(classname, node) {
        if (!node) { node = document.getElementsByTagName("body")[0]; }
        var a = [];
        var re = new RegExp('(^| )' + classname + '($| )');
        var els = node.getElementsByTagName("*");
        for (var i = 0, j = els.length; i < j; i++) {
          if (re.test(els[i].className)) { a.push(els[i]); }
        }
        return a;
      },

      setOpacity: function(el, alpha) {
        var style = el.style;
        if (style.MozOpacity != undefined) { // Moz and older
	  style.MozOpacity = alpha;
        }
        if (style.filter != undefined && el.filters != undefined) { // IE
          if (alpha >= 1) {
            style.filter = 'none';
          } else {
            style.filter = "alpha(opacity=" + (alpha * 100) + ")";
            el.filters.alpha.opacity = alpha * 100;
          }
        }
        if (style.opacity != undefined) { // Opera
          style.opacity = alpha;
        }
      },

      getAutoResizeElements: function() {
        return FB.util.Dom.autoResizeElements;
      },

      registerAutoResizeHeight: function(el, delta, minHeight) {
        if (FB.util.Dom.autoResizeElements === null) {
          FB.util.Event.addListener(window, 'resize', FB.util.Dom.doAutoResize);
          FB.util.Event.addListener(window, 'load', FB.util.Dom.doAutoResize);
          FB.util.Dom.autoResizeElements = [];
        }
        FB.util.Dom.autoResizeElements.push({'element': el, 'delta': delta, 'min': minHeight});
      },

      doAutoResize: function() {
        pageHeight = FB.util.getPageSize()[3];
        var elements = FB.util.Dom.getAutoResizeElements();
        for (var e = 0; e < elements.length; e++) {
          if (elements[e].min === undefined || elements[e].min === null) {
            elements[e].element.style.height = (pageHeight - elements[e].delta) + 'px';
          } else {
            elements[e].element.style.height = Math.max(elements[e].min, (pageHeight - elements[e].delta)) + 'px';
          }
        }
      },

      resizeHeight: function(element, delta, min) {
        var pageHeight = FB.util.getPageSize()[3];
        if (min === undefined || min === null) {
          element.style.height = (pageHeight - delta) + 'px';
        } else {
          element.style.height = Math.max(min, (pageHeight - delta)) + 'px';
        }
      }

    },

    Event: {
      addListener: function(element, type, expression, bubbling) {
        bubbling = bubbling || false;
        if(window.addEventListener) { // Standard
          element.addEventListener(type, expression, bubbling);
          return true;
        } else if(window.attachEvent) { // IE
          element.attachEvent('on' + type, expression);
          return true;
        } else { return false; }
      }
    }
  }
};
