import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LocationSchema = new Schema( {
  userId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
} );

export default mongoose.model( 'Location', LocationSchema );
