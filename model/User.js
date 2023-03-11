const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    fullName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    profilePicture: {
        type: String,
        default: 'https://i.ibb.co/vvJtH0D/blank-profile-picture-973460-640.png'
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin']
        }
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    },
    resetToken: String,
    resetTokenExpiration: Date
})

module.exports = mongoose.model('User', userSchema);