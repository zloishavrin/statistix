const searchService = require('../services/searchService');

class SearchController {

    async getAll(req, res, next) {
        try {
            const modes = await searchService.getAll();
            return res.json(modes);
        }
        catch(error) {
            next(error);
        }
    }

    async getAllCategories(req, res, next) {
        try {
            const categories = await searchService.getAllCategories();
            return res.json(categories);
        }
        catch(error) {
            next(error);
        }
    }

    async search(req, res, next) {
        try {
            const searchString = req.params.search;
            if(!searchString) {
                const modes = await searchService.searchByName(' ');
                return res.json(modes);
            }

            const modes = await searchService.searchByName(searchString);
            return res.json(modes);
        }
        catch(error) {
            next(error);
        }
    }

    async getByCategory(req, res, next) {
        try {
            const categoryId = req.params.category;
            if(!categoryId) {
                const modes = await searchService.searchByName(" ");
                return res.json(modes);
            }

            const modes = await searchService.getByCategory(categoryId);
            return res.json(modes);
        }
        catch(error) {
            next(error);
        }
    }

    async searchAndCategory(req, res, next) {
        try {
            const searchString = req.params.search;
            const categoryId = req.params.category;

            if(!searchString || !categoryId) {
                const modes = await searchService.searchByName(" ");
                return res.json(modes);
            }

            const modes = await searchService.searchAndCategory(searchString, categoryId);
            return res.json(modes);
        }
        catch(error) {
            next(error);
        }
    }

}

module.exports = new SearchController();