import { gotError } from './general';
import { listLocations } from '../api/locations';

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
