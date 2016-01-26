import logStream from 'bunyan-mongodb-stream';
import bunyan from 'bunyan';
import Log from '../models/log';
import { getUserNameFromRequest, getUserIdFromRequest } from '../helpers';
import {
  listLocationsForUser,
  createNewLocationForUser,
  getLocationForUser,
  updateLocationListForUser,
  updateLocationForUser,
  removeLocationForUser
} from '../models/location';

const LogEntryStream = logStream( { model: Log } );
const log = bunyan.createLogger( {
  name: 'location-events',
  streams: [
    { stream: process.stdout },
    { stream: LogEntryStream },
  ],
  serializers: bunyan.stdSerializers
} );

export default {
  list( req, res ) {
    const userId = getUserIdFromRequest( req );
    listLocationsForUser( userId )
    .then( ( locations ) => {
      log.info( { userId, userName: getUserNameFromRequest( req ), event: 'list' } );
      res.status( 200 ).json( locations );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'list' }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  create( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { name, address } = req.body;
    createNewLocationForUser( userId, { name, address } )
    .then( ( location ) => {
      log.info( { userId, userName: getUserNameFromRequest( req ), event: 'create', data: { name, address } } );
      res.status( 200 ).json( location );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'create', data: { name, address } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  get( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { locationId } = req.params;
    getLocationForUser( userId, locationId )
    .then( ( location ) => {
      log.info( { userId, userName: getUserNameFromRequest( req ), event: 'get', data: { locationId } } );
      res.status( 200 ).json( location );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'get', data: { locationId } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  updateList( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { locations } = req.body;
    updateLocationListForUser( userId, locations )
    .then( ( updatedLocations ) => {
      log.info( { userId, userName: getUserNameFromRequest( req ), event: 'updateList', data: { locations } } );
      res.status( 200 ).json( updatedLocations );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'updateList', data: { locations } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  update( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { name, address } = req.body;
    const { locationId } = req.params;
    updateLocationForUser( userId, locationId, { name, address } )
    .then( ( location ) => {
      log.info( { userId, userName: getUserNameFromRequest( req ), event: 'update', data: { locationId, name, address } } );
      res.status( 200 ).json( location );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'update', data: { locationId, name, address } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  delete( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { locationId } = req.params;
    removeLocationForUser( userId, locationId )
    .then( ( location ) => {
      log.info( { userId, userName: getUserNameFromRequest( req ), event: 'delete', data: { locationId } } );
      res.status( 200 ).json( location );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'delete', data: { locationId } }, err.message );
      res.status( 502 ).send( err );
    } )
  }
};
