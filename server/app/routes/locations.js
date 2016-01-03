import Location from '../models/location';
import { getUserIdFromRequest } from '../helpers';

export default {
  list( req, res ) {
    const userId = getUserIdFromRequest( req );
    Location.find( { userId } )
    .then( ( locations ) => {
      res.status( 200 ).json( locations );
    } )
    .then( null, ( err ) => {
      res.status( 502 ).send( err );
    } );
  },

  create( req, res ) {
    const userId = getUserIdFromRequest( req );
    const location = new Location();
    location.userId = userId;
    location.name = req.body.name;
    location.address = req.body.address;
    location.save( ( err ) => {
      if ( err ) return res.status( 502 ).send( err );
      res.status( 200 ).json( location );
    } );
  },

  get( req, res ) {
    const userId = getUserIdFromRequest( req );
    Location.findOne( { _id: req.params.location_id, userId } )
    .then( ( location ) => {
      res.status( 200 ).json( location );
    } )
    .then( null, ( err ) => {
      res.status( 502 ).send( err );
    } );
  },

  update( req, res ) {
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
  },

  delete( req, res ) {
    const userId = getUserIdFromRequest( req );
    Location.remove( { _id: req.params.location_id, userId } )
    .then( ( location ) => {
      res.status( 200 ).json( location );
    } )
    .then( null, ( err ) => {
      res.status( 502 ).send( err );
    } );
  }
};
