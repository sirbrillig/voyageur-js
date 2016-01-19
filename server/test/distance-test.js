import mongoose from 'mongoose';
import mockgoose from 'mockgoose';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getDistanceBetween } from '../app/models/distance';

chai.use( chaiAsPromised );
const expect = chai.expect;

if ( ! mongoose.isMocked ) {
  mockgoose( mongoose );
}
const Location = require( '../app/models/location' ).default;
const LocationCollection = require( '../app/models/location-collection' ).default;
import Distance from '../app/models/distance';

const testUserId = 'testUser';
const testUserId2 = 'testUser2';
let homeLocation;
let workLocation;
let foodLocation;
let teaLocation;
let homeWorkDistance;
let testUserLocationCollection;
let testUser2LocationCollection;

function populateDb( done ) {
  homeLocation = new Location( { userId: testUserId, name: 'foo', address: 'bar' } );
  workLocation = new Location( { userId: testUserId2, name: 'work', address: 'workplace' } );
  foodLocation = new Location( { userId: testUserId2, name: 'food', address: 'foodplace' } );
  teaLocation = new Location( { userId: testUserId2, name: 'tea', address: 'teaplace' } );
  homeWorkDistance = new Distance( { origin: homeLocation, destination: workLocation, distance: '100' } );
  testUserLocationCollection = new LocationCollection( { userId: testUserId, locations: [ homeLocation ] } );
  testUser2LocationCollection = new LocationCollection( { userId: testUserId2, locations: [ workLocation, foodLocation, teaLocation ] } );
  homeLocation.save()
  .then( workLocation.save )
  .then( foodLocation.save )
  .then( teaLocation.save )
  .then( homeWorkDistance.save )
  .then( testUserLocationCollection.save )
  .then( testUser2LocationCollection.save )
  .then( () => done() )
  .then( null, ( err ) => done( err ) );
}

describe( 'distances', function() {
  before( function( done ) {
    mongoose.connect( 'mongodb://example.localhost/TestingDB', function( err ) {
      if ( err ) return done( err );
      done();
    } );
  } );

  after( function() {
    mongoose.disconnect();
  } );

  beforeEach( function( done ) {
    mockgoose.reset( () => populateDb( done ) );
  } );

  describe( '.getDistanceBetween', function() {
    it( 'returns the distance between the origin and destination if the distance is cached', function() {
      return getDistanceBetween( homeLocation._id, workLocation._id )
      .then( function( data ) {
        expect( data.distance ).to.eql( '100' );
      } );
    } );

    it( 'fetches the distance between the origin and destination if the distance is not cached' );
  } );
} );

