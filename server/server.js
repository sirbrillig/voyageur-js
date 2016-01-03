var express = require( 'express' );
var cors = require( 'cors' );
var app = express();
var jwt = require( 'express-jwt' );
var dotenv = require( 'dotenv' );
var bodyParser = require( 'body-parser' );
var mongoose = require( 'mongoose' );

var Location = require( './app/models/location' );

dotenv.load();

mongoose.connect( process.env.MONGO_CLIENT_SERVER );

var authenticate = jwt( {
  secret: new Buffer( process.env.AUTH0_CLIENT_SECRET, 'base64' ),
  audience: process.env.AUTH0_CLIENT_ID
} );

app.use( cors() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( '/secured', authenticate );

var router = express.Router();

router.get( '/ping', function( req, res ) {
  res.status( 200 ).json( { text: "All good. You don't need to be authenticated to call this" } );
} );

router.get( '/secured/ping', function( req, res ) {
  res.status( 200 ).json( { text: "All good. You only get this message if you're authenticated" } );
} );

router.route( '/locations' )
.get( function( req, res ) {
  Location.find( function( err, locations ) {
    if ( err ) return res.status( 502 ).send( err );
    res.status( 200 ).json( locations );
  } );
} )
.post( function( req, res ) {
  var location = new Location();
  location.name = req.body.name;
  location.address = req.body.address;
  location.save( function( err ) {
    if ( err ) return res.status( 502 ).send( err );
    res.status( 200 ).json( location );
  } );
} );

router.route( '/locations/:location_id' )
.get( function( req, res ) {
  Location.findById( req.params.location_id, function( err, location ) {
    if ( err ) return res.status( 502 ).send( err );
    res.status( 200 ).json( location );
  } );
} )
.put( function( req, res ) {
  Location.findById( req.params.location_id, function( err, location ) {
    if ( err ) return res.status( 502 ).send( err );
    location.name = req.body.name;
    location.address = req.body.address;
    location.save( function( saveErr ) {
      if ( err ) return res.status( 502 ).send( saveErr );
      res.status( 200 ).json( location );
    } );
  } )
} )
.delete( function( req, res ) {
  Location.remove( {
    _id: req.params.location_id
  }, function( err, location ) {
    if ( err ) return res.status( 502 ).send( err );
    res.status( 200 ).json( location );
  } );
} );

app.use( '/', router );

var port = process.env.PORT || 3001;

app.listen( port, function() {
  console.log( 'listening in http://localhost:' + port );
} );
