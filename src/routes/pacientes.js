const { Router } = require('express');
const ctrlPaciente	= require('../controllers/pacientes.controllers');
const router = Router();

router.route('/pacientes')
		.get(ctrlPaciente.pacientes)

router.route('/crearYEnviarPaciente')
		.post(ctrlPaciente.crearYEnviarPaciente)

router.route('/generos')
		.get(ctrlPaciente.generos)

router.route('/buscarPacientePorCedula')
		.post(ctrlPaciente.buscarPacientePorCedula)	

router.route('/configPaciente')
		.post(ctrlPaciente.configPaciente)


module.exports = router;