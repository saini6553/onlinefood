const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const { Schema } = mongoose;

const makerschema = new Schema({
  name: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  avatar: { type: String },
  id: { type: Schema.ObjectId, index: true }
}, { _id: false });

const wearerschema = new Schema({
  name: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  avatar: { type: String },
  id: { type: Schema.ObjectId, index: true }
}, { _id: false });

const mediaSchema = new Schema({
  type: { type: String, enum: ['image', 'video'] },
  url: { type: String },
  uploadedBy: { type: String, enum: ['maker', 'wearer'] }
}, {
  timestamps: true
}, { _id: false });

const priceScema = new Schema({
  netPrice: { type: String },
  discountPercentage: { type: String },
  serviceFee: { type: String },
  total: { type: String },
  status: { type: String, required: true, enum: ['paid', 'pending', 'fail'] }
}, { _id: false });

const ProjectSchema = new Schema({
  name: { type: String },
  maker: makerschema,
  wearer: wearerschema,
  referrer: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  session: { type: Object },
  media: [mediaSchema],
  price: [priceScema],
  state: { type: String },
  status: { type: String, required: true, enum: ['waiting-garment', 'in-progress', 'posted-back', 'completed', 'cancelled', 'active'] }
}, { timestamps: true });

ProjectSchema.plugin(mongoosePaginate);
const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;
