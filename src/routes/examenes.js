const { Router } = require('express');
const ctrlExamenes	= require('../controllers/examenes.controllers');
const router = Router();

router.route('/examenes')
		.get(ctrlExamenes.examenes)

module.exports = router;