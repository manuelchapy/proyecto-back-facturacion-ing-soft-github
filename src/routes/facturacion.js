const { Router } = require('express');
const ctrlFacturacion	= require('../controllers/facturacion.controllers');
const router = Router();

router.route('/')
		.get(ctrlFacturacion.index)

router.route('/facturas')
		.get(ctrlFacturacion.facturas)

router.route('/crearFacturaOrdenTrabajo')
		.post(ctrlFacturacion.crearFacturaOrdenTrabajo)

router.route('/ordenesImpresion/:id_factura')
		.get(ctrlFacturacion.ordenesImpresion)

router.route('/imprimirFactura/:id_factura/:id_tipo_factura')
		.get(ctrlFacturacion.imprimirFactura)

router.route('/buscarFactura')
		.post(ctrlFacturacion.buscarFactura)

module.exports = router;
