import { combineReducers } from 'redux';
import library from './library';
import trip from './trip';
import auth from './auth';

export default combineReducers( {
  auth,
  library,
  trip
} );
