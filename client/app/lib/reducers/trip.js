export default function trip( state = [], action ) {
  switch ( action.type ) {
    case 'TRIP_GOT_TRIP_LOCATIONS':
      return action.trip;
    case 'TRIP_GOT_NEW_TRIP_LOCATION':
      return [ ...state, action.tripLocation ];
  }
  return state;
}
