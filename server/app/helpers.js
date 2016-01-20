import { Promise } from 'es6-promise';
import distance from 'google-distance';
import dotenv from 'dotenv';

dotenv.load();

distance.apiKey = process.env.GOOGLE_DISTANCE_API_KEY;

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
