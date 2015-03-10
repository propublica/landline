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

Landline itself only relies on Underscore.js. Stateline relies on jQuery, Underscore and Raphael.js. NB: If you'd like to support Internet Explorer < 9, use jQuery 1.x.

### Landline

Use Landline to create SVG maps from raw GeoJSON.

<%= highlight 'javascript', <<-CODE
// Initialize a new map with your JSON
var map = new Landline(json).all();

// Create a paper. Usually we use Raphael for this
var paper = Raphael(el, height, width);

// Pass Landline a height and width
// and iterate over the SVG output
map.asSVG(height, width, function(svg, data) {
  // Pass the svg string to the paper
  var path = paper.path(svg);

  // Set attributes on the path, using Raphael
  path.attr("fill", "#cecece");

  // Access attributes in your data
  // and use them to style your map
  var fips = data.get("s");
  // Color Louisiana green
  if (fips === "22") {
    path.attr("fill", "green");
  }
});
CODE
%>

### Stateline

Stateline uses Landline to generate responsive maps of U.S. states and counties. To use Stateline, include the packaged <a href="https://github.com/propublica/landline/blob/master/public/javascripts/states/states_packaged.js">states</a> or <a href="https://github.com/propublica/landline/blob/master/public/javascripts/counties/counties_packaged.js">counties</a> JavaScript file, as well as the <a href="https://github.com/propublica/landline/blob/master/public/javascripts/states/states_options.js">states</a> or <a href="https://github.com/propublica/landline/blob/master/public/javascripts/counties/counties_options.js">counties</a> options files. Then initialize and draw your map with the following code:

<%= highlight 'javascript', <<-CODE
// Pass in a container element and a "states" or "counties" locality
var stateMap = new Landline.Stateline(el, "states", options);

// Draw the map
stateMap.createMap();
CODE
%>

The only CSS Stateline requires is a width on the container element.
For example, the map above has the following styles:
<%= highlight 'css', <<-CODE
  #landline_container {
    width:95%
    max-width:600px;
  }
CODE
%>

### Stateline methods

<tt>Stateline.prototype.on</tt> binds events to the map. It takes event, path and data attributes, which can be used to alter paths when the event fires, or trigger things like tooltips. <tt>Stateline.prototype.on</tt> supports <a href="http://raphaeljs.com/reference.html">any events Raphael does</a>.

<%= highlight 'javascript', <<-CODE
map.on('click', function(e, path, data) {
    console.log(data.get('name'));
});
CODE
%>

<tt>Stateline.prototype.style</tt> allows styling specific paths, targeting them by [FIPS code](http://en.wikipedia.org/wiki/Federal_Information_Processing_Standards). For state maps, this method takes a 2-digit FIPS. For county maps, it requires a 5-digit FIPS.

<%= highlight 'javascript', <<-CODE
map.style("36047", "fill", "#FFEFD5");
CODE
%>

### Full Example

<div id="full_example"></div>
The demo above is [median income by state](http://censusreporter.org/data/map/?table=B06011&geo_ids=040|01000US) from the American Community Survey. See a <a href="demo-state.html">standalone demo</a>. The code to make that map is below:

<%= highlight 'html', <<-CODE
<!doctype html>
<html>
  <head>
    <style>
      #landline_container {
        width:95%;
        max-width:600px;
      }
      #landline_tooltip {
        position:absolute;
        background:rgba(222, 222, 222, 0.95);
        z-index:999999;
        font-family: Helvetica, Arial, sans-serif;
        font-weight:bold;
        font-size:12px;
        padding:5px;
        border-radius:2px;
        box-shadow:0 0 5px #444;
        display:none;
      }
      #landline_tooltip h2 {
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
    </style>
    <!-- Bring your own copy of jQuery/Underscore/Raphael here -->
    <!-- To support IE < 9, include jQuery 1.x -->

    <!-- Load the states package and options -->
    <script src="public/javascripts/states/states_packaged.js"></script>
    <script src="public/javascripts/states/states_options.js"></script>

    <!-- Load Landline and Stateline -->
    <script src="public/javascripts/landline.js"></script>
    <script src="public/javascripts/landline.stateline.js"></script>
    
    <!-- Create a tooltip container -->
    <script type="text/jst" id="landline_tooltip_tmpl">
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
  </head>
  <body>
    <div id="landline_container"></div>
    <script>
      $(function() {
        // Initialize the map
        var map = new Landline.Stateline("#landline_container", "states", options);
        
        // Set up the tooltip template
        var tmpl = _.template($("#landline_tooltip_tmpl").html());

        // Add tooltips, and cache the existing style
        // to put it back in place on mouseout
        map.on('mouseover', function(e, path, data) {
          data.existingStyle = (data.existingStyle || {});
          data.existingStyle["fill"]        = path.attr("fill");
          data.existingStyle["strokeWidth"] = path.attr("stroke-width");
          path.attr("fill", "#999").attr("stroke-width", 1);
        });

        map.on('mousemove', function(e, path, data) {
          $("#landline_tooltip").html(tmpl({
              n          : data.get('n'), 
              med_income : commaDelimit(census[data.fips][1]), 
              moe        : census[data.fips][2]
            })).css("left", e.pageX + 20).css("top", e.pageY + 20).show();
        });

        map.on('mouseout', function(e, path, data) {
          $("#landline_tooltip").hide();
          _(data.existingStyle).each(function(v, k) {
            path.attr(k, v);
          });
        });

        // Census data convenience functions
        var incomeColor = function(income) {
          if (income < 23768) return "rgb(237,248,233)";
          if (income < 27329) return "rgb(186,228,179)";
          if (income < 30891) return "rgb(116,196,118)";
          if (income < 34452) return "rgb(49,163,84)";
          return "rgb(0,109,44)";
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

    <div id="landline_tooltip"></div>
  </body>
</html>
CODE
%>

## Custom Maps

Stateline can currently create custom county maps for specific states, or any other collection of counties, such as New York City boroughs. To create a custom map, create your own package file (so the map only draws the counties you need) and options file (in case you want to adjust any settings).

To create your own package file, begin with the template below. Here is an example <a href="https://github.com/propublica/landline/blob/master/public/javascripts/nyc/boroughs_packaged.js">NYC boroughs</a> package file.

<%= highlight 'javascript', <<-CODE
(function() {
  window.StatelineCounties = {};
  window.StatelineCounties.contiguous = {"type":"FeatureCollection","features":[
    // Each object represents one county, create as many as you need
    {"type":"Feature","geometry":{
        // Polygon or MultiPolygon
        "type":"MultiPolygon",
        "coordinates": [YOUR COORDINATES HERE]
      },
      "properties":{
        "s":"36", // state fips
        "c":"085", // county fips
        "n":"Staten Island" // county name, which will be displayed on the map
        "countyName":"Richmond", // add additional properties as desired
        "gid":null,
        "BoroCode":5,
      }
    },
    {"type":"Feature","geometry":{
        "type":"MultiPolygon",
        "coordinates": [YOUR COORDINATES HERE]
      },
      "properties":{
        "s":"36",
        "c":"061",
        "n":"Manhattan",
        "countyName":"New York",
        "gid":null,
        "BoroCode":1
      }
    }
  ]}
})(window);
CODE
%>

To create your own options file, begin with the template below. Here is an example <a href="https://github.com/propublica/landline/blob/master/public/javascripts/nyc/boroughs_options.js">NYC boroughs</a> options file.

<%= highlight 'javascript', <<-CODE
var options = {
  defaultStyle : {
    "fill" : "#cecece",
    "stroke-width" : 0.5,
    "stroke" : "#ffffff",
    "stroke-linejoin" : "bevel"
  },
  containers : {
    "contiguous" : {el : "landline_contiguous"}
  },
  main : {
    heightMultiplier : 1
  },
  extensions : {
    "contiguous" : {
      widthMultiplier : 1,
      heightMultiplier : 1,
      top    : "0%",
      left   : 0.0
    }
  }
}
CODE
%>

View our <a href="demo-nyc.html">NYC Borough Map demo</a>.

## Changelog

### 0.1.1

* Multiple maps per page.

### 0.1.0

* Easier creation of custom maps by county.
* Extracted options into a separate file so users can change map width, height and custom containers without changing the source code.
* Default map styling also extracted out to options.

### 0.0.0

* Initial Release

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

_Landline is a project of ProPublica._
