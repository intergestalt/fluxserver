const { createCanvas, registerFont } = require('canvas')

var geo = require('./geo')
var { findLetters } = require('./database')

let totalImagesCounter = 0

// TODO make canvasExtensionFactor dependent on zoom factor and letter size
canvasExtensionFactor = 1 // extend canvas and queries to see characters at the edge


imageWidth = 256
imageHeight = 256

registerFont('impact.ttf', { family: 'Impact' })

function makeImage(x, y, z) {
  // setup canvas
  const canvas = createCanvas(imageWidth, imageHeight)
  const ctx = canvas.getContext('2d')

  // get letters
  const bounds = geo.tileBoundsLatLng(x, y, z)
  const letters = findLetters(bounds)  

  // put letters on image
  const fontSize = 0.023/bounds.lat.height
  ctx.font = fontSize + 'px Impact'
  ctx.fillStyle = "rgba(0,0,0,0.8)";
  for (l of letters) {
    // simple projection: ( ( l.coords.lng - bounds.lng.min ) / bounds.lng.width ) * imageWidth
    const xPos = geo.long2tileXPos(l.coords.lng, z, x) * imageWidth
    // simple projection: imageHeight - ( ( l.coords.lat - bounds.lat.min ) / bounds.lat.height ) * imageHeight
    const yPos = geo.lat2tileYPos(l.coords.lat, z, y) * imageHeight
    ctx.fillText(l.character, xPos, yPos)
  }

  console.log(`font size: ${fontSize}`)
  // console.log('<img src="' + canvas.toDataURL() + '" />')

  totalImagesCounter++
  // console.log(totalImagesCounter + " images made")

  return canvas.toBuffer()

}



module.exports = makeImage