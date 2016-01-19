import chai from 'chai';
import sinon from 'sinon';
import sinonPromise from 'sinon-promise';

// Mock fetchDistanceBetween to always return 200
sinonPromise( sinon );
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
      return getDistanceBetween( mockUsers.testUserId, mockLocations.homeLocation._id, mockLocations.workLocation._id )
      .then( function( data ) {
        expect( data.distance ).to.eql( 100 );
      } );
    } );

    it( 'fetches the distance between the origin and destination if the distance is not cached', function() {
      return getDistanceBetween( mockUsers.testUserId, mockLocations.gameLocation._id, mockLocations.workLocation._id )
      .then( function( data ) {
        expect( data.distance ).to.eql( 200 );
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
