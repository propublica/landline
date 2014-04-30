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
    console.log(this)

    var that = this;
    $(window).resize(function() {
      that.container.height(that.container.width() * 0.70);
      that.setupHtml();
    });
  };

  MapCanvas.CONTAINERS = {
    "continental" : {el : "landline_continental"},
    "alaska"      : {el : "landline_alaska"},
    "hawaii"      : {el : "landline_hawaii"}
  };

  MapCanvas.prototype.on = function(evt, cb) {
    this.events[evt] = cb;
  };

  MapCanvas.prototype.style = function(fips, key, val) {
    this.attrs[fips] = (this.attrs[fips] || []);
    this.attrs[fips].push([key, val]);
  };

  MapCanvas.prototype.reLayout = function() {
    for (container in MapCanvas.CONTAINERS) {
      for (fips in this.attrs) {
        var path = this.lookup[fips];
        _(this.attrs[fips]).each(function(attr) {
          path.attr(attr[0], attr[1]);
        });
      }
    }
  };

  MapCanvas.prototype.setupHtml = function() {
    var that = this;
    var containers = MapCanvas.CONTAINERS;

    containers["continental"] = _.extend(containers["continental"], {
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
      width : this.container.width() * 0.15,
      height : this.container.height() * 0.21,
      top : "70%",
      left : 0.25
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
          _(that.attrs[fips]).each(function(attr) {
            path.attr(attr[0], attr[1])
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