import { gotError } from './general';
import { createNewTripLocation, listTripLocations } from '../api/trip';

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
    .then( ( tripLocations ) => dispatch( gotTrip( tripLocations ) ) )
    .catch( ( err ) => dispatch( gotError( err ) ) );
  }
}

export function gotTrip( trip ) {
  return { type: 'TRIP_GOT_TRIP_LOCATIONS', trip };
}

