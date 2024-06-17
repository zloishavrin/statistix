const ModeModel = require('./model');

class Service {

    async getAll() {
        const modes = await ModeModel.findAll();
        return modes;
    }

    async searchByName(searchString) {
        const modes = await ModeModel.findAll({where: {name: {like: `%${searchString}%`}}});
        return modes;
    }
 
}

module.exports = new Service();