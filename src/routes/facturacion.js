const { Router } = require('express');
const ctrlFacturacion	= require('../controllers/facturacion.controllers');
const router = Router();

router.route('/facturas')
		.get(ctrlFacturacion.facturas)

module.exports = router;
