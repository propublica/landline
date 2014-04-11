## Dependencies

Mapper itself only relies on underscore.js. MapperCanvas relies on jQuery, Underscore and Raphael.js.

### Mapper

Use Mapper to create SVG maps from raw GeoJSON.

```html
// Initialize a new map with your JSON
var jsMap = new Mapper(json).all();

// Create a paper. Usually we use Raphael for this
var paper = Raphael(el, height, width);

// Pass Mapper a height and width, 
// and iterate over the SVG output
jsMap.asSVG(height, width, function(svg, data) {
  // Pass the svg string to the paper
  var path = paper.path(svg);

  // Set attributes on the path, using Raphael.
  path.attr("fill", "#cecece");

  // Access attributes in your data,
  // and use them to style your map
  var fips = it.get("s");
  if (fips === "22") {
    path.attr("fill", "green");
  }
});

```

### MapperCanvas

MapperCanvas takes care of Mapper's boilerplate to generate maps of US states and counties. To use it, first make sure you're including either the included <a href="https://github.com/propublica/mapper/blob/master/public/javascripts/states/states_packaged.js">states</a> or <a href="https://github.com/propublica/mapper/blob/master/public/javascripts/counties/counties_packaged.js">counties</a> JavaScript file. Then, initialize and draw your map:

```html
// Pass in a container element, and either a "states" or "counties" locality.
var stateMap = new MapperCanvas(el, "states");

// Draw the map
map.createMap();

```

### MapperCanvas methods

<tt>MapperCanvas.prototype.on</tt> binds events to the map. It takes event, path and data attributes, which can be used to alter specific paths when the event fires. <tt>MapperCanvas.prototype.on</tt> supports any events Raphael does.

<tt>MapperCanvas.prototype.style</tt> allows styling by FIPS code. For state maps, this method takes a 2-digit FIPS. For county maps, it requires a 5-digit FIPS.

### Full Example

To create the map shown above:

```html
<!doctype html>
<html>
  <style>
    #mappercanvas_container {
      position:relative;
      height:570px;
      margin-top:272px;
    }

    #mappercanvas_tooltip {
      position:absolute;
      background:rgba(222, 222, 222, 0.95);
      z-index:999999;
      font-family: Helvetica, Arial, sans-serif;
      font-weight:bold;
      font-size:12px;
      padding:5px;
      border-radius:2px;
      box-shadow:0 0 5px #444;
    }

    /* these elements are created by MapperCanvas */
    /* But you still need to position Alaska and Hawaii */
    #mappercanvas_continental {
      position:absolute;
      top:10px;
      width: 900px;
    }
    #mappercanvas_alaska {
      position:absolute;
      top: 400px;
      left: -40px;
    }
    #mappercanvas_hawaii {
      position:absolute;
      top:460px;
      left:220px;
    }
  </style>
  <!-- Bring your own copy of jQuery/Underscore/Raphael here -->

  <!-- load the states package -->
  <script src="public/javascripts/states/states_packaged.js"></script>

  <!-- load Mapper and MapperCanvas -->
  <script src="public/javascripts/mapper.js"></script>
  <script src="public/javascripts/mapper_canvas.js"></script>
  
  <!-- create a tooltip container -->
  <script type="text/jst" id="mappercanvas_tooltip_tmpl">
    <h2><%%= n %></h2>
  </script>

  <body>
    <div id="mappercanvas_container"></div>
    <script>
      $(function() {
        // Initialize the map
        var map = new MapperCanvas("#mappercanvas_container", "states");
        
        // Set up the tooltip template
        var tmpl = _.template($("#mappercanvas_tooltip_tmpl").html());

        // add tooltips, making sure to cache the existing style
        // to put it back on mouseout
        map.on('mouseover', function(e, path, data) {
          data.existingStyle = (data.existingStyle || {});
          data.existingStyle["fill"]        = path.attr("fill");
          data.existingStyle["strokeWidth"] = path.attr("stroke-width");
          path.attr("fill", "#999").attr("stroke-width", 1);
          $("#mappercanvas_tooltip").html(tmpl({n : data.get('n')})).css("left", e.pageX + 20).css("top", e.pageY + 20).show();
        });

        map.on('mouseout', function(e, path, data) {
          $("#mappercanvas_tooltip").hide();
          _(data.existingStyle).each(function(v, k) {
            path.attr(k, v);
          });
        });

        // Add map styles
        map.style("36", "fill", "#000000");
        map.style("22", "fill", "green");

        // Draw the map
        map.createMap();
      });
    </script>

    <div id="mappercanvas_tooltip"></div>
  </body>
</html>
```

## License

Copyright (c) 2012, ProPublica

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.

_Mapper is a project of ProPublica._
