import { combineReducers } from 'redux';
import library from './library';
import trip from './trip';

export default combineReducers( {
  library,
  trip
} );
