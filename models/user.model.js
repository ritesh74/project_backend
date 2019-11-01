const jwt = require('jsonwebtoken');
const joi = require('joi');
const mongoose = require('mongoose');
const config = require('../config');


const UserSchema = new moongoose.UserSchema({
    name: {
        type: String,
        minlength:3,
        maxlength:20,
        required: true
    },
    email:{
        tyoe: String,
        require: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    }, 
    password: {
        type: String,
        minlength:3,
        maxlength:20,
        require:true,
    },
    isAdmin: Boolean
});

// creat jwt authentication function
UserSchema.methods.generateAuthToken = () => {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.secret);
    return token;
}

//create a user
const User = mongoose.model('User', UserSchema);

function ValidateUser(user) {
    const schema = {
        name: joi.string().minlength(3).maxlength(20).required(),
        email: joi.string().minlength(5).maxlength(255).required().email(),
        password: joi.string().minlength(3).maxlength(20).required()
    }

    return joi.validate(user, schema);
}

exports.User = User;
exports.validate = ValidateUser;
