# Mapper

Mapper is a JavaScript library that creates simple SVG maps compatible with **all browsers**.

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

```HTML
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
