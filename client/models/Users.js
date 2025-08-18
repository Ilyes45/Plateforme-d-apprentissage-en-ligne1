//1- require mongoose
const mongoose = require('mongoose');


//2- create schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    cloudinary_id:{
        type: String

    } ,
     role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user' 
},
registeredAt: {
        type: Date,
        default: Date.now,
  }

})
//3- create model
const User = mongoose.model('User', userSchema);

//4- export model
module.exports = User;
