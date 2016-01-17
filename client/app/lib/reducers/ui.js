const initialState = { isShowingAddLocation: false };
export default function auth( state = initialState, action ) {
  switch ( action.type ) {
    case 'LIBRARY_GOT_NEW_LOCATION':
      return Object.assign( {}, state, { isShowingAddLocation: false } );
    case 'LIBRARY_HIDE_ADD_LOCATION':
      return Object.assign( {}, state, { isShowingAddLocation: false } );
    case 'LIBRARY_SHOW_ADD_LOCATION':
      return Object.assign( {}, state, { isShowingAddLocation: true } );
  }
  return state;
}

