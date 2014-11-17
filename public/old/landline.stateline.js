(function() {
  // Stateline puts default collections of Landline maps together for you
  // Requires jQuery and Raphael
  var MapCanvas = Landline.Stateline = function(container, locality) {
    this.paper     = {};
    this.events    = {};
    this.attrs     = {};
    this.lookup    = {};
    this.locality  = locality;
    this.container = $(container);
    this.container.css("position", "relative");
    this.container.height(this.container.width() * 0.70);
    this.setupHtml();

    var that = this;
    $(window).resize(function() {
      that.container.height(that.container.width() * 0.70);
      that.setupHtml();
    });
  };

  MapCanvas.CONTAINERS = {
    "contiguous" : {el : "landline_contiguous"},
    "alaska"      : {el : "landline_alaska"},
    "hawaii"      : {el : "landline_hawaii"},
    "dc"          : {el : "landline_dc"}
  };

  MapCanvas.prototype.on = function(evt, cb) {
    this.events[evt] = cb;
  };

  MapCanvas.prototype.style = function(fips, key, val) {
    this.attrs[fips] = (this.attrs[fips] || {});
    this.attrs[fips][key] = val;
  };

  MapCanvas.prototype.reLayout = function() {
    for (container in MapCanvas.CONTAINERS) {
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
    var containers = MapCanvas.CONTAINERS;

    containers["contiguous"] = _.extend(containers["contiguous"], {
      width  : this.container.width(),
      height : this.container.height() * 0.85,
      top    : "0%",
      left   : 0.0
    });

    containers["alaska"] = _.extend(containers["alaska"], {
      width  : this.container.width() * 0.25,
      height : this.container.height() * 0.27,
      top    : "63%",
      left   : 0.0
    });

    containers["hawaii"] = _.extend(containers["hawaii"], {
      width  : this.container.width() * 0.15,
      height : this.container.height() * 0.21,
      top    : "70%",
      left   : 0.25
    });

    containers["dc"] = _.extend(containers["dc"], {
      width  : this.container.width() * 0.02,
      height : this.container.height() * 0.08,
      top    : "34.5%",
      left   : 0.915
    });

    var setPositions = function(container) {
      $("#" + containers[container].el)
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
        this.container.append("<div id='" + containers[container].el + "'></div>");
        setPositions(container);
        this.paper[container] = Raphael(containers[container].el)
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
    var containers = MapCanvas.CONTAINERS;
    if (this.locality === "states")   data = window.StatelineStates;
    if (this.locality === "counties") data = window.StatelineCounties;
    for (container in containers) {
      var localityMap = new Landline(data[container]).all();
      localityMap.asSVG(containers[container].width, containers[container].height, function(svg, it) {
        var path = that.paper[container].path(svg);
        var fips = it.fips = it.get("c") ? it.get("s") + it.get("c") : it.get("s");
        that.lookup[fips] = path;
        path.attr("fill", "#cecece")
            .attr('stroke-width', 0.5)
            .attr('stroke', '#ffffff')
            .attr('stroke-linejoin', 'bevel');
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
