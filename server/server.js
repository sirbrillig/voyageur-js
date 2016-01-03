var express = require( 'express' );
var cors = require( 'cors' );
var app = express();
var jwt = require( 'express-jwt' );
var dotenv = require( 'dotenv' );
var bodyParser = require( 'body-parser' );

dotenv.load();

var authenticate = jwt( {
  secret: new Buffer( process.env.AUTH0_CLIENT_SECRET, 'base64' ),
  audience: process.env.AUTH0_CLIENT_ID
} );

app.use( cors() );
app.use( bodyParser.urlencoded() );
app.use( bodyParser.json() );
app.use( '/secured', authenticate );

var router = express.Router();

router.get( '/ping', function( req, res ) {
  res.status( 200 ).json( { text: "All good. You don't need to be authenticated to call this" } );
} );

router.get( '/secured/ping', function( req, res ) {
  res.status( 200 ).json( { text: "All good. You only get this message if you're authenticated" } );
} )

app.use( '/', router );

var port = process.env.PORT || 3001;

app.listen( port, function() {
  console.log( 'listening in http://localhost:' + port );
} );
