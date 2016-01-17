import request from 'superagent';
import { Promise } from 'es6-promise';

const baseUrl = 'http://localhost:3001';

export function listLocations( token ) {
  return new Promise( ( resolve, reject ) => {
    const listLocationsUrl = `${baseUrl}/secured/locations`;
    request.get( listLocationsUrl )
    .set( 'Authorization', `Bearer ${token}` )
    .end( ( err, res ) => {
      const data = res.body;
      if ( err ) return reject( err );
      if ( ! data ) return reject( 'No data found in response' );
      return resolve( data );
    } );
  } );
}
