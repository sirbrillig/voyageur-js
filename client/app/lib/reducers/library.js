function matchesSearch( searchString, location ) {
  if ( searchString.length < 2 ) return true;
  return ( ~ location.name.toLowerCase().indexOf( searchString ) || ~ location.address.toLowerCase().indexOf( searchString ) );
}

const initialState = { locations: [], visibleLocations: [], isLoading: true };
export default function library( state = initialState, action ) {
  switch ( action.type ) {
    case 'LIBRARY_GOT_LOCATIONS':
      return Object.assign( {}, { locations: action.library, visibleLocations: action.library, isLoading: false } );
    case 'LIBRARY_SEARCH_FOR':
      const visibleLocations = state.locations.filter( l => matchesSearch( action.searchString, l ) );
      return Object.assign( {}, state, { visibleLocations } );
    case 'LIBRARY_GOT_NEW_LOCATION':
      const locations = [ ...state.locations, action.location ];
      return Object.assign( {}, { locations, visibleLocations: locations } );
    case 'LIBRARY_GOT_UPDATED_LOCATION':
      // TODO: update it
      return state;
  }
  return state;
}
