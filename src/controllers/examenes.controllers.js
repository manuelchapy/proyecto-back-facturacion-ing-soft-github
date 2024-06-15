const examenesCtrl = {};
const session = require('express-session');
const connection = require('../database');

examenesCtrl.examenes = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT tbl_examen.id_examen, tbl_examen.examen_codigo, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_examen.examen_referencia, tbl_departamento.departamento_nombre, tbl_categoria.categoria_nombre FROM `tbl_examen` INNER JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_examen.id_departamento INNER JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_examen.id_categoria WHERE estatus = 1 AND tbl_examen.examen_precio > 0";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

module.exports = examenesCtrl;


