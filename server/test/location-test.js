const mongoose = require( 'mongoose' );
const mockgoose = require( 'mockgoose' );
const chai = require( 'chai' );
const chaiAsPromised = require( 'chai-as-promised' );
const locations = require( '../app/routes/locations' );

chai.use( chaiAsPromised );
const expect = chai.expect;

mockgoose( mongoose );
const Location = require( '../app/models/location' ).default;
const LocationCollection = require( '../app/models/location-collection' ).default;

const testUserId = 'testUser';
const testUserId2 = 'testUser2';
let homeLocation;
let workLocation;
let testUserLocationCollection;
let testUser2LocationCollection;

function populateDb( done ) {
  homeLocation = new Location( { userId: testUserId, name: 'foo', address: 'bar' } );
  workLocation = new Location( { userId: testUserId2, name: 'work', address: 'place' } );
  testUserLocationCollection = new LocationCollection( { userId: testUserId, locations: [ homeLocation ] } );
  testUser2LocationCollection = new LocationCollection( { userId: testUserId2, locations: [ workLocation ] } );
  homeLocation.save()
  .then( workLocation.save )
  .then( testUserLocationCollection.save )
  .then( testUser2LocationCollection.save )
  .then( () => done() )
  .then( null, ( err ) => done( err ) );
}

describe( 'locations', function() {
  before( function( done ) {
    mongoose.connect( 'mongodb://example.localhost/TestingDB', function( err ) {
      if ( err ) return done( err );
      done();
    } );
  } );

  beforeEach( function( done ) {
    mockgoose.reset( () => populateDb( done ) );
  } );

  describe( '.listLocationsForUser', function() {
    it( 'returns an Array', function() {
      return expect( locations.listLocationsForUser( testUserId ) ).to.eventually.be.an.instanceOf( Array );
    } );

    it( 'returns an array with all current Locations', function( done ) {
      locations.listLocationsForUser( testUserId )
      .then( function( data ) {
        if ( data.length === 1 && data[0].name === homeLocation.name && data[0].address === homeLocation.address ) return done();
        done( `location not found in ${JSON.stringify( data )}` );
      } );
    } );

    it( 'returns an array that does not include Locations from other users', function( done ) {
      locations.listLocationsForUser( testUserId2 )
      .then( function( data ) {
        if ( data.length === 1 && data[0].name !== homeLocation.name && data[0].address !== homeLocation.address ) return done();
        done( `data did not match expected data in ${JSON.stringify( data )}` );
      } );
    } );
  } );
} );
