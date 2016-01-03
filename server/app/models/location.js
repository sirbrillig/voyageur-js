var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var LocationSchema = new Schema( {
  userId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
} );

module.exports = mongoose.model( 'Location', LocationSchema );
