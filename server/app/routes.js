import express from 'express';
import locations from './routes/locations';

const router = express.Router();

router.get( '/ping', ( req, res ) => {
  res.status( 200 ).json( { text: "All good. You don't need to be authenticated to call this" } );
} );

router.route( '/secured/locations' )
.get( locations.list )
.post( locations.create );

router.route( '/secured/locations/:location_id' )
.get( locations.get )
.put( locations.update )
.delete( locations.delete );

export default router;
