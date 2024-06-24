const tiposDePagoCtrl = {};
const session = require('express-session');
const connection = require('../database');

tiposDePagoCtrl.tiposDePago = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT * FROM tbl_tipo_pago";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

module.exports = tiposDePagoCtrl;