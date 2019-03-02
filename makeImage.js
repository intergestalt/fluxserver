const { createCanvas, registerFont } = require('canvas')

var geo = require('./geo')

// bsondump --outFile letters.json /Users/holger/Documents/Projekte/nuit/db-backup/mareedeslettres_1510582958414/heroku_gwk6dq29/letters_archive.bson
const allLetters = require('./letters.json')

console.log("read " + allLetters.length + " letters")

let totalImagesCounter = 0
let totalLettersCounter = 0

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
  const fontSize = 0.02/bounds.lat.height
  ctx.font = fontSize + 'px Impact'
  ctx.fillStyle = "#ff00ff";
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

function findLetters(bounds) {
  const letters = allLetters.filter( l => 
      l.coords.lng >= bounds.lng.min - canvasExtensionFactor * bounds.lng.width &&
      l.coords.lng <= bounds.lng.max + canvasExtensionFactor * bounds.lng.width &&
      l.coords.lat >= bounds.lat.min - canvasExtensionFactor * bounds.lat.height &&
      l.coords.lat <= bounds.lat.max + canvasExtensionFactor * bounds.lat.height
    )
    //console.log(letters)
    //console.log(`letters between lat: [${lat}, ${minLat}], lng: [${lng}, ${maxLng}]`)    
    totalLettersCounter += letters.length
    //console.log(totalLettersCounter + " letters queried")
   console.log(`${letters.length} letters between lat: [${bounds.lat.min}, ${bounds.lat.max}], lng: [${bounds.lng.min}, ${bounds.lng.max}]`)
  // console.log(letters)
  return letters
}

module.exports = makeImage