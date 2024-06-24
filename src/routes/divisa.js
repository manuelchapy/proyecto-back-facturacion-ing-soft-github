const { Router } = require('express');
const ctrlDivisa	= require('../controllers/divisas.controllers');
const router = Router();

router.route('/registroDivisas')
		.get(ctrlDivisa.registroDivisas)

module.exports = router;