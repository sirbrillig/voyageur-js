function matchesSearch( location ) {
  if ( this.props.searchString.length < 2 ) return true;
  return ( ~ location.name.toLowerCase().indexOf( this.props.searchString ) || ~ location.address.toLowerCase().indexOf( this.props.searchString ) );
}

const initialState = { locations: [], visibleLocations: [] };
export default function library( state = initialState, action ) {
  switch ( action.type ) {
    case 'LIBRARY_GOT_LOCATIONS':
      return Object.assign( {}, { locations: action.library, visibleLocations: action.library } );
    case 'LIBRARY_SEARCH_FOR':
      const visibleLocations = state.locations.filter( l => matchesSearch( l ) );
      return Object.assign( {}, state, { visibleLocations } );
    case 'LIBRARY_GOT_NEW_LOCATION':
      const locations = [ ...state.locations, action.location ];
      return Object.assign( {}, { locations, visibleLocations: locations } );
  }
  return state;
}
