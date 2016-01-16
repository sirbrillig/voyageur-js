const mongoose = require( 'mongoose' );
const mockgoose = require( 'mockgoose' );
const chai = require( 'chai' );
const chaiAsPromised = require( 'chai-as-promised' );
const tripLocations = require( '../app/models/trip-location' );

chai.use( chaiAsPromised );
const expect = chai.expect;

if ( ! mongoose.isMocked ) {
  mockgoose( mongoose );
}
const Location = require( '../app/models/location' ).default;
const LocationCollection = require( '../app/models/location-collection' ).default;
const TripLocation = require( '../app/models/trip-location' ).default;
const Trip = require( '../app/models/trip' ).default;

const testUserId = 'testUser';
const testUserId2 = 'testUser2';
let homeLocation;
let homeTripLocation;
let gameLocation;
let workLocation;
let foodLocation;
let teaLocation;
let foodTripLocation;
let teaTripLocation;
let testUserLocationCollection;
let testUser2LocationCollection;
let testUserTrip;
let testUserTrip2;

function populateDb( done ) {
  homeLocation = new Location( { userId: testUserId, name: 'foo', address: 'bar' } );
  gameLocation = new Location( { userId: testUserId, name: 'games', address: 'funplace' } );
  workLocation = new Location( { userId: testUserId2, name: 'work', address: 'workplace' } );
  foodLocation = new Location( { userId: testUserId2, name: 'food', address: 'foodplace' } );
  teaLocation = new Location( { userId: testUserId2, name: 'tea', address: 'teaplace' } );
  homeTripLocation = new TripLocation( { userId: testUserId, location: homeLocation } );
  teaTripLocation = new TripLocation( { userId: testUserId2, location: teaLocation } );
  foodTripLocation = new TripLocation( { userId: testUserId2, location: foodLocation } );
  testUserTrip = new Trip( { userId: testUserId, tripLocations: [ homeTripLocation ] } );
  testUserTrip2 = new Trip( { userId: testUserId2, tripLocations: [ teaTripLocation, foodTripLocation ] } );
  testUserLocationCollection = new LocationCollection( { userId: testUserId, locations: [ homeLocation ] } );
  testUser2LocationCollection = new LocationCollection( { userId: testUserId2, locations: [ workLocation, foodLocation, teaLocation ] } );
  homeLocation.save()
  .then( workLocation.save )
  .then( gameLocation.save )
  .then( foodLocation.save )
  .then( teaLocation.save )
  .then( foodTripLocation.save )
  .then( teaTripLocation.save )
  .then( testUserLocationCollection.save )
  .then( testUser2LocationCollection.save )
  .then( testUserTrip.save )
  .then( testUserTrip2.save )
  .then( () => done() )
  .then( null, ( err ) => done( err ) );
}

describe( 'tripLocations', function() {
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

  describe( '.listTripLocationsForUser', function() {
    it( 'returns an Array', function() {
      return expect( tripLocations.listTripLocationsForUser( testUserId ) ).to.eventually.be.an.instanceOf( Array );
    } );

    it( 'returns an array with all current TripLocations', function() {
      tripLocations.listTripLocationsForUser( testUserId2 )
      .then( function( data ) {
        expect( data.map( x => x.location ) ).to.equal( testUserTrip2.tripLocations.map( x => x.location ) );
      } );
    } );

    it( 'returns an array that does not include TripLocations from other users', function() {
      tripLocations.listTripLocationsForUser( testUserId )
      .then( function( data ) {
        expect( data ).to.be.empty;
      } );
    } );
  } );

  describe( '.addLocationToTrip', function() {
    it( 'creates a new TripLocation with the parameters specified', function() {
      const params = { location: gameLocation._id };
      tripLocations.addLocationToTrip( testUserId, params )
      .then( function( data ) {
        expect( data.location ).to.equal( params.location );
      } );
    } );

    it( 'creates a new TripLocation without non-whitelisted parameters', function() {
      const params = { foo: 'bar', location: gameLocation._id };
      tripLocations.addLocationToTrip( testUserId, params )
      .then( function( data ) {
        expect( data.foo ).to.not.exist;
      } );
    } );

    it( 'adds the TripLocation to the end of the user\'s list', function() {
      const params = { location: workLocation._id };
      tripLocations.addLocationToTrip( testUserId2, params )
      .then( () => tripLocations.listTripLocationsForUser( testUserId ) )
      .then( function( data ) {
        const last = data[ data.length - 1 ];
        expect( last.location ).to.equal( params.location );
      } );
    } );
  } );

  describe( '.removeTripLocationForUser', function() {
    it( 'removes the TripLocation from the database', function() {
      let locationCount = 0;
      return TripLocation.find()
      .then( ( initialData ) => {
        locationCount = initialData.length;
        return tripLocations.removeTripLocationForUser( testUserId2, teaTripLocation )
      } )
      .then( () => TripLocation.find() )
      .then( function( data ) {
        expect( data ).to.have.length( locationCount - 1 );
      } );
    } );

    it( 'removes the TripLocation from the user\'s trip', function() {
      return tripLocations.removeTripLocationForUser( testUserId2, teaTripLocation )
      .then( () => tripLocations.listTripLocationsForUser( testUserId ) )
      .then( function( data ) {
        expect( data ).to.be.empty;
      } );
    } );

    it( 'does not remove the TripLocation if it exists for a different user', function( done ) {
      return tripLocations.removeTripLocationForUser( testUserId, teaTripLocation._id )
      .then( function( data ) {
        done( `expected a rejection, but got ${data}` );
      } )
      .catch( function() {
        done();
      } );
    } );

    it( 'returns the removed TripLocation', function() {
      return tripLocations.removeTripLocationForUser( testUserId2, teaTripLocation._id )
      .then( function( tripLocation ) {
        expect( tripLocation.location ).to.eql( teaTripLocation.location._id );
      } );
    } );
  } );

  describe( '.getTripLocationForUser', function() {
    it( 'returns the TripLocation if it exists for a user', function() {
      return tripLocations.getTripLocationForUser( testUserId2, teaTripLocation._id )
      .then( function( data ) {
        expect( data ).to.have.property( '_id' ).eql( teaTripLocation._id );
        expect( data.location ).to.eql( teaTripLocation.location._id );
      } );
    } );

    it( 'does not return the location if it exists for a different user', function( done ) {
      return tripLocations.getTripLocationForUser( testUserId, teaTripLocation._id )
      .catch( function() {
        done();
      } );
    } );
  } );

  describe( '.updateTripForUser', function() {
    it( 'returns re-ordered TripLocations', function() {
      const ids = [ foodTripLocation._id, teaTripLocation._id ];
      expect( tripLocations.updateTripForUser( testUserId2, ids ) ).to.eventually.eql( ids );
    } );

    it( 're-orders existing TripLocations', function( done ) {
      const ids = [ foodTripLocation._id, teaTripLocation._id ];
      tripLocations.updateTripForUser( testUserId2, ids )
      .then( () => tripLocations.listTripLocationsForUser( testUserId2 ) )
      .then( function( data ) {
        const newIds = data.map( loc => loc._id );
        if ( newIds.toString() === ids.toString() ) return done();
        done( `TripLocations were not re-ordered; expected ${ids.toString()}, got ${newIds.toString()}` );
      } );
    } );

    it( 'does not re-order collection if params include a duplicate TripLocation ID', function() {
      const ids = [ foodTripLocation._id, teaTripLocation._id, teaTripLocation._id ];
      const oldIds = [ teaTripLocation._id, foodTripLocation._id ];
      expect( tripLocations.updateTripForUser( testUserId2, ids ) ).to.eventually.eql( oldIds );
    } );

    it( 'does not re-order collection if params do not include all TripLocation IDs', function() {
      const ids = [ foodTripLocation._id ];
      const oldIds = [ teaTripLocation._id, foodTripLocation._id ];
      expect( tripLocations.updateTripForUser( testUserId2, ids ) ).to.eventually.eql( oldIds );
    } );

    it( 'does not re-order collection if params include a TripLocation ID for another user', function() {
      const ids = [ foodTripLocation._id, homeTripLocation._id ];
      const oldIds = [ teaTripLocation._id, foodTripLocation._id ];
      expect( tripLocations.updateTripForUser( testUserId2, ids ) ).to.eventually.eql( oldIds );
    } );
  } );
} );

