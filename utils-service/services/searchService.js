const ModeModel = require('../models/mode');
const CategoryModel = require('../models/category');

class SearchService {

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

    async getByCategory(categoryId) {
        const modes = await ModeModel.find({category: categoryId});
        return modes;
    }

    async searchAndCategory(searchString, categoryId) {
        const modes = await ModeModel.find({
            name: {
                $regex: searchString,
                $options: 'i'
            },
            category: categoryId
        });
        return modes;
    }
 
}

module.exports = new SearchService();