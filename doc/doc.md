<%
  def highlight(lang, code)
    IO.popen("pygmentize -O encoding=utf8 -f html -l #{lang}", 'w+') do |p|
      p.puts code
      p.close_write
      p.read
    end
  end
%>

## Dependencies

Mapper itself only relies on Underscore.js. MapperCanvas relies on jQuery, Underscore and Raphael.js.

### Mapper

Use Mapper to create SVG maps from raw GeoJSON.

<%= highlight 'javascript', <<-CODE
// Initialize a new map with your JSON
var jsMap = new Mapper(json).all();

// Create a paper. Usually we use Raphael for this
var paper = Raphael(el, height, width);

// Pass Mapper a height and width
// and iterate over the SVG output
jsMap.asSVG(height, width, function(svg, data) {
  // Pass the svg string to the paper
  var path = paper.path(svg);

  // Set attributes on the path, using Raphael
  path.attr("fill", "#cecece");

  // Access attributes in your data
  // and use them to style your map
  var fips = it.get("s");
  if (fips === "22") {
    path.attr("fill", "green");
  }
});
CODE
%>

### MapperCanvas

MapperCanvas takes care of Mapper's boilerplate to generate maps of U.S. states and counties. To use it, include the packaged <a href="https://github.com/propublica/mapper/blob/master/public/javascripts/states/states_packaged.js">states</a> or <a href="https://github.com/propublica/mapper/blob/master/public/javascripts/counties/counties_packaged.js">counties</a> JavaScript file, then initialize and draw your map:

<%= highlight 'javascript', <<-CODE
// Pass in a container element and a "states" or "counties" locality
var stateMap = new MapperCanvas(el, "states");

// Draw the map
map.createMap();
CODE
%>

### MapperCanvas methods

<tt>MapperCanvas.prototype.on</tt> binds events to the map. It takes event, path and data attributes, which can be used to alter paths when the event fires, or trigger things like tooltips. <tt>MapperCanvas.prototype.on</tt> supports <a href="http://raphaeljs.com/reference.html">any events Raphael does</a>.

<%= highlight 'javascript', <<-CODE
map.on('click', function(e, path, data) {
    console.log(data.get('name'));
});
CODE
%>

<tt>MapperCanvas.prototype.style</tt> allows styling specific paths, targeting them by FIPS code. For state maps, this method takes a 2-digit FIPS. For county maps, it requires a 5-digit FIPS.

<%= highlight 'javascript', <<-CODE
map.style("36047", "fill", "#FFEFD5");
CODE
%>

### Full Example

<div id="full_example"></div>
The demo above is [Median Income in the Past 12 Months (In 2012 Inflation-adjusted Dollars) by Place of Birth in the United States](http://censusreporter.org/data/map/?table=B06011&geo_ids=040|01000US) from the American Community Survey. Here's how to make that map:

<%= highlight 'html', <<-CODE
<!doctype html>
<html>
  <style>
    #mappercanvas_container {
      position:relative;
      height:570px;
      margin-top:60px;
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
    #mappercanvas_tooltip h2 {
      margin:0;
      padding:0;
      font-size:14px;
    }
    .tooltip_sub {
      font-size:12px;
      font-weight:normal;
      display:inline-block;
      line-height:14px;
    }
    /* these elements are created by MapperCanvas */
    /* But you need to bring your own CSS */
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

  <!-- Load the states package -->
  <script src="public/javascripts/states/states_packaged.js"></script>

  <!-- Load Mapper and MapperCanvas -->
  <script src="public/javascripts/mapper.js"></script>
  <script src="public/javascripts/mapper_canvas.js"></script>
  
  <!-- Create a tooltip container -->
  <script type="text/jst" id="mappercanvas_tooltip_tmpl">
    <h2>{{= n }}</h2>
    <span class="tooltip_sub">
      Median income<br>
      ${{= med_income }}
      <span class='tooltip_moe'><br>± ${{= moe }}</span>
    </span>
  </script>

  <!-- Census median income data, via http://censusreporter.org/data/map/?table=B06011&geo_ids=040|01000US -->
  <script>
    var census = {"01":["Alabama",21830,266],"02":["Alaska",29932,1140],"04":["Arizona",25307,247],"05":["Arkansas",21529,201],"06":["California",25971,104],"08":["Colorado",29237,430],"09":["Connecticut",31920,247],"10":["Delaware",28405,921],"11":["District of Columbia",38014,1708],"12":["Florida",23387,172],"13":["Georgia",24682,253],"15":["Hawaii",29786,621],"16":["Idaho",22166,317],"17":["Illinois",27301,120],"18":["Indiana",24801,269],"19":["Iowa",26717,254],"20":["Kansas",26299,284],"21":["Kentucky",21871,186],"22":["Louisiana",22416,215],"23":["Maine",24367,496],"24":["Maryland",34564,457],"25":["Massachusetts",31016,231],"26":["Michigan",23938,206],"27":["Minnesota",30094,193],"28":["Mississippi",20206,292],"29":["Missouri",23933,251],"30":["Montana",23536,553],"31":["Nebraska",26450,308],"32":["Nevada",26328,314],"33":["New Hampshire",30651,420],"34":["New Jersey",32158,208],"35":["New Mexico",22775,364],"36":["New York",28449,247],"37":["North Carolina",23946,258],"38":["North Dakota",29326,721],"39":["Ohio",24778,170],"40":["Oklahoma",23460,298],"41":["Oregon",24445,303],"42":["Pennsylvania",25874,144],"44":["Rhode Island",26840,524],"45":["South Carolina",22451,260],"46":["South Dakota",25866,439],"47":["Tennessee",22570,265],"48":["Texas",25227,122],"49":["Utah",25043,402],"50":["Vermont",26323,492],"51":["Virginia",30322,193],"53":["Washington",29109,337],"54":["West Virginia",21494,268],"55":["Wisconsin",26668,179],"56":["Wyoming",26778,725]};
  </script>

  <body>
    <div id="mappercanvas_container"></div>
    <script>
      $(function() {
        // Initialize the map
        var map = new MapperCanvas("#mappercanvas_container", "states");
        
        // Set up the tooltip template
        var tmpl = _.template($("#mappercanvas_tooltip_tmpl").html());

        // Add tooltips, and cache the existing style
        // to put it back in place on mouseout
        map.on('mouseover', function(e, path, data) {
          data.existingStyle = (data.existingStyle || {});
          data.existingStyle["fill"]        = path.attr("fill");
          data.existingStyle["strokeWidth"] = path.attr("stroke-width");
          path.attr("fill", "#999").attr("stroke-width", 1);
          $("#mappercanvas_tooltip").html(tmpl({
            n          : data.get('n'), 
            med_income : commaDelimit(census[data.fips][1]), 
            moe        : census[data.fips][2]
          })).css("left", e.pageX + 20).css("top", e.pageY + 20).show();
        });

        map.on('mouseout', function(e, path, data) {
          $("#mappercanvas_tooltip").hide();
          _(data.existingStyle).each(function(v, k) {
            path.attr(k, v);
          });
        });

        // Census data convenience functions
        var incomeColor = function(income) {
          if (income < 23768) return "rgb(217, 236, 232)";
          if (income < 27329) return "rgb(161, 207, 198)";
          if (income < 30891) return "rgb(104, 179, 163)";
          if (income < 34452) return "rgb(66, 132, 118)";
          return "rgb(38, 75, 68)";
        };

        var commaDelimit = function(a){
          return _.isNumber(a) ? a.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,") : "";
        };

        // Color states by income level
        _(census).each(function(ary, fips) {
          map.style(fips, "fill", incomeColor(ary[1]));
        })

        // Draw the map
        map.createMap();
      });
    </script>

    <div id="mappercanvas_tooltip"></div>
  </body>
</html>
CODE
%>

## License

Copyright (c) 2014, ProPublica

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
