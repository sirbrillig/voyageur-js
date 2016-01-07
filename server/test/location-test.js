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
const homeLocation = new Location( { userId: testUserId, name: 'foo', address: 'bar' } );
const testUserLocationCollection = new LocationCollection( { userId: testUserId, locations: [ homeLocation ] } );

function populateDb( done ) {
  homeLocation.save()
  .then( testUserLocationCollection.save )
  .then( () => done() )
  .then( null, ( err ) => done( err ) );
}

describe( 'locations', function() {
  before( function( done ) {
    mongoose.connect( 'mongodb://example.localhost/TestingDB', function( err ) {
      if ( err ) return done( err );
      mockgoose.reset( () => populateDb( done ) );
    } );
  } );

  afterEach( function() {
  } );

  describe( '.listLocationsForUser', function() {
    it( 'returns an Array', function() {
      return expect( locations.listLocationsForUser( testUserId ) ).to.eventually.be.an.instanceOf( Array );
    } );

    it( 'returns an array with all current Locations', function( done ) {
      locations.listLocationsForUser( testUserId )
      .then( function( data ) {
        if ( data.length === 1 && data[0].name === homeLocation.name && data[0].address === homeLocation.address ) return done();
        done( 'location not found' );
      } )
      //return expect( locations.listLocationsForUser( testUserId ) ).to.eventually.have.property( 'address', homeLocation.address );
    } );

    it( 'returns an array that does not include Locations from other users', function() {
      return expect( locations.listLocationsForUser( 'foobar' ) ).to.eventually.not.include( homeLocation );
    } );
  } );
} );
