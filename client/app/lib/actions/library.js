import { gotError } from './general';
import { createNewLocation, listLocations } from '../api/locations';

export function addToTrip( location ) {
  return function( dispatch ) {
    // TODO: send to api
    const tripLocation = Object.assign( { _id: 'new-trip-location_' + Date.now(), isLoading: true, location } );
    dispatch( gotNewTripLocation( tripLocation ) );
  }
}

export function gotNewTripLocation( tripLocation ) {
  return { type: 'TRIP_GOT_NEW_TRIP_LOCATION', tripLocation };
}

export function addLocation( params ) {
  return function( dispatch, getState ) {
    if ( ! params.name || ! params.address ) return dispatch( gotError( 'Locations must have a name and an address' ) );
    createNewLocation( getState().auth.token, params )
    .then( () => dispatch( fetchLibrary() ) )
    .catch( ( err ) => dispatch( gotError( err ) ) );
    const location = Object.assign( { _id: 'new-location_' + Date.now(), isLoading: true }, params );
    dispatch( gotNewLocation( location ) );
  }
}

export function gotNewLocation( location ) {
  return { type: 'LIBRARY_GOT_NEW_LOCATION', location }
}

export function hideAddLocation() {
  return { type: 'LIBRARY_HIDE_ADD_LOCATION' };
}

export function showAddLocation() {
  return { type: 'LIBRARY_SHOW_ADD_LOCATION' };
}

export function fetchLibrary() {
  return function( dispatch, getState ) {
    listLocations( getState().auth.token )
    .then( ( locations ) => {
      dispatch( gotLibrary( locations ) );
    } )
    .catch( ( err ) => {
      dispatch( gotError( err ) );
    } );
  }
}

export function gotLibrary( library ) {
  return { type: 'LIBRARY_GOT_LOCATIONS', library };
}
