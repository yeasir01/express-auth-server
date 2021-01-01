"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'manager'],
        default: 'user'
    },
    resetToken: {
        type: String,
        required: false
    },
    geoLocation: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
},{
    timestamps: true
});

UserSchema.pre('save', function(next) {

    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            
            next()
        });
    });
});

UserSchema.methods.comparePassword = function(userPassword, cb) {
    bcrypt.compare(userPassword, this.password, function(err, isMatch) {
        if (err) return cb(err, false);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);