import logStream from 'bunyan-mongodb-stream';
import bunyan from 'bunyan';

import Log from '../models/log';
import { getUserNameFromRequest, getUserIdFromRequest } from '../helpers';
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
      res.status( 200 ).json( locations );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'list' }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  create( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { location } = req.body;
    addLocationToTrip( userId, { location } )
    .then( ( tripLocation ) => {
      res.status( 200 ).json( tripLocation );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'create', data: { location } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  get( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { tripLocationId } = req.params;
    getTripLocationForUser( userId, tripLocationId )
    .then( ( tripLocation ) => {
      res.status( 200 ).json( tripLocation );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'get', data: { tripLocationId } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  updateList( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { tripLocationIds } = req.body;
    updateTripForUser( userId, tripLocationIds )
    .then( ( updatedLocations ) => {
      res.status( 200 ).json( updatedLocations );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'updateList', data: { tripLocationIds } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  deleteAll( req, res ) {
    const userId = getUserIdFromRequest( req );
    removeAllTripLocations( userId )
    .then( ( tripLocations ) => {
      res.status( 200 ).json( tripLocations );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'deleteAll', data: { userId } }, err.message );
      res.status( 502 ).send( err );
    } );
  },

  delete( req, res ) {
    const userId = getUserIdFromRequest( req );
    const { tripLocationId } = req.params;
    removeTripLocationForUser( userId, tripLocationId )
    .then( ( tripLocation ) => {
      res.status( 200 ).json( tripLocation );
    } )
    .catch( ( err ) => {
      log.error( { userId, userName: getUserNameFromRequest( req ), event: 'delete', data: { tripLocationId } }, err.message );
      res.status( 502 ).send( err );
    } )
  }
};

