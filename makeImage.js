var geo = require('./geo')

// bsondump --outFile letters.json /Users/holger/Documents/Projekte/nuit/db-backup/mareedeslettres_1510582958414/heroku_gwk6dq29/letters_archive.bson
const allLetters = require('./letters.json')

console.log("read " + allLetters.length + " letters")

let totalImagesCounter = 0
imageWidth = 256
imageHeight = 256

function makeImage(lat, lng, z) {
  const { createCanvas, loadImage } = require('canvas')
  const canvas = createCanvas(imageWidth, imageHeight)
  const ctx = canvas.getContext('2d')

/*
  // Write "Awesome!"
  ctx.font = '30px Impact'
  ctx.rotate(0.1)
  ctx.fillText('Awesome!', 50, 100)

  // Draw line under text
  var text = ctx.measureText('Awesome!')
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'
  ctx.beginPath()
  ctx.lineTo(50, 102)
  ctx.lineTo(50 + text.width, 102)
  ctx.stroke()
*/

  // get letters
  const bounds = geo.tileBoundsLatLng(lat, lng, z)
  const letters = findLetters(bounds)  

  // put letters on image
  const fontSize = 0.02/bounds.lat.height
  ctx.font = fontSize + 'px Impact'
  ctx.fillStyle = "#ff00ff";
  for (l of letters) {
    const x = ( ( l.coords.lng - bounds.lng.min ) / bounds.lng.width ) * imageWidth
    const y = imageHeight - ( ( l.coords.lat - bounds.lat.min ) / bounds.lat.height ) * imageHeight
    ctx.fillText(l.character, x, y)
  }

  console.log(`font size: ${fontSize}`)
  // console.log('<img src="' + canvas.toDataURL() + '" />')

  totalImagesCounter++
  // console.log(totalImagesCounter + " images made")

  return canvas.toBuffer()

}

function findLetters(bounds) {
  const letters = allLetters.filter( l => 
      l.coords.lng >= bounds.lng.min &&
      l.coords.lng <= bounds.lng.max &&
      l.coords.lat >= bounds.lat.min &&
      l.coords.lat <= bounds.lat.max
    )
    //console.log(letters)
    //console.log(`letters between lat: [${lat}, ${minLat}], lng: [${lng}, ${maxLng}]`)    
   console.log(`${letters.length} letters between lat: [${bounds.lat.min}, ${bounds.lat.max}], lng: [${bounds.lng.min}, ${bounds.lng.max}]`)
  // console.log(letters)
  return letters
}

module.exports = makeImage