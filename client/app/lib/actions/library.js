import { gotError } from './general';
import { listLocations } from '../api/locations';

export function addLocation( params ) {
  return function( dispatch ) {
    // TODO
    const location = Object.assign( { _id: 'new-location_' + Date.now() }, params );
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
