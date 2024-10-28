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

    async getByCategory(req, res, next) {
        try {
            const categoryId = req.params.category;
            if(!categoryId) {
                const modes = await service.searchByName(" ");
                return res.json(modes);
            }

            const modes = await service.getByCategory(categoryId);
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
                const modes = await service.searchByName(" ");
                return res.json(modes);
            }

            const modes = await service.searchAndCategory(searchString, categoryId);
            return res.json(modes);
        }
        catch(error) {
            next(error);
        }
    }

}

module.exports = new Controller();