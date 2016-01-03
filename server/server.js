import express from 'express';
import cors from 'cors';
import jwt from 'express-jwt';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';

import router from './app/routes';

const app = express();

dotenv.load();

mongoose.connect( process.env.MONGO_CLIENT_SERVER );

const authenticate = jwt( {
  secret: new Buffer( process.env.AUTH0_CLIENT_SECRET, 'base64' ),
  audience: process.env.AUTH0_CLIENT_ID
} );

app.use( cors() );
app.use( morgan( 'dev' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( '/secured', authenticate );
app.use( '/', router );

const port = process.env.PORT || 3001;

app.listen( port, () => {
  console.log( 'listening in http://localhost:' + port );
} );
