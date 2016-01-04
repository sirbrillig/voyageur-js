import { Promise } from 'es6-promise';
import Location from '../models/location';
import LocationCollection from '../models/location-collection';
import { getUserIdFromRequest } from '../helpers';

function saveNewLocation( location, collection ) {
  var promise = new Promise( ( resolve, reject ) => {
    location.save( ( err ) => {
      if ( err ) return reject( err );
      collection.locations.push( location._id );
      collection.save( ( collectionErr ) => {
        if ( collectionErr ) return reject( collectionErr );
        resolve( location );
      } );
    } );
  } );
  return promise;
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

function getLocationsForCollection( collection ) {
  var promise = new Promise( ( resolve, reject ) => {
    collection.populate( 'locations', ( locationsErr, populatedCollection ) => {
      if ( locationsErr ) return reject( locationsErr );
      resolve( populatedCollection.locations );
    } );
  } );
  return promise;
}

function listLocationsForUser( userId ) {
  var promise = new Promise( ( resolve ) => {
    findOrCreateCollectionForUser( userId )
    .then( getLocationsForCollection )
    .then( resolve );
  } );
  return promise;
}

function findOrCreateCollectionForUser( userId ) {
  var promise = new Promise( ( resolve, reject ) => {
    LocationCollection.findOrCreate( { userId }, ( err, collection ) => {
      if ( err ) return reject( err );
      resolve( collection );
    } );
  } );
  return promise;
}

function createNewLocationForUser( userId, params ) {
  const { name, address } = params;
  var promise = new Promise( ( resolve ) => {
    findOrCreateCollectionForUser( userId )
    .then( ( collection ) => {
      const location = new Location( { userId, name, address } );
      return saveNewLocation( location, collection );
    } )
    .then( resolve );
  } );
  return promise;
}

export default {
  list( req, res ) {
    const userId = getUserIdFromRequest( req );
    listLocationsForUser( userId )
    .then( ( locations ) => {
      res.status( 200 ).json( locations );
    } )
    .catch( ( err ) => {
      res.status( 502 ).send( err );
    } );
  },

  create( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { name, address } = req.body;
    createNewLocationForUser( userId, { name, address } )
    .then( ( location ) => {
      res.status( 200 ).json( location );
    } )
    .catch( ( err ) => {
      res.status( 502 ).send( err );
    } )
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
