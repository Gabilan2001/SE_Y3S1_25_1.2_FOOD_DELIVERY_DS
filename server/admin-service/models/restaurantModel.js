import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
