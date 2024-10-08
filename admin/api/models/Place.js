const mongoose = require("mongoose");

const linkClickSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  url: String,
  count: { type: Number, default: 0 }
});

const placeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  address: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
  price: Number,
  publishDate: Date,
  viewersCount: { type: Number, default: 0 },
  linkClicks: [
    {
      url: String,
      count: { type: Number, default: 0 },
    },
  ],
});

const PlaceModel = mongoose.model("Place", placeSchema);

module.exports = PlaceModel;
