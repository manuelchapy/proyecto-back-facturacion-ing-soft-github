const clienteCtrl = {};
const connection = require('../database');

clienteCtrl.clientes = async(req, res) =>{
    console.log('EN CLIENTES!!!!!!!!!!!!!!!!')
    const sql = "SELECT * FROM `tbl_cliente` WHERE estatus = 1";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result clientes: ', result)
		res.send(result);
	})
};

clienteCtrl.crearYEnviarCliente = async(req, res) =>{
    ///////////////AGREGAR CLIENTE///////////////////
    console.log('PASO A AGREGAR')
    connection.query('INSERT INTO `tbl_cliente` SET?', {
        cliente_nombre: req.body.cliente_nombre,
        cliente_apellido: req.body.cliente_apellido,
        cedula_RIF: req.body.cedula_RIF,
        correo: req.body.correo,
        telefono: req.body.telefono,
        descuento_fijo: req.body.descuento_fijo,
        id_tipo_cliente: req.body.id_tipo_cliente,
        estatus: 1
    }, (err, result) => {
        if (err) {
            console.log('no se pudo a agregar', err)
            res.send('ERROR EN AGREGAR USUARIO!')
        } else {
            //console.log('agrego!!', result)
            const sql = "SELECT * FROM `tbl_cliente` WHERE cedula_RIF = '" + req.body.cedula_RIF+"'";
            // const sql = "SELECT * FROM `tbl_examen` WHERE id_examen = '" + req.body.id_examen + "'";
             
             connection.query(sql, function (err, result, fie) {
                 if (err) {
                     console.log('error en la conexion intente de nuevo', err)
                     res.send('3')
                 }
                 //console.log('el result examen: ', result)
                 res.send(result);
             })
        }
    });
    ////////////////////////////////////////////////
}

clienteCtrl.configCliente = async(req, res) =>{
    if(req.body.num == 1){
                ///////////////AGREGAR CLIENTE///////////////////
                console.log('PASO A AGREGAR!!!!!!!!!!!!!!!!!!!!!!!!', req.body)
                connection.query('INSERT INTO `tbl_cliente` SET?', {
                    cliente_nombre: req.body.cliente_nombre,
                    cliente_apellido: req.body.cliente_apellido,
                    cedula_Rif: req.body.cedula_RIF,
                    correo: req.body.correo,
                    telefono: req.body.telefono,
                    descuento_fijo: req.body.descuento_fijo,
                    id_tipo_cliente: req.body.id_tipo_cliente,
                    estatus: 1
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR USUARIO!')
                    } else {
                        //console.log('agrego!!', result)
                        res.send('1')
                    }
                });
                ////////////////////////////////////////////////
    }else if(req.body.num == 2){
        /////////////////////////MODIFICAR CLIENTE////////////////////////////
            console.log('EL REQUEST DESDE CLIENTE', req.body)
            const sql = "SELECT id_cliente FROM `tbl_cliente` WHERE id_cliente='"+req.body.id_cliente+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    console.log('EL RESULT DESDE CLIENTE', result)
                    let query=result[0].id_cliente;
                    console.log('el result!!!!!!!!!!!!!!!!!!!!!!!!', query);
                    modificar(query)
                }
            });

            function modificar(query){
                console.log('nomnbre!!!', req.body.cliente_nombre)
                const sql = "UPDATE tbl_cliente SET cliente_nombre = '" + req.body.cliente_nombre + "', cliente_apellido = '" + req.body.cliente_apellido + "', cedula_Rif = '" + req.body.cedula_RIF + "', correo = '" + req.body.correo + "', telefono = '" + req.body.telefono + "', descuento_fijo = '" + req.body.descuento_fijo + "', id_tipo_cliente = '" + req.body.id_tipo_cliente + "' WHERE id_cliente= '"+query+"'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        console.log('Usuario Modificado')
                        res.send('1')
                    }
                })
            }
        //////////////////////////////////////////////////////////////////////
    }else if(req.body.num == 3){
        ///////////////ANULAR CLIENTE///////////////////
        //const sql = "DELETE FROM tbl_cliente WHERE cedula_Rif = '" + req.body.cedula_Rif + "'";
        //console.log('EL CLIENTE ANULADO', req.body)
        const sql = "UPDATE tbl_cliente SET estatus = 0 WHERE id_cliente= '"+req.body.id_cliente+"'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                console.log('CLIENTE ANULADO')
                res.send('ANULADO!')
            }
        })
        //////////////////////////////////////////////////
    }else if(req.body.num == 4){
        ///////////////ACTIVAR CLIENTE///////////////////
        const sql = "UPDATE tbl_cliente SET estatus = 1 WHERE id_cliente= '"+req.body.id_cliente+"'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                console.log('CLIENTE ANULADO')
                res.send('ACTIVADO!')
            }
        })
        //////////////////////////////////////////////////
    }
}

module.exports = clienteCtrl;