import { Promise } from 'es6-promise';
import Location from '../models/location';
import LocationCollection from '../models/location-collection';
import { removeElementFromArray } from '../helpers';

export function getLocationForUser( userId, locationId ) {
  return new Promise( ( resolve, reject ) => {
    Location.findOne( { _id: locationId, userId }, function( err, location ) {
      if ( err ) return reject( err );
      if ( ! location ) return reject( new Error( 'no such location found' ) );
      resolve( location );
    } );
  } );
}

export function updateLocationForUser( userId, locationId, params ) {
  const { name, address } = params;
  return new Promise( ( resolve, reject ) => {
    getLocationForUser( userId, locationId )
    .then( ( location ) => {
      location.name = name;
      location.address = address;
      location.save( ( saveErr ) => {
        if ( saveErr ) return reject( saveErr );
        resolve( location );
      } );
    } )
    .catch( reject );
  } );
}

export function removeLocationForUser( userId, locationId ) {
  return new Promise( ( resolve, reject ) => {
    findOrCreateCollectionForUser( userId )
    .then( ( collection ) => {
      collection.locations = removeElementFromArray( collection.locations, locationId );
      removeLocation( locationId, userId )
      .then( ( location ) => {
        collection.save( ( saveErr ) => {
          if ( saveErr ) return reject( saveErr );
          resolve( location );
        } );
      } )
      .catch( reject );
    } );
  } );
}

function saveNewLocation( location, collection ) {
  return new Promise( ( resolve, reject ) => {
    location.save( ( err ) => {
      if ( err ) return reject( err );
      collection.locations.push( location._id );
      collection.save( ( collectionErr ) => {
        if ( collectionErr ) return reject( collectionErr );
        resolve( location );
      } );
    } );
  } );
}

function removeLocation( locationId, userId ) {
  return new Promise( ( resolve, reject ) => {
    Location.findOneAndRemove( { _id: locationId, userId }, {}, ( removeErr, location ) => {
      if ( removeErr ) return reject( removeErr );
      if ( ! location ) return reject( new Error( 'no such location found' ) );
      resolve( location );
    } );
  } );
}

function reorderLocations( collection, locationIds ) {
  // for each locationId, find the matching Id in collection.locations, and if
  // found, append to the new array. If the new array does not contain an
  // element in the old array, return the old array to prevent orphans.
  let orphanFound = false;
  const newIds = locationIds.reduce( ( ordered, locationId ) => {
    if ( ~ collection.locations.indexOf( locationId ) && ! ~ ordered.indexOf( locationId ) ) {
      ordered.push( locationId );
    } else {
      orphanFound = true;
    }
    return ordered;
  }, [] );
  if ( orphanFound || newIds.length !== collection.locations.length ) return collection.locations;
  return newIds;
}

function updateLocationsInCollection( collection, locationIds ) {
  return new Promise( ( resolve, reject ) => {
    collection.locations = reorderLocations( collection, locationIds );
    collection.save( ( err ) => {
      if ( err ) return reject( err );
      resolve( collection );
    } );
  } );
}

function getLocationsForCollection( collection ) {
  return new Promise( ( resolve, reject ) => {
    collection.populate( 'locations', ( locationsErr, populatedCollection ) => {
      if ( locationsErr ) return reject( locationsErr );
      resolve( populatedCollection.locations );
    } );
  } );
}

export function listLocationsForUser( userId ) {
  return new Promise( ( resolve, reject ) => {
    findOrCreateCollectionForUser( userId )
    .then( getLocationsForCollection )
    .then( resolve )
    .catch( reject );
  } );
}

export function updateLocationListForUser( userId, locationIds ) {
  return new Promise( ( resolve, reject ) => {
    findOrCreateCollectionForUser( userId )
    .then( ( collection ) => updateLocationsInCollection( collection, locationIds ) )
    .then( getLocationsForCollection )
    .then( resolve )
    .catch( reject );
  } );
}

function findOrCreateCollectionForUser( userId ) {
  return new Promise( ( resolve, reject ) => {
    LocationCollection.findOrCreate( { userId }, ( err, collection ) => {
      if ( err ) return reject( err );
      resolve( collection );
    } );
  } );
}

export function createNewLocationForUser( userId, params ) {
  const { name, address } = params;
  return new Promise( ( resolve, reject ) => {
    findOrCreateCollectionForUser( userId )
    .then( ( collection ) => {
      const location = new Location( { userId, name, address } );
      return saveNewLocation( location, collection );
    } )
    .then( resolve )
    .catch( reject );
  } );
}
