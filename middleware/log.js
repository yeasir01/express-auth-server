const Event = require('../models/Event');

module.exports = (obj) => {
    
    try {
        let {level, source, description} = obj;
        
        if (typeof obj != "object") {
            throw new Error('Event must be an object.')
        } else if (!level || !source || !description) {
            throw new Error('Event must contain a level, source and description.')
        } else {
            const newEvent = new Event(obj)
            newEvent.save( e => {
                if (e) throw new Error('An error occurred while attempting to save an event.')
            });
        }
    } catch (e) {
        console.error(e)
    }

}