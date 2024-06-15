const facturacionCtrl = {};
const connection = require('../database');

facturacionCtrl.facturas = async(req, res) =>{
    const sql = "SELECT tbl_factura.id_factura, tbl_factura.id_estado_factura, date_format(fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cancelacion ,date_format(fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, date_format(fecha_creacion_orden_trabajo, '%d-%m-%Y %T') AS fecha_creacion_orden_trabajo, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_usuario, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_estado_factura.nombre, tbl_tipo_factura.tipo_factura_nombre FROM `tbl_factura` LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_usuario ON tbl_usuario.id_usuario = tbl_factura.id_usuario LEFT JOIN tbl_estado_factura ON tbl_estado_factura.id_estado_factura = tbl_factura.id_estado_factura LEFT JOIN tbl_tipo_factura ON tbl_factura.id_tipo_factura = tbl_tipo_factura.id_tipo_factura WHERE numero_factura > 0 AND (tbl_factura.id_estado_factura = 1 OR tbl_factura.id_estado_factura = 2)";
    let numFact;                                                                                                                                                                                                
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            res.send(result)
        }
    });
}

module.exports = facturacionCtrl;