import { Promise } from 'es6-promise';
import TripLocation from '../../models/trip-location';
import Trip from '../../models/trip';
import { removeElementFromArray } from '../../helpers';

export function getTripLocationForUser( userId, tripLocationId ) {
  return new Promise( ( resolve, reject ) => {
    TripLocation.findOne( { _id: tripLocationId, userId }, function( err, tripLocation ) {
      if ( err ) return reject( err );
      if ( ! tripLocation ) return reject( new Error( 'no such tripLocation found' ) );
      resolve( tripLocation );
    } );
  } );
}

export function removeAllTripLocations( userId ) {
  return new Promise( ( resolve, reject ) => {
    findOrCreateTripForUser( userId )
    .then( ( collection ) => {
      collection.tripLocations = [];
      collection.save( ( saveErr ) => {
        if ( saveErr ) return reject( saveErr );
        resolve( collection.tripLocations );
      } );
    } )
    .catch( reject );
  } );
}

export function removeTripLocationForUser( userId, tripLocationId ) {
  return new Promise( ( resolve, reject ) => {
    findOrCreateTripForUser( userId )
    .then( ( collection ) => {
      collection.tripLocations = removeElementFromArray( collection.tripLocations, tripLocationId );
      removeTripLocation( tripLocationId, userId )
      .then( ( tripLocation ) => {
        collection.save( ( saveErr ) => {
          if ( saveErr ) return reject( saveErr );
          resolve( tripLocation );
        } );
      } )
      .catch( reject );
    } );
  } );
}

function saveNewTripLocation( tripLocation, collection ) {
  return new Promise( ( resolve, reject ) => {
    tripLocation.save( ( err ) => {
      if ( err ) return reject( err );
      collection.tripLocations.push( tripLocation._id );
      collection.save( ( collectionErr ) => {
        if ( collectionErr ) return reject( collectionErr );
        resolve( tripLocation );
      } );
    } );
  } );
}

function removeTripLocation( tripLocationId, userId ) {
  return new Promise( ( resolve, reject ) => {
    TripLocation.findOneAndRemove( { _id: tripLocationId, userId }, {}, ( removeErr, tripLocation ) => {
      if ( removeErr ) return reject( removeErr );
      if ( ! tripLocation ) return reject( new Error( 'no such tripLocation found' ) );
      resolve( tripLocation );
    } );
  } );
}

function reorderTripLocations( collection, tripLocationIds ) {
  // for each tripLocationId, find the matching Id in collection.tripLocations, and if
  // found, append to the new array. If the new array does not contain an
  // element in the old array, return the old array to prevent orphans.
  let orphanFound = false;
  const newIds = tripLocationIds.reduce( ( ordered, tripLocationId ) => {
    if ( ~ collection.tripLocations.indexOf( tripLocationId ) && ! ~ ordered.indexOf( tripLocationId ) ) {
      ordered.push( tripLocationId );
    } else {
      orphanFound = true;
    }
    return ordered;
  }, [] );
  if ( orphanFound || newIds.length !== collection.tripLocations.length ) return collection.tripLocations;
  return newIds;
}

function updateTripLocationsInCollection( collection, tripLocationIds ) {
  return new Promise( ( resolve, reject ) => {
    collection.tripLocations = reorderTripLocations( collection, tripLocationIds );
    collection.save( ( err ) => {
      if ( err ) return reject( err );
      resolve( collection );
    } );
  } );
}

function getTripLocationsForUser( collection ) {
  return new Promise( ( resolve, reject ) => {
    collection.populate( 'tripLocations', ( locationsErr, populatedCollection ) => {
      if ( locationsErr ) return reject( locationsErr );
      resolve( populatedCollection.tripLocations );
    } );
  } );
}

export function listTripLocationsForUser( userId ) {
  return new Promise( ( resolve, reject ) => {
    findOrCreateTripForUser( userId )
    .then( getTripLocationsForUser )
    .then( resolve )
    .catch( reject );
  } );
}

export function updateTripForUser( userId, tripLocationIds ) {
  return new Promise( ( resolve, reject ) => {
    findOrCreateTripForUser( userId )
    .then( ( collection ) => updateTripLocationsInCollection( collection, tripLocationIds ) )
    .then( getTripLocationsForUser )
    .then( resolve )
    .catch( reject );
  } );
}

function findOrCreateTripForUser( userId ) {
  return new Promise( ( resolve, reject ) => {
    Trip.findOrCreate( { userId }, ( err, collection ) => {
      if ( err ) return reject( err );
      resolve( collection );
    } );
  } );
}

export function addLocationToTrip( userId, params ) {
  const { location } = params;
  return new Promise( ( resolve, reject ) => {
    findOrCreateTripForUser( userId )
    .then( ( collection ) => {
      const tripLocation = new TripLocation( { userId, location } );
      return saveNewTripLocation( tripLocation, collection );
    } )
    .then( resolve )
    .catch( reject );
  } );
}

