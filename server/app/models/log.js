import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default mongoose.model( 'Log', new Schema( {
  userId: { type: String },
  event: { type: String, required: true },
  data: { type: Object },
  msg: { type: String },
  level: { type: Number, required: true },
  name: { type: String, required: true },
  hostname: { type: String },
  pid: { type: String },
  v: { type: String },
  time: { type: Date, required: true },
  res: { type: Object },
  req: { type: Object },
} ) );
