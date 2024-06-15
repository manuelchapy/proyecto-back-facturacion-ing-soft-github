const { Router } = require('express');
const ctrlCultivo	= require('../controllers/cultivos.controllers');
const router = Router();

router.route('/cultivos')
		.get(ctrlCultivo.cultivos)

module.exports = router;