"use strict";

const Event = require('../models/Event');

module.exports = async (event) => {

    try {
        if (typeof event !== "object") {
            throw new Error('You may only log events as an object.')
        } else if (!event.level || !event.source || !event.description) {
            throw new Error('Event must contain a level, source and description.')
        } else {
            event.debug = JSON.stringify(event.debug);
            event.geoLocation = JSON.stringify(event.geoLocation);

            let new_record = new Event(event)
            return await new_record.save()
        }
    } catch (e) {
        console.log(e);
    };

};