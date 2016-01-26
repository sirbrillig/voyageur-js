import { gotError } from './general';
import * as api from '../api/locations';

export function addLocation( params ) {
  return function( dispatch, getState ) {
    if ( ! params.name || ! params.address ) return dispatch( gotError( 'Locations must have a name and an address' ) );
    api.createNewLocation( getState().auth.token, params )
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
    api.listLocations( getState().auth.token )
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

export function searchLocationsFor( searchString ) {
  return { type: 'LIBRARY_SEARCH_FOR', searchString };
}

export function selectNextLocation( max ) {
  return { type: 'LIBRARY_SELECT_NEXT', max };
}

export function selectPreviousLocation() {
  return { type: 'LIBRARY_SELECT_PREVIOUS' };
}

export function startEditLocation( location ) {
  return { type: 'LIBRARY_EDIT_LOCATION', location };
}

export function hideEditLocation() {
  return { type: 'LIBRARY_HIDE_EDIT_LOCATION' };
}

export function saveLocation( location, params ) {
  return function( dispatch, getState ) {
    if ( ! params.name || ! params.address ) return dispatch( gotError( 'Locations must have a name and an address' ) );
    api.updateLocationParams( getState().auth.token, location, params )
    .then( () => dispatch( fetchLibrary() ) )
    .catch( ( err ) => dispatch( gotError( err ) ) );
    const updated = Object.assign( {}, location, { isLoading: true }, params );
    dispatch( gotUpdatedLocation( updated ) );
    dispatch( hideEditLocation() );
  }
}

export function gotUpdatedLocation( location ) {
  return { type: 'LIBRARY_GOT_UPDATED_LOCATION', location };
}

export function deleteLocation( location ) {
  return function( dispatch, getState ) {
    api.deleteLocationFromLibrary( getState().auth.token, location )
    .then( () => dispatch( fetchLibrary() ) )
    .catch( ( err ) => dispatch( gotError( err ) ) );
    dispatch( gotDeletedLocation( location ) );
    dispatch( hideEditLocation() );
  }
}

export function gotDeletedLocation( location ) {
  return { type: 'LIBRARY_DELETE_LOCATION', location };
}

export function moveLibraryLocation( location, targetIndex ) {
  return function( dispatch, getState ) {
    const newLibrary = getState().locations.slice( 0 ).splice( targetIndex, 0, location );
    // TODO: call the server
    // TODO: mark all locations isLoading
    dispatch( gotLibrary( newLibrary ) );
  }
}
