import mongoose from 'mongoose';
import mockgoose from 'mockgoose';

if ( ! mongoose.isMocked ) {
  mockgoose( mongoose );
}
import Location from '../app/models/location';
import LocationCollection from '../app/models/location-collection';
import TripLocation from '../app/models/trip-location';
import Trip from '../app/models/trip';
import Distance from '../app/models/distance';

export const models = {
  Location,
  LocationCollection,
  TripLocation,
  Trip,
  Distance,
};

export const mockUsers = {
  testUserId: 'testUser',
  testUserId2: 'testUser2',
};

export const mockLocations = {
  homeLocation: null,
  gameLocation: null,
  workLocation: null,
  foodLocation: null,
  teaLocation: null,
};

export const mockDistances = {
  homeWorkDistance: null,
};

export const mockTripLocations = {
  homeTripLocation: null,
  foodTripLocation: null,
  teaTripLocation: null,
};

export const mockLocationCollections = {
  testUserLocationCollection: null,
  testUser2LocationCollection: null,
};

export const mockTrips = {
  testUserTrip: null,
  testUserTrip2: null,
};

export function populateDb( done ) {
  mockLocations.homeLocation = new Location( { userId: mockUsers.testUserId, name: 'foo', address: 'bar' } );
  mockLocations.coffeeLocation = new Location( { userId: mockUsers.testUserId, name: 'coffee', address: 'bar' } );
  mockLocations.beachLocation = new Location( { userId: mockUsers.testUserId, name: 'beach', address: 'bar' } );
  mockLocations.gameLocation = new Location( { userId: mockUsers.testUserId, name: 'games', address: 'funplace' } );
  mockLocations.workLocation = new Location( { userId: mockUsers.testUserId2, name: 'work', address: 'workplace' } );
  mockLocations.foodLocation = new Location( { userId: mockUsers.testUserId2, name: 'food', address: 'foodplace' } );
  mockLocations.teaLocation = new Location( { userId: mockUsers.testUserId2, name: 'tea', address: 'teaplace' } );

  mockTripLocations.homeTripLocation = new TripLocation( { userId: mockUsers.testUserId, location: mockLocations.homeLocation } );
  mockTripLocations.coffeeTripLocation = new TripLocation( { userId: mockUsers.testUserId, location: mockLocations.coffeeLocation } );
  mockTripLocations.beachTripLocation = new TripLocation( { userId: mockUsers.testUserId, location: mockLocations.beachLocation } );
  mockTripLocations.teaTripLocation = new TripLocation( { userId: mockUsers.testUserId2, location: mockLocations.teaLocation } );
  mockTripLocations.foodTripLocation = new TripLocation( { userId: mockUsers.testUserId2, location: mockLocations.foodLocation } );

  mockDistances.homeWorkDistance = new Distance( { userId: mockUsers.testUserId, origin: mockLocations.homeLocation, destination: mockLocations.workLocation, distance: 100 } );
  mockDistances.homeCoffeeDistance = new Distance( { userId: mockUsers.testUserId, origin: mockLocations.homeLocation, destination: mockLocations.coffeeLocation, distance: 600 } );
  mockDistances.coffeeBeachDistance = new Distance( { userId: mockUsers.testUserId, origin: mockLocations.coffeeLocation, destination: mockLocations.beachLocation, distance: 400 } );
  mockDistances.teaFoodDistance = new Distance( { userId: mockUsers.testUserId2, origin: mockLocations.teaLocation, destination: mockLocations.foodLocation, distance: 2000 } );

  mockTrips.testUserTrip = new Trip( { userId: mockUsers.testUserId, tripLocations: [ mockTripLocations.homeTripLocation, mockTripLocations.coffeeTripLocation, mockTripLocations.beachTripLocation ] } );
  mockTrips.testUserTrip2 = new Trip( { userId: mockUsers.testUserId2, tripLocations: [ mockTripLocations.teaTripLocation, mockTripLocations.foodTripLocation ] } );

  mockLocationCollections.testUserLocationCollection = new LocationCollection( { userId: mockUsers.testUserId, locations: [ mockLocations.homeLocation ] } );
  mockLocationCollections.testUser2LocationCollection = new LocationCollection( { userId: mockUsers.testUserId2, locations: [ mockLocations.workLocation, mockLocations.foodLocation, mockLocations.teaLocation ] } );

  mockLocations.homeLocation.save()
  .then( mockLocations.coffeeLocation.save )
  .then( mockLocations.beachLocation.save )
  .then( mockLocations.workLocation.save )
  .then( mockLocations.gameLocation.save )
  .then( mockLocations.foodLocation.save )
  .then( mockLocations.teaLocation.save )
  .then( mockDistances.homeWorkDistance.save )
  .then( mockDistances.homeCoffeeDistance.save )
  .then( mockDistances.coffeeBeachDistance.save )
  .then( mockDistances.teaFoodDistance.save )
  .then( mockTripLocations.homeTripLocation.save )
  .then( mockTripLocations.coffeeTripLocation.save )
  .then( mockTripLocations.beachTripLocation.save )
  .then( mockTripLocations.foodTripLocation.save )
  .then( mockTripLocations.teaTripLocation.save )
  .then( mockLocationCollections.testUserLocationCollection.save )
  .then( mockLocationCollections.testUser2LocationCollection.save )
  .then( mockTrips.testUserTrip.save )
  .then( mockTrips.testUserTrip2.save )
  .then( () => done() )
  .then( null, ( err ) => done( err ) );
}

export function connectToDb( done ) {
  mongoose.connect( 'mongodb://example.localhost/TestingDB', function( err ) {
    if ( err ) return done( err );
    done();
  } );
}

export function disconnectFromDb() {
  mongoose.disconnect();
}

export function resetDb( done ) {
  mockgoose.reset( () => populateDb( done ) );
}