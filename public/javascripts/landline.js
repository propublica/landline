(function(){
  var Map = this.Landline = function(data){
    this.data = data;
  };

  Map.prototype.select = Map.prototype.filter = function(/* keys */){
    var args = [].slice.call(arguments);

    return new FeatureCollection(this.data).filter(args);
  };

  Map.prototype.all = function(){
    return new FeatureCollection(this.data);
  };

  var bounds = function(){
    this.min = [Infinity, Infinity];
    this.max = [-Infinity, -Infinity];
    this.each(function(geom){
      var min  = geom.min;
      var max  = geom.max;
      minMax(this.min, this.max, min, max);
    });
  };

  var minMax = function(min, max, omin, omax) {
    min[0] = Math.min(min[0], omin[0]);
    min[1] = Math.min(min[1], omin[1]);
    max[0] = Math.max(max[0], omax[0]);
    max[1] = Math.max(max[1], omax[1]);
  };

  var ctor = function(){};
  var inherits = function(child, parent){
    ctor.prototype  = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
  };

  var Geom = function(data){
    this._data = data;
    this._parse();
    this._bounds();
  };
  Geom.prototype._bounds = function(){ bounds.call(this); };
  Geom.prototype.type = "Geometry";
  Geom.prototype.each = function(cb){
    _.each(this._data, _.bind(cb, this));
  };

  Geom.prototype.map = function(cb){
    return _.map(this._data, _.bind(cb, this));
  };

  Geom.prototype._parse = function(){
    this._data = this.map(function(data){ return new this.child(data); });
  };

  Geom.prototype.children = function(){
    return this._data;
  };

  Geom.prototype.project = function(cb){
    this.each(function(it) { it.project(cb); });
  };

  Geom.prototype.asSVG = function(cb){
    return this.map(function(it){ return it.asSVG(cb); }).join(" ");
  };

  Geom.prototype.is = function(type) {
    return type === this.type;
  };

  var toJSON = function(){
    return _.clone(this._raw);
  };

  Geom.prototype.toJSON = toJSON;

  var Point = function(data){
    this._raw  = data;
    this._data = (data.coordinates || data);
    this.max   = data;
    this.min   = data;
  };
  Point.prototype.type = "Point";
  Point.prototype.project = function(cb){
    this._data = cb.call(this, this._data);
    return this;
  };

  Point.prototype.is = function(type) {
    return type === this.type;
  };

  Point.prototype.asSVG = function(cb, prefix){
    prefix = prefix || 'L';
    var data = this._data;
    if(cb) data = cb(_.clone(this._data));
    return prefix + data[0] + ", " + data[1];
  };

  Point.prototype.x = Point.prototype.lat = function() {
    return this._data[0];
  };

  Point.prototype.y = Point.prototype.lng = function() {
    return this._data[1];
  };

  Point.prototype.z = Point.prototype.height = function() {
    return this._data[2];
  };

  var LineString = function(data){
    this._raw = data;
    Geom.call(this, data.coordinates || data);
  };
  inherits(LineString, Geom);
  LineString.prototype.child = Point;
  LineString.prototype.type = "LineString";

  LineString.prototype.asSVG = function(cb){
    return this._data[0].asSVG(cb, ' M') + " " + Geom.prototype.asSVG.call(this, cb);
  };

  var Polygon = function(data){
    this._raw = data;
    Geom.call(this, data.coordinates || data);
  };
  inherits(Polygon, Geom);
  Polygon.prototype.child = LineString;
  Polygon.prototype.type = "Polygon";

  Polygon.prototype.asSVG = function(cb){
    return Geom.prototype.asSVG.call(this, cb) + 'Z';
  };

  var MultiPolygon = function(data){
    this._raw = data;
    Geom.call(this, data.coordinates);
  };
  inherits(MultiPolygon, Geom);
  MultiPolygon.prototype.child = Polygon;
  MultiPolygon.prototype.type = "MultiPolygon";

  var MultiLineString = function(data){
    this._raw = data;
    Geom.call(this, data.coordinates);
  };
  inherits(MultiLineString, Geom);
  MultiLineString.prototype.child = LineString;
  MultiLineString.prototype.type = "MultiLineString";

  var geom = function(data){
    switch(data.type){
      case 'Polygon':
        return new Polygon(data);
      case 'MultiPolygon':
        return new MultiPolygon(data);
      case 'LineString':
        return new LineString(data);
      case 'MultiLineString':
        return new MultiLineString(data);
    }
    throw new Error("Unknown Geometry Type");
  };

  var Feature = function(data){
    this._raw   = data;
    this._props = data.properties;
    this._geom  = geom(data.geometry);
    this._bounds();
  };
  Feature.prototype._bounds = function(){ bounds.call(this); };

  Feature.prototype.each = function(cb){
    cb.call(this, this._geom);
  };

  Feature.prototype.type = "Feature";

  Feature.prototype.is = function(type) {
    return this.type === type;
  };

  Feature.prototype.asSVG = function(cb){
    return this._geom.asSVG(cb);
  };

  Feature.prototype.geom = function(){
    return this._geom;
  };

  Feature.prototype.get = function(prop){
    return this._props[prop];
  };

  Feature.prototype.has = function(values){
    if(!_.isArray(values)) values = [values];

    return _.intersection(_.values(this._props), values).length > 0;
  };
  Feature.prototype.toJSON = toJSON;

  var project = function(point, width, height, min, max){
    var lat = point[1];
    var lon = point[0];

    var scale = width / (max[0] - min[0]);
    // Todo fix fudge
    lat = height - ((lat - min[1]) * scale | 0);
    lon = ((lon - min[0]) * scale | 0);
    var ret = _.clone(point)
    ret[0] = lon;
    ret[1] = lat;
    return ret;
  };

  var FeatureCollection = function(data){
    var features = data.features;
    this._raw = data;
    this._features = _.map(features, function(feature){ return new Feature(feature); });
    this._bounds();
    this._project = project;
  };

  FeatureCollection.prototype.toJSON = toJSON;

  FeatureCollection.prototype._bounds = function(){ bounds.call(this); };

  FeatureCollection.prototype.setBounds = function(bounds){
    this.min = bounds[0];
    this.max = bounds[1];
    return this;
  };

  FeatureCollection.prototype.getBounds = function(){
    return [this.min, this.max];
  };

  FeatureCollection.prototype.each = function(cb){
    _.each(this._features, _.bind(cb, this));
  };

  FeatureCollection.prototype.filter = function(args){
    var ret = {"type": "FeatureCollection", "features": []};

    _.each(this._features, function(feat){
      if(feat.has(args)) ret.features.push(feat.toJSON());
    });

    return new FeatureCollection(ret);
  };

  FeatureCollection.prototype.project = function(project){
    this._project = project;
    
    return this;
  };

  FeatureCollection.prototype.flatten = function(type) {
    var ret = {"type": "FeatureCollection", "features": []};
    var features = this._features;

    var walk = function(ret, feature){
      feature.each(function(feat) {
        if(feat.is(type)) {
          if(feat.toJSON().coordinates)
            ret.features.push({"geometry": feat.toJSON()});
          else
            ret.features.push({"geometry": {"type": feat.type, "coordinates": feat.toJSON() } });
        }
        if(!feat.is("Point")) return walk(ret, feat);
      });
      return ret;
    };

    return new FeatureCollection(walk(ret, this));
  };

  FeatureCollection.prototype.toJSON = toJSON;
  FeatureCollection.prototype.type = "FeatureCollection";
  FeatureCollection.prototype.is = function(type) { return type === this.type; };
  FeatureCollection.prototype.asSVG = function(width, height, cb){
    var min = this.min;
    var max = this.max;
    var that = this;
    cb = _.bind(cb, this);
    this.each(function(it){
      cb(it.asSVG(function(pt) { return that._project(pt, width, height, min, max); }), it);
    });
  };

  FeatureCollection.prototype.project = function(proj){
    this._project = proj;
  };
}).call(this);
