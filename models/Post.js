const mongoose = require("mongoose");
const { Schema, model } = mongoose

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  age: {
    type: Number,
    
  },
  gender: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  bodySize: {
    type: String,
    required: true,
  },
  hairLength: {
    type: String,
    required: true,
  },
  spayedNeutered: {
    type: String,
    required: true,
  },
  vaccinations: {
    type: String,
    required: true,
  },
  specialNeeds: {
    type: String,
    required: true,
  },
  houseTrained: {
    type: String,
    required: true,
  },
  goodWithKids: {
    type: String,
    required: true,
  },
  goodWithAnimals: {
    type: String,
    required: true,
  },
  adoptionCenter: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  sellerEmail: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true
  },
  savedBy: [{
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }],

});

module.exports = mongoose.model("Post", PostSchema);
