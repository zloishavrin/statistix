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

    async search(req, res, next) {
        try {
            const searchString = req.params.search;
            if(!searchString) {
                throw ApiError.BadRequestError('Укажите search');
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