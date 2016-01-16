import express from 'express';
import locations from './routes/locations';
import tripLocations from './routes/trip-locations';

const router = express.Router();

router.get( '/ping', ( req, res ) => {
  res.status( 200 ).json( { text: 'All good. You don\'t need to be authenticated to call this' } );
} );

router.get( '/secured/ping', ( req, res ) => {
  res.status( 200 ).json( { text: 'All good. You are authenticated' } );
} );

router.route( '/secured/locations' )
.get( locations.list )
.post( locations.create )
.put( locations.updateList );

router.route( '/secured/locations/:locationId' )
.get( locations.get )
.put( locations.update )
.delete( locations.delete );

router.route( '/secured/trip-locations' )
.get( tripLocations.list )
.post( tripLocations.create )
.put( tripLocations.updateList );

router.route( '/secured/trip-locations/:tripLocationId' )
.get( tripLocations.get )
.delete( tripLocations.delete );

export default router;
