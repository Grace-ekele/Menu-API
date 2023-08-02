const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  businessName: { 
    type: String, 
    required: true 
},
  address: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    required: true,
    unique: true 
},
menu: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Menu'
}],
  phoneNumber: { 
    type: String, 
    required: true 
},
  password: { 
    type: String, 
    required: true 
},
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
