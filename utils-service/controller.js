const mongoose = require('mongoose');
const ApiError = require('./exception');
const service = require('./service');

class Controller {

    async getAll(req, res, next) {
        try {
            const modes = await service.getAll();
            return res.json(modes);
        }
        catch(error) {
            next(error);
        }
    }

    async getAllCategories(req, res, next) {
        try {
            const categories = await service.getAllCategories();
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
                const modes = await service.searchByName(' ');
                return res.json(modes);
            }

            const modes = await service.searchByName(searchString);
            return res.json(modes);
        }
        catch(error) {
            next(error);
        }
    }

}

module.exports = new Controller();