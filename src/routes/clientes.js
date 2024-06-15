const { Router } = require('express');
const ctrlCliente	= require('../controllers/clientes.controllers');
const router = Router();

router.route('/clientes')
		.get(ctrlCliente.clientes)

router.route('/crearYEnviarCliente')
		.post(ctrlCliente.crearYEnviarCliente)

router.route('/configCliente')
		.post(ctrlCliente.configCliente)

module.exports = router;