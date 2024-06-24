const { Router } = require('express');
const ctrlBancos	= require('../controllers/bancos.controllers');
const router = Router();

router.route('/bancos')
		.get(ctrlBancos.bancos)

module.exports = router;