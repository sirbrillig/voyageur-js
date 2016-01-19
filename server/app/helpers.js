import { Promise } from 'es6-promise';
import distance from 'google-distance';
distance.apiKey = 'AIzaSyBNDQ3-gE2fMeBUN_X1ELPoMxm8AQiYQOo';

export function getUserIdFromRequest( req ) {
  return req.user.sub;
}

export function removeElementFromArray( ary, element ) {
  return ary.reduce( ( collection, el ) => {
    if ( el !== element ) collection.push( el );
    return collection;
  }, [] );
}

export function fetchDistanceBetween( origin, destination ) {
  return new Promise( ( resolve, reject ) => {
    distance.get( { origin, destination }, ( err, data ) => {
      if ( err ) return reject( err );
      resolve( data.distanceValue );
    } );
  } );
}
