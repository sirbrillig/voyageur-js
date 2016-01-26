import logStream from 'bunyan-mongodb-stream';
import bunyan from 'bunyan';
import Log from '../models/log';
import { getUserNameFromRequest, getUserIdFromRequest } from '../helpers';
import { getDistanceForUser } from '../models/distance';

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
    getDistanceForUser( userId )
    .then( ( distance ) => {
      res.status( 200 ).json( distance );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'create', data: { userId } }, err.message );
      res.status( 502 ).send( err );
    } );
  }
}
