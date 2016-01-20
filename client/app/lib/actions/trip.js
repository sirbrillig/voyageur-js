import { gotError } from './general';
import { getTripDistance, deleteTripLocation, createNewTripLocation, listTripLocations } from '../api/trip';

export function removeTripLocation( tripLocationId ) {
  return function( dispatch, getState ) {
    deleteTripLocation( getState().auth.token, tripLocationId )
    .then( () => dispatch( fetchTrip() ) )
    .catch( ( err ) => dispatch( gotError( err ) ) );
    dispatch( gotRemovedTripLocation( tripLocationId ) );
  }
}

export function addToTrip( location ) {
  return function( dispatch, getState ) {
    createNewTripLocation( getState().auth.token, { location } )
    .then( () => dispatch( fetchTrip() ) )
    .catch( ( err ) => dispatch( gotError( err ) ) );
    const tripLocation = Object.assign( { _id: 'new-trip-location_' + Date.now(), isLoading: true, location } );
    dispatch( gotNewTripLocation( tripLocation ) );
  }
}

export function gotNewTripLocation( tripLocation ) {
  return { type: 'TRIP_GOT_NEW_TRIP_LOCATION', tripLocation };
}

export function fetchTrip() {
  return function( dispatch, getState ) {
    listTripLocations( getState().auth.token )
    .then( tripLocations => dispatch( gotTrip( tripLocations ) ) )
    .then( () => dispatch( fetchDistance() ) )
    .catch( err => dispatch( gotError( err ) ) );
  }
}

export function fetchDistance() {
  return function( dispatch, getState ) {
    getTripDistance( getState().auth.token )
    .then( data => dispatch( gotDistance( data.distance ) ) )
    .catch( err => dispatch( gotError( err ) ) );
  }
}

export function gotDistance( distance ) {
  return { type: 'TRIP_GOT_DISTANCE', distance };
}

export function gotTrip( trip ) {
  return { type: 'TRIP_GOT_TRIP_LOCATIONS', trip };
}

export function gotRemovedTripLocation( tripLocationId ) {
  return { type: 'TRIP_GOT_REMOVE_TRIP_LOCATION', tripLocationId };
}
