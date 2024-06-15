const pacienteCtrl = {};
const connection = require('../database');

pacienteCtrl.pacientes = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_paciente` WHERE estatus = 1";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        console.log('el result examen: ', result[0])
		res.send(result);
	})
};

pacienteCtrl.buscarPacientePorCedula = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_paciente` WHERE paciente_cedula='"+req.body.paciente_cedula+"'";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
        if(result <= 0){
            res.send('0');
        }else{
            res.send(result);
        }
		
	})
};

pacienteCtrl.crearYEnviarPaciente = async(req, res) =>{
                        ///////////////AGREGAR CLIENTE///////////////////
                        console.log('PASO A AGREGARXXXXXXXXXXXXXXXXXXXXXX', req.body)
                        connection.query('INSERT INTO `tbl_paciente` SET?', {
                            paciente_nombre: req.body.paciente_nombre,
                            paciente_apellido: req.body.paciente_apellido,
                            paciente_cedula: req.body.paciente_cedula,
                            edad: req.body.edad,
                            genero: req.body.genero,
                            peso: req.body.peso,
                            medicamentos: req.body.medicamentos,
                            patologias: req.body.patologias,
                            paciente_telefono: req.body.paciente_telefono,
                            estatus: 1
                        }, (err, result) => {
                            if (err) {
                                //console.log('no se pudo a agregar', err)
                                res.send('ERROR EN AGREGAR PACIENTE!')
                            } else {
                                console.log('agrego!!', result)
                                const sql = "SELECT * FROM `tbl_paciente` WHERE paciente_cedula = '" + req.body.paciente_cedula+"'";
                                // const sql = "SELECT * FROM `tbl_examen` WHERE id_examen = '" + req.body.id_examen + "'";
                                 
                                 connection.query(sql, function (err, result, fie) {
                                     if (err) {
                                         console.log('error en la conexion intente de nuevo', err)
                                         res.send('3')
                                     }
                                     console.log('el result examen: ', result)
                                     res.send(result[0]);
                                 })
                            }
                        });
                        ////////////////////////////////////////////////
}

pacienteCtrl.generos = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_genero`";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
}

pacienteCtrl.configPaciente = async(req, res) =>{
    if(req.body.num == 1){
                ///////////////AGREGAR CLIENTE///////////////////
                console.log('PASO A AGREGAR!!!!!!!', req.body)
                connection.query('INSERT INTO `tbl_paciente` SET?', {
                    paciente_nombre: req.body.paciente_nombre,
                    paciente_apellido: req.body.paciente_apellido,
                    paciente_cedula: req.body.paciente_cedula,
                    edad: req.body.edad,
                    genero: req.body.genero,
                    peso: req.body.peso,
                    paciente_telefono: req.body.paciente_telefono,
                    medicamentos: req.body.medicamentos,
                    patologias: req.body.patologias
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR PACIENTE!')
                    } else {
                        console.log('agrego!!', result)
                        res.send('AGREGO PACIENTE!')
                    }
                });
                ////////////////////////////////////////////////
    }else if(req.body.num == 2){
        /////////////////////////MODIFICAR CLIENTE////////////////////////////
            const sql = "SELECT id_paciente FROM `tbl_paciente` WHERE id_paciente='"+req.body.id_paciente+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    let query=result[0].id_paciente;
                    console.log('el result!!!!!!!!!!!!!!!!!!!!!!!!', query);
                    modificar(query)
                }
            });

            function modificar(query){
                console.log('nomnbre!!!', query)
                const sql = "UPDATE tbl_paciente SET paciente_nombre = '" + req.body.paciente_nombre + "', paciente_apellido = '" + req.body.paciente_apellido + "', paciente_cedula = '" + req.body.paciente_cedula + "', edad = '" + req.body.edad + "', genero = '" + req.body.genero + "', peso = '" + req.body.peso + "', paciente_telefono = '"+req.body.paciente_telefono+"', medicamentos = '"+req.body.medicamentos+"', patologias = '"+req.body.patologias+"' WHERE id_paciente= '"+query+"'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        console.log('paciente Modificado')
                        res.send('paciente modificado!')
                    }
                })
            }
        //////////////////////////////////////////////////////////////////////
    }else if(req.body.num == '3'){
        ///////////////ANULAR PACIENTE///////////////////
        const sql = "UPDATE tbl_paciente SET estatus = 0 WHERE id_paciente = '" + req.body.id_paciente + "'"
        
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                console.log('paciente anulado')
                res.send('ANULADO!')
            }
        })
        //////////////////////////////////////////////////
    }else if(req.body.num == '4'){
        ///////////////ACTIVAR PACIENTE///////////////////
        const sql = "UPDATE tbl_paciente SET estatus = 1 WHERE id_paciente = '" + req.body.id_paciente + "'"
        
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                console.log('paciente anulado')
                res.send('ACTIVADO!')
            }
        })
        //////////////////////////////////////////////////
    }
}


module.exports = pacienteCtrl;