const mongoose = require("mongoose");
const FAQSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  usage: {
    type: String,
    required: true,
  },
  guarentee: {
    type: String,
    required: true,
  },
  max_utility_time_period: {
    type: String,
    required: true,
  },
  usage_for_all_animals: {
    type: String,
    required: true,
  },
  additional_instruction: {
    type: String,
  },
  vet_doctor_consultation: {
    type: String,
    required: true,
  },
  time_period: {
    type: String,
    required: true,
  },
  reusability: {
    type: String,
    required: true,
  },
  safety: {
    type: String,
    required: true,
  },
  pregnent_animal_usage: {
    type: String,
    required: true,
  },
  instrument: {
    type: String,
    required: true,
  },
});
const Model = mongoose.model("FAQ", FAQSchema);
module.exports = Model;
