const express = require('express');
const router = express.Router();
const controller = require('../controllers/category');
const passport = require('passport');
const upload = require('../middleware/upload');

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll);
router.get('/:id', controller.getById);
router.delete('/:id', controller.remove);
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.create);
router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.update);

module.exports = router;
