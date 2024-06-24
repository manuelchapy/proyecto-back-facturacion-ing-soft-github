const { Router } = require('express');
const ctrlDocumentos	= require('../controllers/documentos.controllers');
const router = Router();

router.route('/documentos')
		.get(ctrlDocumentos.documentos)

module.exports = router;