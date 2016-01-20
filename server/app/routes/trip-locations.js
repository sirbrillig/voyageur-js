import logStream from 'bunyan-mongodb-stream';
import bunyan from 'bunyan';

import Log from '../models/log';
import { getUserIdFromRequest } from '../helpers';
import {
  listTripLocationsForUser,
  addLocationToTrip,
  getTripLocationForUser,
  removeAllTripLocations,
  removeTripLocationForUser,
  updateTripForUser,
} from '../models/trip-location';

const LogEntryStream = logStream( { model: Log } );
const log = bunyan.createLogger( {
  name: 'trip-location-events',
  streams: [
    { stream: process.stdout },
    { stream: LogEntryStream },
  ],
  serializers: bunyan.stdSerializers
} );

export default {
  list( req, res ) {
    const userId = getUserIdFromRequest( req );
    listTripLocationsForUser( userId )
    .then( ( locations ) => {
      log.info( { userId, event: 'list' } );
      res.status( 200 ).json( locations );
    } )
    .catch( ( err ) => {
      log.error( { userId, event: 'list' }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  create( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { location } = req.body;
    addLocationToTrip( userId, { location } )
    .then( ( tripLocation ) => {
      log.info( { userId, event: 'create', data: { location } } );
      res.status( 200 ).json( tripLocation );
    } )
    .catch( ( err ) => {
      log.error( { userId, event: 'create', data: { location } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  get( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { tripLocationId } = req.params;
    getTripLocationForUser( userId, tripLocationId )
    .then( ( tripLocation ) => {
      log.info( { userId, event: 'get', data: { tripLocationId } } );
      res.status( 200 ).json( tripLocation );
    } )
    .catch( ( err ) => {
      log.error( { userId, event: 'get', data: { tripLocationId } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  updateList( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { tripLocationIds } = req.body;
    updateTripForUser( userId, tripLocationIds )
    .then( ( updatedLocations ) => {
      log.info( { userId, event: 'updateList', data: { tripLocationIds } } );
      res.status( 200 ).json( updatedLocations );
    } )
    .catch( ( err ) => {
      log.error( { userId, event: 'updateList', data: { tripLocationIds } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  deleteAll( req, res ) {
    const userId = getUserIdFromRequest( req );
    removeAllTripLocations( userId )
    .then( ( tripLocations ) => {
      log.info( { userId, event: 'deleteAll', data: { userId } } );
      res.status( 200 ).json( tripLocations );
    } )
    .catch( ( err ) => {
      log.error( { userId, event: 'deleteAll', data: { userId } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  delete( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { tripLocationId } = req.params;
    removeTripLocationForUser( userId, tripLocationId )
    .then( ( tripLocation ) => {
      log.info( { userId, event: 'delete', data: { tripLocationId } } );
      res.status( 200 ).json( tripLocation );
    } )
    .catch( ( err ) => {
      log.error( { userId, event: 'delete', data: { tripLocationId } }, err.message );
      res.status( 502 ).send( err );
    } )
  }
};

