const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');


module.exports.getByCategoryId = async (request, response) => {
    try{
        const positions = await Position.find({
            category: request.params.categoryId,
            user: request.user.id
        });
        response.status(200).json(positions)
    } catch (e) {
        errorHandler(response, e);
    }
};
module.exports.create = async (request, response) => {
    try{
        const position = await new Position({
            name: request.body.name,
            cost: request.body.cost,
            category: request.body.category,
            user: request.user.id
        }).save();
        response.status(201).json(position)
    } catch (e) {
        errorHandler(response, e);
    }
};
module.exports.update = async (request, response) => {
    try{
        const position = await Position.findOneAndUpdate({
            _id: request.params.id
        }, {
            $set: request.body
        }, {
            new: true
        });
        response.status(200).json(position)
    } catch (e) {
        errorHandler(response, e);
    }
};
module.exports.remove = async (request, response) => {
    try{
        await Position.remove({
            _id: request.params.id
        });
        response.status(200).json({message: 'Position was removed.'})
    } catch (e) {
        errorHandler(response, e);
    }
};
