const Event = require('../models/Event');

module.exports = (obj) => {
    
    try {
        let {level, source, description} = obj;
        
        if (!level || !source || !description) {
            throw new Error('unable to save event, information is either missing or incomplete.')
        } else if (typeof obj != "object") {
            throw new Error('event must be an object!')
        } else {
            const newEvent = new Event(obj)
            newEvent.save( err => {
                if (err) throw new Error('an error occurred while attempting to save an event.')
            });
        }
    } catch (err) {
        console.error(err)
    }

}