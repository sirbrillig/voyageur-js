import Location from '../models/location';
import LocationCollection from '../models/location-collection';
import { getUserIdFromRequest } from '../helpers';

export default {
  list( req, res ) {
    const userId = getUserIdFromRequest( req );
    LocationCollection.findOne( { userId } )
    .populate( 'locations' )
    .then( ( collection ) => {
      res.status( 200 ).json( collection.locations );
    } )
    .then( null, ( err ) => {
      res.status( 502 ).send( err );
    } );
  },

  create( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { name, address } = req.body;
    const collection = LocationCollection.findOne( { userId } );
    const location = new Location( { userId, name, address } );
    location.save( ( err ) => {
      if ( err ) return res.status( 502 ).send( err );
      collection.push( location._id );
      collection.save( ( collectionErr ) => {
        if ( collectionErr ) return res.status( 502 ).send( collectionErr );
        res.status( 200 ).json( location );
      } );
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
    const { name, address } = req.body;
    Location.findOne( { _id: req.params.location_id, userId } )
    .then( ( location ) => {
      location.name = name;
      location.address = address;
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
    // TODO: remove location_id from LocationCollection as well
    Location.remove( { _id: req.params.location_id, userId } )
    .then( ( location ) => {
      res.status( 200 ).json( location );
    } )
    .then( null, ( err ) => {
      res.status( 502 ).send( err );
    } );
  }
};
