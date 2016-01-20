import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonPromise from 'sinon-promise';

sinonPromise( sinon );
chai.use( sinonChai );

// Mock fetchDistanceBetween to always return 200
import * as helpers from '../app/helpers';
helpers.fetchDistanceBetween = sinon.promise().resolves( 200 );

import { getDistanceBetween, getDistanceForUser } from '../app/models/distance';
import { connectToDb, disconnectFromDb, resetDb, mockUsers, mockLocations } from './bootstrap';

const expect = chai.expect;

describe( 'distances', function() {
  before( function( done ) {
    connectToDb( done );
  } );

  after( function() {
    disconnectFromDb();
  } );

  beforeEach( function( done ) {
    resetDb( done );
  } );

  describe( '.getDistanceBetween', function() {
    it( 'returns the distance between the origin and destination if the distance is cached', function() {
      return getDistanceBetween( mockUsers.testUserId, mockLocations.homeLocation._id, mockLocations.coffeeLocation._id )
      .then( function( data ) {
        expect( data.distance ).to.eql( 600 );
      } );
    } );

    it( 'fetches the distance between the origin and destination if the distance is not cached', function() {
      return getDistanceBetween( mockUsers.testUserId, mockLocations.gameLocation._id, mockLocations.homeLocation._id )
      .then( function( data ) {
        expect( data.distance ).to.eql( 200 );
      } );
    } );

    it( 'calls fetchDistanceBetween with the correct arguments if the distance is not cached', function() {
      return getDistanceBetween( mockUsers.testUserId, mockLocations.gameLocation._id, mockLocations.homeLocation._id )
      .then( function() {
        expect( helpers.fetchDistanceBetween ).to.have.been.calledWith( mockLocations.gameLocation.address, mockLocations.homeLocation.address );
      } );
    } );

    it( 'caches the distance if the distance is not cached', function() {
      // We have to grab the callCount because the mock is global for all tests
      const callCount = helpers.fetchDistanceBetween.callCount;
      return getDistanceBetween( mockUsers.testUserId, mockLocations.gameLocation._id, mockLocations.homeLocation._id )
      .then( () => getDistanceBetween( mockUsers.testUserId, mockLocations.gameLocation._id, mockLocations.homeLocation._id ) )
      .then( function() {
        expect( helpers.fetchDistanceBetween.callCount ).to.eql( callCount + 1 );
      } );
    } );
  } );

  describe( '.getDistanceForUser', function() {
    it( 'returns the total distance for all the tripLocations owned by that user', function() {
      return getDistanceForUser( mockUsers.testUserId )
      .then( function( data ) {
        expect( data.distance ).to.eql( 1000 );
      } );
    } );
  } );
} );
