import express from 'express';
import Location from './models/location';

const router = express.Router();

function getUserIdFromRequest( req ) {
  return req.user.sub;
}

router.get( '/ping', ( req, res ) => {
  res.status( 200 ).json( { text: "All good. You don't need to be authenticated to call this" } );
} );

router.route( '/secured/locations' )
.get( ( req, res ) => {
  const userId = getUserIdFromRequest( req );
  Location.find( { userId } )
  .then( ( locations ) => {
    res.status( 200 ).json( locations );
  } )
  .then( null, ( err ) => {
    res.status( 502 ).send( err );
  } );
} )
.post( ( req, res ) => {
  const userId = getUserIdFromRequest( req );
  const location = new Location();
  location.userId = userId;
  location.name = req.body.name;
  location.address = req.body.address;
  location.save( ( err ) => {
    if ( err ) return res.status( 502 ).send( err );
    res.status( 200 ).json( location );
  } );
} );

router.route( '/secured/locations/:location_id' )
.get( ( req, res ) => {
  const userId = getUserIdFromRequest( req );
  Location.findOne( { _id: req.params.location_id, userId } )
  .then( ( location ) => {
    res.status( 200 ).json( location );
  } )
  .then( null, ( err ) => {
    res.status( 502 ).send( err );
  } );
} )
.put( ( req, res ) => {
  const userId = getUserIdFromRequest( req );
  Location.findOne( { _id: req.params.location_id, userId } )
  .then( ( location ) => {
    location.name = req.body.name;
    location.address = req.body.address;
    location.save( ( saveErr ) => {
      if ( saveErr ) return res.status( 502 ).send( saveErr );
      res.status( 200 ).json( location );
    } );
  } )
  .then( null, ( err ) => {
    res.status( 502 ).send( err );
  } );
} )
.delete( ( req, res ) => {
  const userId = getUserIdFromRequest( req );
  Location.remove( { _id: req.params.location_id, userId } )
  .then( ( location ) => {
    res.status( 200 ).json( location );
  } )
  .then( null, ( err ) => {
    res.status( 502 ).send( err );
  } );
} );

module.exports = router;
