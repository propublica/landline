# Mapper

Mapper is a JavaScript library that creates simple SVG US maps (at state or county level) compatible with **all browsers**.

### [Demo](#)

## Libraries

Mapper includes:

- [states_packaged.js]() (geoJSON for US states)
- [counties_packaged.js]() (geoJSON for US counties)
- [mapper.js]() (Mapper library)

and depends on:

- [jQuery.js]()
- [underscore.js]()
- [raphael.js]()

## How to Use

### Base Layer

1. Require each of the libraries listed above.
2. Style your `#mappercanvas_conainer` element with CSS. This will be the container for the map.
3. Add the `div` element with `id="mappercanvas_container"` to your HTML.
4. Include a `<script>` tag, before the close of your `</body>` to create a new MapperCanvas.

### ```new MapperCanvas(divID, locality)```

- **divID** is the name given to your containing element
- **locality** is either `counties` or `state` depending on what grainulairty suits your data.

### Adding Your Data

### Changing Colors

Basic Example:

```html
<!doctype html>
<html>
  <style>
    #mappercanvas_container {
      position:relative;
      height:570px;
      margin-top:272px;
    }
  </style>
  <body>
    <div id="mappercanvas_container"></div>
  <script>
    $(function() {
      new MapperCanvas("#mappercanvas_container", "counties");
    });
  </script>
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
