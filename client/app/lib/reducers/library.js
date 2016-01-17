export default function library( state = [], action ) {
  switch ( action.type ) {
    case 'LIBRARY_GOT_LOCATIONS':
      return action.library;
  }
  return state;
}
