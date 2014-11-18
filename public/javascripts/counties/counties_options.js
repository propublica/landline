var options = {
  defaultStyle : {
    "fill" : "#cecece",
    "stroke-width" : 0.5,
    "stroke" : "#ffffff",
    "stroke-linejoin" : "bevel"
  },
  containers : {
    "contiguous" : {el : "landline_contiguous"},
    "alaska"      : {el : "landline_alaska"},
    "hawaii"      : {el : "landline_hawaii"},
    "dc"          : {el : "landline_dc"}
  },
  main : {
    heightMultiplier : 0.7
  },
  extensions : {
    "contiguous" : {
      widthMultiplier  : 1,
      heightMultiplier : 0.85,
      top    : "0%",
      left   : 0.0
    },
    "alaska" : {
      widthMultiplier  : 0.25,
      heightMultiplier : 0.27,
      top    : "63%",
      left   : 0.0
    },
    "hawaii" : {
      widthMultiplier  : 0.15,
      heightMultiplier : 0.21,
      top    : "70%",
      left   : 0.25
    },
    "dc" : {
      widthMultiplier  : 0.02,
      heightMultiplier : 0.08,
      top    : "34.5%",
      left   : 0.915
    }
  }
}