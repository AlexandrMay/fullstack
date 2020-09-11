module.exports = (response, error) => {
    response.status(500).json({message: error.message ? error.message : error})
};
