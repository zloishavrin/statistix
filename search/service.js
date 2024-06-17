const ModeModel = require('./model');

class Service {

    async getAll() {
        const modes = await ModeModel.find();
        return modes;
    }

    async searchByName(searchString) {
        const modes = await ModeModel.find({name: { $regex: searchString, $options: 'i' }});
        return modes;
    }
 
}

module.exports = new Service();