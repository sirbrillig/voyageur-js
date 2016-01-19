import logStream from 'bunyan-mongodb-stream';
import bunyan from 'bunyan';
import Log from '../models/log';
import { getUserIdFromRequest } from '../helpers';
import { getDistanceBetween } from '../models/distance';

const LogEntryStream = logStream( { model: Log } );
const log = bunyan.createLogger( {
  name: 'distance-events',
  streams: [
    { stream: process.stdout },
    { stream: LogEntryStream },
  ],
  serializers: bunyan.stdSerializers
} );

export default {
  get( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { originId, destinationId } = req.params;
    getDistanceBetween( originId, destinationId )
    .then( ( distance ) => {
      log.info( { userId, event: 'get', data: { originId, destinationId } } );
      res.status( 200 ).json( distance );
    } )
    .catch( ( err ) => {
      log.error( { userId, event: 'create', data: { originId, destinationId } }, err.message );
      res.status( 502 ).send( err );
    } );
  }
}
