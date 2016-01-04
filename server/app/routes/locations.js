import Location from '../models/location';
import LocationCollection from '../models/location-collection';
import { getUserIdFromRequest } from '../helpers';

function saveNewLocation( res, location, collection ) {
  location.save( ( err ) => {
    if ( err ) return res.status( 502 ).send( err );
    collection.locations.push( location._id );
    collection.save( ( collectionErr ) => {
      if ( collectionErr ) return res.status( 502 ).send( collectionErr );
      res.status( 200 ).json( location );
    } );
  } );
}

function removeLocation( res, locationId, userId, collection ) {
  Location.remove( { _id: locationId, userId }, ( removeErr, location ) => {
    if ( removeErr ) return res.status( 502 ).send( removeErr );
    collection.save( ( saveErr ) => {
      if ( saveErr ) return res.status( 502 ).send( saveErr );
      res.status( 200 ).json( location );
    } );
  } );
}

function removeLocationFromCollection( locations, locationId ) {
  return locations.reduce( ( collection, element ) => {
    if ( element !== locationId ) collection.push( element );
    return collection;
  }, [] );
}

export default {
  list( req, res ) {
    const userId = getUserIdFromRequest( req );
    LocationCollection.findOrCreate( { userId }, ( err, collection ) => {
      collection.populate( 'locations', ( locationsErr, populatedCollection ) => {
        res.status( 200 ).json( populatedCollection.locations );
      } );
    } );
  },

  create( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { name, address } = req.body;
    LocationCollection.findOrCreate( { userId }, ( err, collection ) => {
      if ( err ) return res.status( 502 ).send( err );
      const location = new Location( { userId, name, address } );
      saveNewLocation( res, location, collection );
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
    const locationId = req.params.location_id;
    LocationCollection.findOrCreate( { userId }, ( err, collection ) => {
      if ( err ) return res.status( 502 ).send( err );
      collection.locations = removeLocationFromCollection( collection.locations, locationId );
      removeLocation( res, locationId, userId, collection );
    } );
  }
};
