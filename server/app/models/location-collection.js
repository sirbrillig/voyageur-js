import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default mongoose.model( 'LocationCollection', new Schema( {
  userId: { type: String, required: true },
  locations: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Location' } ],
} ) );
