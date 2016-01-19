import mongoose from 'mongoose';
import { Promise } from 'es6-promise';
import { fetchDistanceBetween } from '../helpers';

const DistanceSchema = new mongoose.Schema( {
  origin: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  distance: { type: String, required: true },
} );

const Distance = mongoose.model( 'Distance', DistanceSchema );
export default Distance;

export function getDistanceBetween( origin, destination ) {
  return new Promise( ( resolve, reject ) => {
    Distance.findOne( { origin, destination }, ( err, distance ) => {
      if ( err ) return reject( err );
      if ( distance ) return resolve( { distance: distance.distance } );
      createNewDistance( origin, destination )
      .then( ( newDistance ) => resolve( { distance: newDistance } ) )
      .catch( reject );
    } );
  } );
}

function createNewDistance( origin, destination ) {
  return new Promise( ( resolve, reject ) => {
    fetchDistanceBetween( origin.address, destination.address )
    .then( ( distance ) => {
      const newDistance = new Distance( { origin, destination, distance } );
      newDistance.save( ( err ) => {
        if ( err ) return reject( err );
        resolve( newDistance );
      } );
    } );
  } );
}
