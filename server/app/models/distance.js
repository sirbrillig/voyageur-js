import mongoose from 'mongoose';
import { Promise } from 'es6-promise';
import { fetchDistanceBetween } from '../helpers';
import { listTripLocationsForUser } from '../models/trip-location';
import { getLocationForUser } from '../models/location';

const DistanceSchema = new mongoose.Schema( {
  userId: { type: String, required: true },
  origin: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  distance: { type: Number, required: true },
} );

const Distance = mongoose.model( 'Distance', DistanceSchema );
export default Distance;

export function getDistanceBetween( userId, origin, destination ) {
  return new Promise( ( resolve, reject ) => {
    Distance.findOne( { origin, destination }, ( err, distance ) => {
      if ( err ) return reject( err );
      if ( distance ) return resolve( { distance: distance.distance } );
      createNewDistance( userId, origin, destination )
      .then( newDistance => resolve( { distance: newDistance } ) )
      .catch( reject );
    } );
  } );
}

function createNewDistance( userId, origin, destination ) {
  return new Promise( ( resolve, reject ) => {
    fetchDistanceBetween( origin.address, destination.address )
    .then( distance => {
      const newDistance = new Distance( { userId, origin, destination, distance } );
      newDistance.save( ( err ) => {
        if ( err ) return reject( err );
        resolve( newDistance.distance );
      } );
    } );
  } );
}

export function getDistanceForUser( userId ) {
  return new Promise( ( resolve, reject ) => {
    listTripLocationsForUser( userId )
    .then( tripLocations => getDistanceForTripLocations( userId, tripLocations ) )
    .then( resolve )
    .catch( reject );
  } );
}

function getDistanceForTripLocations( userId, tripLocations ) {
  return new Promise( ( resolve, reject ) => {
    // First, collect the distance between each two locations
    const allDistancePromises = tripLocations.reduce( ( promises, tripLocation, index ) => {
      if ( index + 1 >= tripLocations.length ) return promises;
      return promises.concat( getDistanceBetweenTripLocations( userId, tripLocation, tripLocations[ index + 1 ] ) );
    }, [] );
    Promise.all( allDistancePromises )
    .then( allDistances => {
      // Add all the distances together to get the total
      resolve( { distance: allDistances.reduce( ( total, distObj ) => {
        return total += distObj.distance;
      }, 0 ) } );
    } )
    .catch( reject );
  } );
}

function getDistanceBetweenTripLocations( userId, originTripLocation, destinationTripLocation ) {
  return new Promise( ( resolve, reject ) => {
    Promise.all( [ originTripLocation, destinationTripLocation ].map( tripLocation => getLocationForUser( userId, tripLocation.location ) ) )
    .then( ( [ originLocation, destinationLocation ] ) => {
      return getDistanceBetween( userId, originLocation, destinationLocation )
    } )
    .then( resolve )
    .catch( reject );
  } );
}