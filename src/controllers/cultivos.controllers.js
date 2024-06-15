const cultivoCtrl = {};
const session = require('express-session');
const connection = require('../database');


cultivoCtrl.cultivos = async(req, res) =>{
    //console.log('sesion por login', session.user)
    const sql = "SELECT tbl_cultivo.id_cultivo, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_precio, tbl_cultivo.cultivo_codigo, tbl_departamento.departamento_nombre, tbl_categoria.categoria_nombre FROM `tbl_cultivo` INNER JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_cultivo.id_departamento INNER JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_cultivo.id_categoria WHERE estatus = 1";
    //const sql = "SELECT * FROM tbl_cultivo WHERE estatus = 1";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

module.exports = cultivoCtrl;