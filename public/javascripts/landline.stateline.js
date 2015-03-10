(function() {
  // Stateline puts default collections of Landline maps together for you
  // Requires jQuery and Raphael
  var MapCanvas = Landline.Stateline = function(container, locality, opts) {
    this.paper     = {};
    this.events    = {};
    this.attrs     = {};
    this.lookup    = {};
    this.locality  = locality;
    this.container = $(container);
    this.container.css("position", "relative");

    this.opts = _.extend({}, opts);
    this.container.height(this.container.width() * this.opts.main.heightMultiplier);
    this.containers = this.opts.containers;
    this.extensions = this.opts.extensions;
    this.containerUnique = container.replace("#", "").replace(".", "");

    this.setupHtml();

    var that = this;
    $(window).resize(function() {
      that.container.height(that.container.width() * that.opts.main.heightMultiplier);
      that.setupHtml();
    });
  };

  MapCanvas.prototype.on = function(evt, cb) {
    this.events[evt] = cb;
  };

  MapCanvas.prototype.style = function(fips, key, val) {
    this.attrs[fips] = (this.attrs[fips] || {});
    this.attrs[fips][key] = val;
  };

  MapCanvas.prototype.reLayout = function() {
    for (container in this.containers) {
      for (fips in this.attrs) {
        var path = this.lookup[fips];
        if (path) {
          _(this.attrs[fips]).each(function(v, k) {
            path.attr(k, v);
          });
        }
      }
    }
  };

  MapCanvas.prototype.setupHtml = function() {
    var that = this;
    var containers = that.containers;

    for (c in containers) {
      containers[c] = _.extend(containers[c], that.extensions[c], {
        width  : this.container.width() * that.extensions[c].widthMultiplier,
        height : this.container.height() * that.extensions[c].heightMultiplier,
      });
    }

    var setPositions = function(container) {
      $("#" + containers[container].el + "-" + that.containerUnique)
        .width(containers[container].width)
        .height(containers[container].height)
        .css("top", containers[container].top)
        // calculate how many pixels left the % is, 
        // so Hawaii doesn't move around when the window is resized
        .css("margin-left", that.container.width() * containers[container].left)
        .css("position", "absolute");
    };

    for (container in containers) {
      if (this.paper[container]) {
        setPositions(container);
        this.paper[container].setSize(containers[container].width, containers[container].height);
      } else {
        this.container.append("<div id='" + containers[container].el + "-" + that.containerUnique + "'></div>");
        setPositions(container);
        this.paper[container] = Raphael(containers[container].el + "-" + that.containerUnique);
        this.paper[container].setViewBox(0, 0, containers[container].width, containers[container].height);
        // draw the line for DC
        if (container === "contiguous") {
          var dcLineCoordPcts   = [[0.88, 0.45], [0.91, 0.47]];
          var dcLineCoordPixels = _(dcLineCoordPcts).map(function(pair) { return [containers[container].width * pair[0], containers[container].height * pair[1]] });
          this.paper[container].path(["M", dcLineCoordPixels[0][0], dcLineCoordPixels[0][1], "L", dcLineCoordPixels[1][0], dcLineCoordPixels[1][1]] ).attr("stroke", "#cecece").attr("stroke-width", "0.5");
        }
      }
    }
  };

  MapCanvas.prototype.createMap = function() {
    var data;
    var that       = this;
    var containers = that.containers;

    if (this.locality === "states")   data = window.StatelineStates;
    if (this.locality === "counties") data = window.StatelineCounties;
    for (container in containers) {
      var localityMap = new Landline(data[container]).all();
      localityMap.asSVG(containers[container].width, containers[container].height, function(svg, it) {
        var path = that.paper[container].path(svg);
        var fips = it.fips = it.get("c") ? it.get("s") + it.get("c") : it.get("s");
        that.lookup[fips] = path;
        for (style in that.opts.defaultStyle) {
          path.attr(style, that.opts.defaultStyle[style]);
        }
        if (that.attrs[fips]) {
          _(that.attrs[fips]).each(function(v, k) {
            path.attr(k, v)
          });
        }
        _(that.events).each(function(func, evt) {
          path[evt](function(e) {
            func(e, path, it);
          });
        });
      });
    }
  };
}).call(this);
