// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
function long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }
function tile2long(x,z) { return (x/Math.pow(2,z)*360-180); }
function tile2lat(y,z) { var n=Math.PI-2*Math.PI*y/Math.pow(2,z); return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));}

// derived functions
function long2tileXPos(lon,zoom, x) { return ((lon+180)/360*Math.pow(2,zoom) - x); }
function lat2tileYPos(lat,zoom, y) { return (((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)) - y ); }
//function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }


// https://wiki.openstreetmap.org/wiki/Zoom_levels
function lngWidth(z) {return 360 / Math.pow(2,z)}

function tileBoundsLatLng(x, y, z) {
  const lat = tile2lat(y,z)
  const lng = tile2long(x,z)
  const height = lat - tile2lat(y+1,z)
  const width = lngWidth(z)
  return {
    lat: {
      min: lat - height,
      max: lat,
      height
    },
    lng: {
      min: lng,
      max: lng + width,
      width 
    }
  }
}

geo = {
  long2tile,
  lat2tile,
  tile2long,
  tile2lat,
  lngWidth,
  tileBoundsLatLng,
  long2tileXPos,
  lat2tileYPos
}

module.exports = geo
