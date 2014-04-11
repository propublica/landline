# Mapper

Mapper is a JavaScript library that creates simple SVG maps from GeoJSON. It comes with MapperCanvas, which will create US state and county maps with prepackaged GeoJSON.

## Dependencies

Mapper itself only relies on underscore.js. MapperCanvas relies on jQuery, Underscore and Raphael.js.

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

          // add tooltips
          map.on('mouseover', function(e, path, data) {
            path.attr("fill", "#999").attr("stroke-width", 1);
            $("#mappercanvas_tooltip").html(tmpl({n : data.get('n')})).css("left", e.pageX + 20).css("top", e.pageY + 20).show();
          });

          map.on('mouseout', function(e, path, data) {
            $("#mappercanvas_tooltip").hide();
            path.attr("fill", "#cecece").attr("stroke-width", 0.5);
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
