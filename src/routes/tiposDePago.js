const { Router } = require('express');
const ctrltiposDePago	= require('../controllers/tiposDePago.controllers');
const router = Router();

router.route('/tiposDePago')
		.get(ctrltiposDePago.tiposDePago)

module.exports = router;