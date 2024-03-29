const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true['Fullname is required'],
    },
    email: {
        type: String,
        required: true['Email is required'],
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true['Phone number is required'],
    },
    password: {
        type: String,
        required: true['Password is required'],
    },
    cashBack: { 
        type: Number, 
        default: 0 
    }, 
    cashBackToggle: { 
        type: Boolean, 
        default: false 
    }, 
    orders: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order' 
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const userModel = mongoose.model('Users', userSchema);

module.exports = userModel