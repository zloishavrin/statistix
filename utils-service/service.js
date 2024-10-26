const ModeModel = require('./models/mode');
const CategoryModel = require('./models/category');

class Service {

    async getAll() {
        const modes = await ModeModel.find();
        return modes;
    }

    async getAllCategories() {
        const categories = await CategoryModel.find();
        return categories;
    }

    async searchByName(searchString) {
        const modes = await ModeModel.find({name: { $regex: searchString, $options: 'i' }});
        return modes;
    }
 
}

module.exports = new Service();