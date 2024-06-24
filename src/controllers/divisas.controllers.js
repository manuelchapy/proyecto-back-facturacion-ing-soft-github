const divisaCtrl = {};
const session = require('express-session');
const connection = require('../database');

divisaCtrl.registroDivisas = async(req, res) =>{
	const sql = "SELECT a.tasa_actual, a.id_registro_divisa, a.id_divisa, c.divisa_nombre FROM tbl_registro_divisa a INNER JOIN tbl_divisa c ON c.id_divisa = a.id_divisa WHERE id_registro_divisa = (SELECT MAX(id_registro_divisa) FROM `tbl_registro_divisa` b WHERE a.id_divisa = b.id_divisa)"
	connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		let divisas = {};
		divisas.registroDivisas = result;
		res.send(divisas);
	})
};

module.exports = divisaCtrl;