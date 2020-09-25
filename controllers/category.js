const Category = require('../models/Category');
const errorHandler = require('../utils/errorHandler');
const Position = require('../models/Position');


module.exports.getAll = async (request, response) => {
    try {
        const categories = await Category.find({
            user: request.user.id
        });
        response.status(200).json(categories)
    } catch (e) {
        errorHandler(response, e)
    }
};
module.exports.getById = async (request, response) => {
    try {
        const category = await Category.findById(request.params.id);
        response.status(200).json(category)
    } catch (e) {
        errorHandler(response, e)
    }
};
module.exports.remove = async (request, response) => {
    try {
        await Category.remove({
            _id: request.params.id
        });
        await Position.remove({
            category: request.params.id
        });
        response.status(200).json({
            message: 'Category was deleted.'
        })
    } catch (e) {
        errorHandler(response, e)
    }
};
module.exports.create = async (request, response) => {

        const category = new Category({
            name: request.body.name,
            user: request.user.id,
            image: request.file ? request.file.path : ''
        });
    try {
        await category.save();
        response.status(201).json(category)
    } catch (e) {
        errorHandler(response, e)
    }
};
module.exports.update = async (request, response) => {
    let updated = {
        name: request.body.name,
        image: ''
    };
    if (request.file || request.file.path) {
        updated.image = request.file.path
    }
    try {
        let category = await Category.findOneAndUpdate(
            {_id: request.params.id},
            {$set: updated},
            {new: true}
        );
        response.status(200).json(category)

    } catch (e) {
        errorHandler(response, e)
    }
};
