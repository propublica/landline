(function() {
  // MapCanvas puts default collections of maps together for you
  // Requires jQuery and Raphael
  var MapCanvas = this.MapperCanvas = function(container, locality, lookup) {
    this.paper     = {};
    this.events    = {};
    this.locality  = locality;
    this.container = $(container);
    this.lookup    = (lookup || {});
    this.setupHtml();
  };

  MapCanvas.DEFAULTS = [
    {name : "continental", width : 950, height : 550, el : "mappercanvas_continental", 'z-index' : "999"},
    {name : "alaska",      width : 250, height : 150, el : "mappercanvas_alaska",      'z-index' : "999"},
    {name : "hawaii",      width : 150, height : 120, el : "mappercanvas_hawaii",      'z-index' : "999"}
  ];

  MapCanvas.prototype.on = function(evt, cb) {
    this.events[evt] = cb;
  };

  MapCanvas.prototype.setupHtml = function() {
    var defaults = MapCanvas.DEFAULTS;
    for (i = 0; i < defaults.length; i++) {
      var regionEl = this.container.append("<div id='" + defaults[i].el + "'></div>");
      this.paper[defaults[i].name] = Raphael(defaults[i].el, defaults[i].width, defaults[i].height);
    }
  };

  MapCanvas.prototype.createMap = function() {
    var data;
    var that     = this;
    var defaults = MapCanvas.DEFAULTS;
    if (this.locality === "states")   data = window.MapperStates;
    if (this.locality === "counties") data = window.MapperCounties;
    for (i = 0; i < defaults.length; i++) {
      // console.log(data[defaults[i].name]);
      var localityMap = new Mapper(data[defaults[i].name]).all();
      localityMap.asSVG(defaults[i].width, defaults[i].height, function(svg, it) {
        var path = that.paper[defaults[i].name].path(svg);
          path.attr("fill", "#b93737")
              .attr('stroke-width', 0.5)
              .attr('stroke', '#fff')
              .attr('stroke-linejoin', 'bevel');
          for (evt in that.events) {
            path[evt](that.events[evt]);
          }
      });
    }
  };
}).call(this);