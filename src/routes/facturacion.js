const { Router } = require('express');
const ctrlFacturacion	= require('../controllers/facturacion.controllers');
const router = Router();

router.route('/')
		.get(ctrlFacturacion.index)

router.route('/facturas')
		.get(ctrlFacturacion.facturas)

router.route('/crearFacturaOrdenTrabajo')
		.post(ctrlFacturacion.crearFacturaOrdenTrabajo)

module.exports = router;
