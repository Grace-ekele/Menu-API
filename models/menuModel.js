const mongoose = require('mongoose');


const menuSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
    name: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: true
    },
    itemImage: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
  
});

module.exports = mongoose.model('Menu', menuSchema);
