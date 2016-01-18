import { combineReducers } from 'redux';
import library from './library';
import trip from './trip';
import auth from './auth';
import ui from './ui';
import notices from './notices';

export default combineReducers( {
  auth,
  library,
  trip,
  ui,
  notices,
} );
