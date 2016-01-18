export default function library( state = [], action ) {
  switch ( action.type ) {
    case 'LIBRARY_GOT_LOCATIONS':
      return action.library;
    case 'LIBRARY_GOT_NEW_LOCATION':
      return [ ...state, action.location ];
  }
  return state;
}
