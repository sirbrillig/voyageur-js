const initialState = { token: null };
export default function auth( state = initialState, action ) {
  switch ( action.type ) {
    case 'AUTH_SAVE_TOKEN':
      return Object.assign( {}, state, { token: action.token } );
  }
  return state;
}
