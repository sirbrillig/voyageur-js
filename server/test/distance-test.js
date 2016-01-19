import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getDistanceBetween } from '../app/models/distance';
import { connectToDb, disconnectFromDb, resetDb, mockLocations } from './bootstrap';

chai.use( chaiAsPromised );
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
      return getDistanceBetween( mockLocations.homeLocation._id, mockLocations.workLocation._id )
      .then( function( data ) {
        expect( data.distance ).to.eql( '100' );
      } );
    } );

    it( 'fetches the distance between the origin and destination if the distance is not cached' );
  } );
} );
