"use strict";

const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    level: {
        type: String,
        enum: ['info', 'error', "warning"],
        required: true
    },
    source: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    debug: {
        type: String,
        required: false
    },
    user: {
        type: String,
        default: 'system',
        required: true
    },
    geoLocation: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Event', EventSchema);