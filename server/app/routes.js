var express = require( 'express' );
var Location = require( './models/location' );

var router = express.Router();

function getUserIdFromRequest( req ) {
  return req.user.sub;
}

router.get( '/ping', function( req, res ) {
  res.status( 200 ).json( { text: "All good. You don't need to be authenticated to call this" } );
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

module.exports = router;
