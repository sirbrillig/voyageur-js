const mongoose = require( 'mongoose' );
const mockgoose = require( 'mockgoose' );
const chai = require( 'chai' );
const chaiAsPromised = require( 'chai-as-promised' );
const locations = require( '../app/models/location' );

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
    it( 'removes the location from the database', function() {
      let locationCount = 0;
      return Location.find()
      .then( ( initialData ) => {
        locationCount = initialData.length;
        return locations.removeLocationForUser( testUserId, homeLocation )
      } )
      .then( () => Location.find() )
      .then( function( data ) {
        expect( data ).to.have.length( locationCount - 1 );
      } );
    } );

    it( 'removes the location from the user\'s list', function() {
      return locations.removeLocationForUser( testUserId, homeLocation )
      .then( () => locations.listLocationsForUser( testUserId ) )
      .then( function( data ) {
        expect( data ).to.be.empty;
      } );
    } );

    it( 'does not remove the location if it exists for a different user', function( done ) {
      return locations.removeLocationForUser( testUserId2, homeLocation._id )
      .then( function( data ) {
        done( `expected a rejection, but got ${data}` );
      } )
      .catch( function() {
        done();
      } );
    } );

    it( 'returns the removed location', function() {
      return locations.removeLocationForUser( testUserId, homeLocation._id )
      .then( function( location ) {
        const { name, address } = location;
        expect( name ).to.eql( homeLocation.name );
        expect( address ).to.eql( homeLocation.address );
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

    it( 'does not return the location if it exists for a different user', function( done ) {
      return locations.getLocationForUser( testUserId2, homeLocation._id )
      .catch( function() {
        done();
      } );
    } );
  } );

  describe( '.updateLocationForUser', function() {
    it( 'returns the updated location', function() {
      const newParams = { name: 'updateLocationForUsertest', address: '321 updateLocationForUser' };
      return locations.updateLocationForUser( testUserId, homeLocation._id, newParams )
      .then( function( data ) {
        expect( data ).to.have.property( 'name' ).eql( newParams.name );
        expect( data ).to.have.property( 'address' ).eql( newParams.address );
      } );
    } );

    it( 'updates the location in the database', function() {
      const newParams = { name: 'updateLocationForUsertest', address: '321 updateLocationForUser' };
      return locations.updateLocationForUser( testUserId, homeLocation._id, newParams )
      .then( () => locations.getLocationForUser( testUserId, homeLocation._id ) )
      .then( function( data ) {
        expect( data ).to.have.property( 'name' ).eql( newParams.name );
        expect( data ).to.have.property( 'address' ).eql( newParams.address );
      } );
    } );

    it( 'does not update the location if the location belongs to another user', function( done ) {
      const newParams = { name: 'updateLocationForUsertest', address: '321 updateLocationForUser' };
      return locations.updateLocationForUser( testUserId2, homeLocation._id, newParams )
      .catch( function() {
        done();
      } );
    } );

    it( 'does not update the location _id when updating', function() {
      const newParams = { _id: 'foobar', name: 'updateLocationForUsertest', address: '321 updateLocationForUser' };
      return locations.updateLocationForUser( testUserId, homeLocation._id, newParams )
      .then( function( data ) {
        expect( data ).to.have.property( '_id' ).eql( homeLocation._id );
      } );
    } );

    it( 'does not add non-whitelisted parameters when updating', function() {
      const newParams = { games: 'foobar', name: 'updateLocationForUsertest', address: '321 updateLocationForUser' };
      return locations.updateLocationForUser( testUserId, homeLocation._id, newParams )
      .then( function( data ) {
        expect( data ).to.not.have.property( 'games' );
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
