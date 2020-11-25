const express = require('express');
const passport = require('passport');
const router = express.Router();
const controller = require('../controllers/analytic');

router.get('/overview', passport.authenticate('jwt', { session: false }), controller.overview);
router.get('/analytics', passport.authenticate('jwt', { session: false }), controller.analytics);

module.exports = router;