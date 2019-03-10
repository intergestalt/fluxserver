var tilestrata = require('tilestrata');
var express = require('express');
var bodyParser = require('body-parser');
// var disk = require('tilestrata-disk');
// var mapnik = require('tilestrata-mapnik');
// var gm = require('tilestrata-gm');
var strata = tilestrata();
// var fs = require('fs');

var geo = require('./geo')
var { addLetter } = require('./database')
var makeImage = require('./makeImage');

var host = "localhost"

// http://localhost:8080/basemap/6/0/0/map.png

provider = function(options) {
  return {
      name: 'myplugin',
      init: function(server, callback) {
          console.log("init")
          var err = null
          callback(err);
      },
      serve: function(server, tile, callback) {
          const { x,y,z } = tile

          console.log("serve", x,y,z)

          //var outputBuffer = fs.readFileSync(__dirname + '/fixtures/blank.png');
          var outputBuffer = makeImage(x, y, z)

          var err = null
          var buffer = outputBuffer
          var headers = {'Content-Type': 'image/png'}

          callback(err, buffer, headers);
      },
      destroy: function(server, callback) {
          console.log("destroy")
          callback(err);
      }
  };
};

// define layers
strata.layer('basemap')
    .route('map.png')
        /*.use(disk.cache({dir: './cache'}))*/
        /*.use(mapnik({
            pathname: '../../population.xml',
            tileSize: 512,
            scale: 2
        }))*/
        .use(provider())


// set the port of our application
var app = express();

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

// make express look in the public directory for assets (css/js/img)
app.use('/', express.static(__dirname + '/public'));

// json
app.use(bodyParser.json());

// receive letter
app.post('/letter', (req, res) => {
    const obj = req.body               // your JSON
    console.log("received", obj);      

    addLetter(obj.letter, obj.lat, obj.lng)

    res.send(obj);                     // echo the result back
})

// tile server
app.use(tilestrata.middleware({
    server: strata,
    prefix: ''
}));

app.listen(port, function() {
    console.log('Our app is running on http://' + host + ':' + port);
});
