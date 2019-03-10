// bsondump --outFile letters.json /Users/holger/Documents/Projekte/nuit/db-backup/mareedeslettres_1510582958414/heroku_gwk6dq29/letters_archive.bson
const allLetters = require('./letters.json')

console.log("read " + allLetters.length + " letters")

let totalLettersCounter = 0

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

function addLetter(character, lat, lng) {
  allLetters.push({
    "coords":
      {lat, lng},
    character,
  })
}

module.exports = {
  findLetters,
  addLetter
}