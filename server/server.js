var express = require( 'express' );
var cors = require( 'cors' );
var app = express();
var jwt = require( 'express-jwt' );
var dotenv = require( 'dotenv' );
var bodyParser = require( 'body-parser' );
var mongoose = require( 'mongoose' );
var morgan = require( 'morgan' );

var router = require( './app/routes' );

dotenv.load();

mongoose.connect( process.env.MONGO_CLIENT_SERVER );

var authenticate = jwt( {
  secret: new Buffer( process.env.AUTH0_CLIENT_SECRET, 'base64' ),
  audience: process.env.AUTH0_CLIENT_ID
} );

app.use( cors() );
app.use( morgan( 'dev' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( '/secured', authenticate );
app.use( '/', router );

var port = process.env.PORT || 3001;

app.listen( port, function() {
  console.log( 'listening in http://localhost:' + port );
} );
