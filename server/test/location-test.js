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
let foodLocation;
let teaLocation;
let testUserLocationCollection;
let testUser2LocationCollection;

function populateDb( done ) {
  homeLocation = new Location( { userId: testUserId, name: 'foo', address: 'bar' } );
  workLocation = new Location( { userId: testUserId2, name: 'work', address: 'workplace' } );
  foodLocation = new Location( { userId: testUserId2, name: 'food', address: 'foodplace' } );
  teaLocation = new Location( { userId: testUserId2, name: 'tea', address: 'teaplace' } );
  testUserLocationCollection = new LocationCollection( { userId: testUserId, locations: [ homeLocation ] } );
  testUser2LocationCollection = new LocationCollection( { userId: testUserId2, locations: [ workLocation, foodLocation, teaLocation ] } );
  homeLocation.save()
  .then( workLocation.save )
  .then( foodLocation.save )
  .then( teaLocation.save )
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
        if ( data.some( ( loc ) => {
          return ( loc.name !== homeLocation.name && loc.address !== homeLocation.address );
        } ) ) return done();
        done( `data did not match expected data in ${JSON.stringify( data )}` );
      } );
    } );
  } );

  describe( '.createNewLocationForUser', function() {
    it( 'creates a new location with the parameters specified', function( done ) {
      const params = { name: 'createNewLocationForUsertest', address: '1234 address place' };
      locations.createNewLocationForUser( testUserId, params )
      .then( function( data ) {
        if ( data.name === params.name && data.address === params.address ) return done();
        done( `location not returned, instead got: ${JSON.stringify( data )}` );
      } );
    } );

    it( 'creates a new location without non-whitelisted parameters', function( done ) {
      const params = { foo: 'bar', name: 'createNewLocationForUsertest', address: '1234 address place' };
      locations.createNewLocationForUser( testUserId, params )
      .then( function( data ) {
        if ( ! data.foo ) return done();
        done( `location included non-whitelisted parameter, instead got: ${JSON.stringify( data )}` );
      } );
    } );

    it( 'adds the location to the end of the user\'s list', function( done ) {
      const params = { name: 'createNewLocationForUsertest', address: '1234 address place' };
      locations.createNewLocationForUser( testUserId, params )
      .then( () => locations.listLocationsForUser( testUserId ) )
      .then( function( data ) {
        const lastLocation = data[ data.length - 1 ];
        if ( lastLocation.name === params.name && lastLocation.address === params.address ) return done();
        done( `expected new location added to end of locations, instead last location was ${JSON.stringify( lastLocation )}` );
      } );
    } );
  } );

  describe( '.removeLocationForUser', function() {
    it( 'removes the location from the database', function( done ) {
      let locationCount = 0;
      Location.find()
      .then( ( initialData ) => {
        locationCount = initialData.length;
        return locations.removeLocationForUser( testUserId, homeLocation )
      } )
      .then( () => Location.find() )
      .then( function( data ) {
        if ( data.length === ( locationCount - 1 ) ) return done();
        done( `expected location to be deleted but got ${JSON.stringify( data )}` );
      } );
    } );

    it( 'removes the location from the user\'s list', function( done ) {
      locations.removeLocationForUser( testUserId, homeLocation )
      .then( () => locations.listLocationsForUser( testUserId ) )
      .then( function( data ) {
        if ( data.length === 0 ) return done();
        done( `expected empty locations but got ${JSON.stringify( data )}` );
      } );
    } );
  } );

  describe( '.getLocationForUser', function() {
    it( 'returns the location if it exists for a user', function() {
      return locations.getLocationForUser( testUserId, homeLocation._id )
      .then( function( data ) {
        expect( data ).to.have.property( '_id' ).eql( homeLocation._id );
        expect( data ).to.have.property( 'name' ).eql( homeLocation.name );
        expect( data ).to.have.property( 'address' ).eql( homeLocation.address );
      } );
    } );

    it( 'does not return the location if it exists for a different user', function() {
      return locations.getLocationForUser( testUserId2, homeLocation._id )
      .then( function( data ) {
        expect( data ).to.be.not.ok;
      } );
    } );
  } );

  describe( '.updateLocationListForUser', function() {
    it( 'returns re-ordered locations', function() {
      const ids = [ foodLocation._id, teaLocation._id, workLocation._id ];
      expect( locations.updateLocationListForUser( testUserId2, ids ) ).to.eventually.eql( ids );
    } );

    it( 're-orders existing locations', function( done ) {
      const ids = [ foodLocation._id, teaLocation._id, workLocation._id ];
      locations.updateLocationListForUser( testUserId2, ids )
      .then( () => locations.listLocationsForUser( testUserId2 ) )
      .then( function( data ) {
        const newIds = data.map( loc => loc._id );
        if ( newIds.toString() === ids.toString() ) return done();
        done( `locations were not re-ordered; expected ${ids.toString()}, got ${newIds.toString()}` );
      } );
    } );

    it( 'does not re-order collection if params include a duplicate location ID', function() {
      const ids = [ foodLocation._id, foodLocation._id, workLocation._id ];
      const oldIds = [ workLocation._id, foodLocation._id, teaLocation._id ];
      expect( locations.updateLocationListForUser( testUserId2, ids ) ).to.eventually.eql( oldIds );
    } );

    it( 'does not re-order collection if params do not include all location IDs', function() {
      const ids = [ foodLocation._id, workLocation._id ];
      const oldIds = [ workLocation._id, foodLocation._id, teaLocation._id ];
      expect( locations.updateLocationListForUser( testUserId2, ids ) ).to.eventually.eql( oldIds );
    } );

    it( 'does not re-order collection if params include a location ID for another user', function() {
      const ids = [ teaLocation._id, foodLocation._id, homeLocation._id ];
      const oldIds = [ workLocation._id, foodLocation._id, teaLocation._id ];
      expect( locations.updateLocationListForUser( testUserId2, ids ) ).to.eventually.eql( oldIds );
    } );
  } );
} );
