import get from 'lodash.get';

const initialState = { token: null };
export default function auth( state = initialState, action ) {
  switch ( action.type ) {
    case 'ERROR':
      const text = get( action, 'error.response.text', '' );
      if ( text.match( /expired/ ) ) {
        return Object.assign( {}, initialState );
      }
      break;
    case 'AUTH_GOT_TOKEN':
      return Object.assign( {}, state, { token: action.token } );
  }
  return state;
}
