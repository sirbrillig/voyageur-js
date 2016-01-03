var express = require( 'express' );
var cors = require( 'cors' );
var app = express();
var jwt = require( 'express-jwt' );
var dotenv = require( 'dotenv' );
var bodyParser = require( 'body-parser' );
var mongoose = require( 'mongoose' );
var morgan = require( 'morgan' );

var Location = require( './app/models/location' );

dotenv.load();

mongoose.connect( process.env.MONGO_CLIENT_SERVER );

var authenticate = jwt( {
  secret: new Buffer( process.env.AUTH0_CLIENT_SECRET, 'base64' ),
  audience: process.env.AUTH0_CLIENT_ID
} );

app.use( cors() );
app.use( morgan( 'dev' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( '/secured', authenticate );

var router = express.Router();

function getUserIdFromRequest( req ) {
  return req.user.sub;
}

router.get( '/ping', function( req, res ) {
  res.status( 200 ).json( { text: "All good. You don't need to be authenticated to call this" } );
} );

router.get( '/secured/ping', function( req, res ) {
  res.status( 200 ).json( { text: "All good. You only get this message if you're authenticated" } );
} );

router.route( '/secured/locations' )
.get( function( req, res ) {
  var userId = getUserIdFromRequest( req );
  Location.find( { userId: userId } )
  .then( function( locations ) {
    res.status( 200 ).json( locations );
  } )
  .then( null, function( err ) {
    res.status( 502 ).send( err );
  } );
} )
.post( function( req, res ) {
  var userId = getUserIdFromRequest( req );
  var location = new Location();
  location.userId = userId;
  location.name = req.body.name;
  location.address = req.body.address;
  location.save( function( err ) {
    if ( err ) return res.status( 502 ).send( err );
    res.status( 200 ).json( location );
  } );
} );

router.route( '/secured/locations/:location_id' )
.get( function( req, res ) {
  var userId = getUserIdFromRequest( req );
  Location.findOne( { _id: req.params.location_id, userId: userId } )
  .then( function( location ) {
    res.status( 200 ).json( location );
  } )
  .then( null, function( err ) {
    res.status( 502 ).send( err );
  } );
} )
.put( function( req, res ) {
  var userId = getUserIdFromRequest( req );
  Location.findOne( { _id: req.params.location_id, userId: userId } )
  .then( function( location ) {
    location.name = req.body.name;
    location.address = req.body.address;
    location.save( function( saveErr ) {
      if ( saveErr ) return res.status( 502 ).send( saveErr );
      res.status( 200 ).json( location );
    } );
  } )
  .then( null, function( err ) {
    res.status( 502 ).send( err );
  } );
} )
.delete( function( req, res ) {
  var userId = getUserIdFromRequest( req );
  Location.remove( { _id: req.params.location_id, userId: userId } )
  .then( function( location ) {
    res.status( 200 ).json( location );
  } )
  .then( null, function( err ) {
    res.status( 502 ).send( err );
  } );
} );

app.use( '/', router );

var port = process.env.PORT || 3001;

app.listen( port, function() {
  console.log( 'listening in http://localhost:' + port );
} );
