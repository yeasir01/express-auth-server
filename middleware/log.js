const Event = require('../models/Event');

module.exports = (obj) => {
    
    try {
        
        if (typeof obj != "object") {
            throw new Error('Event must be an object.')
        } else if (!obj.level || !obj.source || !obj.description) {
            throw new Error('Event must contain a level, source and description.')
        } else {

            obj.debug = JSON.stringify(obj.debug);
            obj.geoLocation = JSON.stringify(obj.geoLocation);

            let new_event = new Event(obj)

            new_event.save( e => {
                if (e) {
                    console.log(e)
                    throw new Error('An error was thrown while attempting to save an event.')
                }
            });
        }
    } catch (e) {
        console.error(e);
    };

};