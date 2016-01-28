import request from 'supertest';
import express from 'express';
import router from '../../app/routes';
import bodyParser from 'body-parser';
import { connectToDb, disconnectFromDb, resetDb, mockUsers, mockLocations } from '../bootstrap';
import chai from 'chai';

const expect = chai.expect;
const app = express();

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( ( req, res, next ) => {
  req.user = { sub: req.query.user };
  next();
} );
app.use( '/', router );

describe( 'GET /secured/locations', function() {
  before( function( done ) {
    connectToDb( done );
  } );

  after( function() {
    disconnectFromDb();
  } );

  beforeEach( function( done ) {
    resetDb( done );
  } );

  it( 'returns an array with all current locations', function() {
    return request( app )
    .get( '/secured/locations' )
    .query( { user: mockUsers.testUserId } )
    .expect( 200 )
    .expect( res => {
      expect( res.body ).to.have.length( 1 );
      expect( res.body[0].name ).to.eql( mockLocations.homeLocation.name );
      expect( res.body[0].address ).to.eql( mockLocations.homeLocation.address );
    } );
  } );

  it( 'returns an array that does not include Locations from other users', function() {
    return request( app )
    .get( '/secured/locations' )
    .query( { user: mockUsers.testUserId2 } )
    .expect( 200 )
    .expect( res => {
      expect( res.body.some( loc => loc.name === mockLocations.homeLocation.name ) ).to.be.false;
    } );
  } );
} );

describe( 'POST /secured/locations', function() {
  before( function( done ) {
    connectToDb( done );
  } );

  after( function() {
    disconnectFromDb();
  } );

  beforeEach( function( done ) {
    resetDb( done );
  } );

  it( 'creates a new location with the parameters specified', function() {
    const params = { name: 'createNewLocationForUsertest', address: '1234 address place' };
    return request( app )
    .post( '/secured/locations' )
    .query( { user: mockUsers.testUserId } )
    .send( params )
    .expect( 200 )
    .expect( res => {
      expect( res.body.name ).to.be.eql( params.name );
      expect( res.body.address ).to.be.eql( params.address );
    } );
  } );

  it( 'creates a new location without non-whitelisted parameters', function() {
    const params = { foo: 'bar', name: 'createNewLocationForUsertest', address: '1234 address place' };
    return request( app )
    .post( '/secured/locations' )
    .query( { user: mockUsers.testUserId } )
    .send( params )
    .expect( 200 )
    .expect( res => {
      expect( res.body.foo ).to.not.be.ok;
    } );
  } );

  it( 'adds the location to the end of the user\'s list', function( done ) {
    const params = { name: 'createNewLocationForUsertest', address: '1234 address place' };
    return request( app )
    .post( '/secured/locations' )
    .query( { user: mockUsers.testUserId } )
    .send( params )
    .end( () => {
      return request( app )
      .get( '/secured/locations' )
      .query( { user: mockUsers.testUserId } )
      .end( ( err, res ) => {
        const last = res.body[ res.body.length - 1 ];
        if ( last.name === params.name ) return done();
      } );
    } );
  } );
} );
