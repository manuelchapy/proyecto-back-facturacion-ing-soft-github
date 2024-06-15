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

facturacionCtrl.crearFacturaOrdenTrabajo = async(req, res) =>{
    console.log("///////////////////////////////////////////////////////////////////////////", req.body.pacientes[0].examenes)
    //////////1 decontado
    //////////2 credito
    //////////3 orden de trabajo
    //console.log('/////////////////////////////////////////')
    //console.log(req.body)
    //console.log('/////////////////////////////////////////')
    //console.log('FACTURACION!', req.body.pacientes[0].examenes)
    //console.log("LO SIENTO BB", DATETIME)
    
    //console.log('EN FACTURACION', req.body)
    
    if(req.body.id_tipo_factura == 1 || req.body.id_tipo_factura == 2){
        //console.log(req.body.pagos);
        ///////////////////SI ES FACTURA///////////////////////
        let sumaPesos = 0;
        let sumaDolares = 0;
        let sumaBolivares = 0;
        let sumaPesosVueltos = 0;
        let sumaDolaresVueltos = 0;
        let sumaBolivaresVueltos = 0;
        let sumaPesosIGTF = 0; 
        let sumaDolaresIGTF = 0;
        let sumaBolivaresIGTF = 0;
        //console.log('EN RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
        ////////////////////CONVERTIR PESOS A DOLARES////////////////////////
        for(const item of req.body.pagos){
            //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCC", item.igtf_pago)
            /////////////////////////////////SUMATORIA DE PAGOS//////////////////////////////////
            if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
                sumaDolares = sumaDolares + item.monto;
            }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 0){
                sumaPesos = sumaPesos + item.monto
                //console.log("SUMA PESOS!!!", sumaPesos)
            }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
            //console.log("!!!!!!", item.monto)
                sumaBolivares = sumaBolivares + item.monto;
            }   
            //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
            if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
                sumaDolaresVueltos = sumaDolaresVueltos + item.monto;
            }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 1){
                sumaPesosVueltos = sumaPesosVueltos + item.monto
                //console.log("SUMA PESOS VUELTOS!!!", sumaPesosVueltos)
            }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
            //console.log("!!!!!!", item.monto)
                sumaBolivaresVueltos = sumaBolivaresVueltos + item.monto;
            }
            //////////////////////////////SUMATORIA DE IGTF//////////////////////////////////////
            if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 1){
                sumaDolaresIGTF = sumaDolaresIGTF + item.monto;
            }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 1){
                sumaPesosIGTF = sumaPesosIGTF + item.monto
                //console.log("SUMA PESOS IGTF!!!", sumaPesosIGTF)
            }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 1){
            //console.log("!!!!!!", item.monto)
                sumaBolivaresIGTF = sumaBolivaresIGTF + item.monto;
            }      
        }
   
        let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
        let totalDolares = 0;
        let dolaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let bolivaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let conversionDolarBolivar = 0;
        let vueltosPesosToDolares = 0, vueltosBolivaresToDolares = 0;
        let sumaBolivaresToDolares = 0, sumaPesosToDolares = 0;
        let igtfBolivaresToDolares = 0, igtfPesosToDolares = 0;
        let dolaresTotales = 0, vueltosDolaresTotales = 0, igtfDolarTotal = 0;

        vueltosPesosToDolares = sumaPesosVueltos / req.body.tasa_pesos_dia;
        sumaPesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
        igtfPesosToDolares = sumaPesosIGTF / req.body.tasa_pesos_dia;

        vueltosBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        sumaBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        igtfBolivaresToDolares = sumaBolivaresIGTF / req.body.tasa_bolivar_dia;

        
        dolaresTotales = sumaPesosToDolares + sumaBolivaresToDolares + sumaDolares;
        vueltosDolaresTotales = sumaDolaresVueltos + vueltosPesosToDolares + vueltosBolivaresToDolares;
        igtfDolarTotal = sumaDolaresIGTF + igtfBolivaresToDolares + igtfPesosToDolares;

        if(vueltosPesosToDolares > 0  || vueltosBolivaresToDolares > 0 || sumaDolaresVueltos > 0){
            dolaresRedondeado = Number(Math.round((dolaresTotales - vueltosDolaresTotales - igtfDolarTotal)+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia
        }else{
            dolaresRedondeado = Number(Math.round(dolaresTotales+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia;
        }
        
        
        req.body.bolivaresRedondeado = Number(Math.round(bolivaresRedondeado+ "e+2") + "e-2");
        req.body.dolaresRedondeado = Number(Math.round(dolaresRedondeado+ "e+2") + "e-2");

        const sql = "SELECT * FROM `tbl_numero_factura_tmp`";
        let numFact;
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                numFact=result[0].numero_factura;
                crearFactura(numFact)
            }
        });

        async function crearFactura(numFact){
            //console.log('PASO A AGREGAR!!!!!!!', req.body)
            //console.log("888888888888888888888888888888888888888888888888888888888888888888888888", req.body.bolivaresRedondeado, req.body.dolaresRedondeado)
            if(req.body.id_tipo_factura == 1){
                let time = new Date(new Date().toLocaleString("en-US", {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }));
                    connection.query('INSERT INTO `tbl_factura` SET?', {
                        numero_factura: numFact,
                        id_cliente: req.body.id_cliente,
                        total_bolivares: req.body.total_bolivares,
                        total_dolares: req.body.total_dolares,
                        total_pesos: req.body.total_pesos,
                        descuento_bolivares: req.body.descuento_bolivares,
                        descuento_dolares: req.body.descuento_dolares,
                        descuento_pesos: req.body.descuento_pesos,
                        tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                        tasa_pesos_dia: req.body.tasa_pesos_dia,
                        IGTF_bolivares: req.body.IGTF_bolivares,
                        IGTF_dolares: req.body.IGTF_dolares, 
                        IGTF_pesos: req.body.IGTF_pesos,
                        base_imponible_bolivares: req.body.bolivaresRedondeado,
                        base_imponible_dolares: req.body.dolaresRedondeado,
                        debe_dolares: 0,
                        id_tipo_factura: req.body.id_tipo_factura,
                        id_usuario: req.body.id_usuario,
                        id_estado_factura: 1,
                        fecha_creacion_orden_trabajo: null,
                        fecha_creacion_factura: time,
                        fecha_cancelacion: time,
                        impreso: 1,
                        factura_qr: config.URL+uniqid()
                    }, (err, result) => {
                        if (err) {
                            console.log('no se pudo a agregar', err)
                            res.send('ERROR EN AGREGAR FACTURA!')
                        } else {
                            //console.log('agrego!!', result)
                            //res.send('AGREGO FACTURA!')
                            update(numFact, 1);
                        }
                    });
                
                
            }else if(req.body.id_tipo_factura == 2){
                let debe = 0;
                let montoPago = 0;
                let time = new Date(new Date().toLocaleString("en-US", {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }));

                let sumaDolares = 0, sumaPesos = 0, sumaBolivares = 0;
                let nombreDivisa;
                let pesosToDolares;
                let bsToDolares;
                let montoPagoDolaresTotal;
                let montoPagoDolaresTotalRedondeado;
                for(const itemPago of req.body.pagos){
                    //console.log("--------------------------------------", itemPago)
                    nombreDivisa = await getNombreDivisa(nombreDivisa, itemPago.id_registro_divisa)
                    if(nombreDivisa == "DOLARES" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                        sumaDolares = sumaDolares + itemPago.monto;
                    }else if(nombreDivisa == "PESOS"  && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                        sumaPesos = sumaPesos + itemPago.monto;
                    }else if(nombreDivisa == "BOLIVARES"  && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                       sumaBolivares =sumaBolivares + itemPago.monto;
                    }
                }
                pesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
                bsToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
                montoPagoDolaresTotal = pesosToDolares + bsToDolares + sumaDolares;
                montoPagoDolaresTotalRedondeado = Number(Math.round(montoPagoDolaresTotal + "e+2") + "e-2")
                //console.log(itemPago.monto);
                debe = req.body.total_dolares - montoPagoDolaresTotalRedondeado;
                //console.log("!!!!!!!!!!!!!!!!!!!XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", debe, montoPagoDolaresTotalRedondeado)
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    numero_factura: numFact,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: req.body.total_bolivares,
                    total_dolares: req.body.total_dolares,
                    total_pesos: req.body.total_pesos,
                    descuento_bolivares: req.body.descuento_bolivares,
                    descuento_dolares: req.body.descuento_dolares,
                    descuento_pesos: req.body.descuento_pesos,
                    tasa_pesos_dia: req.body.tasa_pesos_dia,
                    tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                    debe_dolares: debe - req.body.descuento_dolares, 
                    IGTF_bolivares: req.body.IGTF_bolivares,
                    IGTF_dolares: req.body.IGTF_dolares, 
                    IGTF_pesos: req.body.IGTF_pesos,
                    id_tipo_factura: req.body.id_tipo_factura,
                    id_usuario: req.body.id_usuario,
                    id_estado_factura: 2,
                    fecha_creacion_orden_trabajo: null,
                    fecha_cancelacion: null,
                    fecha_creacion_factura: time,
                    base_imponible_bolivares: req.body.bolivaresRedondeado,
                    base_imponible_dolares: req.body.dolaresRedondeado,
                    impreso: 1,
                    factura_qr: config.URL+uniqid()
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO FACTURA!')
                        update(numFact, 1);
                    }
                });
            }
            
        }

        function update(numFact){
            const sqlUpdate = "UPDATE `tbl_numero_factura_tmp` SET numero_factura = numero_factura + 1 WHERE id_numero_factura = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de factura aumentado!')
                    //res.send('sea agrego factura y numero de factura aumentado!')
                    //detallesDeFactura(numFact);
                    extraerFactura(numFact);
                }
            })
        }
        ///////////////////////////////////////////////////////
    }
    else if(req.body.id_tipo_factura == 3){
        //////////////////SI ES ORDEN DE TRABAJO//////////////////////
        const sql = "SELECT * FROM `tbl_numero_orden_trabajo_tmp`";
        let numNC;
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                numNC=result[0].numero_orden_trabajo;
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result)
                crearFactura(numNC)
            }
        });

        async function crearFactura(numNC){
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            /*console.log('!!!!!!!!!!!!!!!!!!!!!!TIME', new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })))*/
            let sumaDolares = 0, sumaPesos = 0, sumaBolivares = 0;
            let nombreDivisa;
            let pesosToDolares;
            let bsToDolares;
            let montoPagoDolaresTotal;
            let montoPagoDolaresTotalRedondeado;
            let sumaPesosVueltos = 0;
            let sumaDolaresVueltos = 0;
            let sumaBolivaresVueltos = 0;
            let sumaPesosIGTF = 0; 
            let sumaDolaresIGTF = 0;
            let sumaBolivaresIGTF = 0;
            for(const itemPago of req.body.pagos){
                //console.log("--------------------------------------", itemPago)
                nombreDivisa = await getNombreDivisa(nombreDivisa, itemPago.id_registro_divisa)
                if(nombreDivisa == "DOLARES" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                    sumaDolares = sumaDolares + itemPago.monto;
                }else if(nombreDivisa == "PESOS" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                    sumaPesos = sumaPesos + itemPago.monto;
                }else if(nombreDivisa == "BOLIVARES" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                   sumaBolivares =sumaBolivares + itemPago.monto;
                }
                //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
                if(itemPago.divisa_nombre == "DOLARES" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                    sumaDolaresVueltos = sumaDolaresVueltos + itemPago.monto;
                }else if(itemPago.divisa_nombre == "PESOS" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                    sumaPesosVueltos = sumaPesosVueltos + (itemPago.monto / req.body.tasa_pesos_dia);
                }else if(itemPago.divisa_nombre == "BOLIVARES" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                //console.log("!!!!!!", itemPago.monto)
                    sumaBolivaresVueltos = sumaBolivaresVueltos + itemPago.monto;
                }   
                //////////////////////////////SUMATORIA DE IGTF//////////////////////////////////////
                if(itemPago.divisa_nombre == "DOLARES" && itemPago.igtf_pago == '1'){
                    sumaDolaresIGTF = sumaDolaresIGTF + itemPago.monto;
                }else if(itemPago.divisa_nombre == "PESOS" && itemPago.igtf_pago == '1'){
                    sumaPesosIGTF = sumaPesosIGTF + (itemPago.monto / req.body.tasa_pesos_dia);
                }else if(itemPago.divisa_nombre == "BOLIVARES" && itemPago.igtf_pago == '1'){
                //console.log("!!!!!!", itemPago.monto)
                    sumaBolivaresIGTF = sumaBolivaresIGTF + itemPago.monto;
                }  
            }
            pesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
            bsToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
            montoPagoDolaresTotal = pesosToDolares + bsToDolares + sumaDolares;
            montoPagoDolaresTotalRedondeado = Number(Math.round(montoPagoDolaresTotal + "e+2") + "e-2")
            debe = req.body.total_dolares - montoPagoDolaresTotalRedondeado;
            if(sumaPesosVueltos > 0){
                sumaPesos = sumaPesos - sumaPesosVueltos - sumaPesosIGTF;
            }else{
                sumaPesos = sumaPesos
            }
            let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
            let totalDolares;
            let dolaresRedondeado; //LA BASE IMPONIBLE EN IGTF
            let bolivaresRedondeado; //LA BASE IMPONIBLE EN IGTF
            let conversionDolarBolivar;
            if(sumaDolaresVueltos > 0){
                sumaDolares = sumaDolares - sumaDolaresVueltos - sumaDolaresIGTF;
            }else{
                sumaDolares = sumaDolares
            }
            
            sumaBolivares = sumaBolivares - sumaBolivaresVueltos - sumaBolivaresIGTF;
            totalDolares = pesosConvertidos + sumaDolares;
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", /*sumaDolares*/ totalDolares, sumaPesos);
            dolaresRedondeado = Number(Math.round((totalDolares)+ "e+2") + "e-2");
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", /*sumaDolares*/ sumaBolivares);
            ///////////////////CONVIRTIENDO DOLARES//////////////////////////
            conversionDolarBolivar = ((totalDolares) * req.body.tasa_bolivar_dia)
            //totalBolivares = conversionDolarBolivar + sumaBolivares;
            bolivaresRedondeado = Number(Math.round((conversionDolarBolivar)+ "e+2") + "e-2");

            req.body.bolivaresRedondeado = bolivaresRedondeado;
            req.body.dolaresRedondeado = dolaresRedondeado;
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", totalBolivares, bolivaresRedondeado);
            //console.log('PASO A AGREGAR!!!!!!!', req.body)
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    orden_trabajo: numNC,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: req.body.total_bolivares,
                    total_dolares: req.body.total_dolares,
                    total_pesos: req.body.total_pesos,
                    descuento_bolivares: req.body.descuento_bolivares,
                    descuento_dolares: req.body.descuento_dolares,
                    descuento_pesos: req.body.descuento_pesos,
                    tasa_pesos_dia: req.body.tasa_pesos_dia,
                    tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                    debe_dolares: 0,
                    id_tipo_factura: req.body.id_tipo_factura,
                    IGTF_bolivares: req.body.IGTF_bolivares,
                    IGTF_dolares: req.body.IGTF_dolares, 
                    IGTF_pesos: req.body.IGTF_pesos,
                    base_imponible_bolivares: req.body.bolivaresRedondeado,
                    base_imponible_dolares: req.body.dolaresRedondeado,
                    id_usuario: req.body.id_usuario,
                    id_estado_factura: 1,
                    fecha_creacion_factura: null,
                    fecha_creacion_orden_trabajo: time,
                    fecha_cancelacion: null,
                    impreso: 1,
                    factura_qr: config.URL+uniqid()
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO FACTURA!')
                        update(numNC, 3);
                    }
                });
        }

        function update(numNC, tip){
            const sqlUpdate = "UPDATE `tbl_numero_orden_trabajo_tmp` SET numero_orden_trabajo = numero_orden_trabajo + 1 WHERE id_orden_trabajo = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de orden de trabajo aumentado!')
                    //res.send('sea agrego factura con orden de trabajo y numero de orden de trabajo aumentado!')
                    extraerIdOrdenTrabajo(numNC);
                }
            })
        }

        function extraerIdOrdenTrabajo(num){
            const sql = "SELECT id_factura FROM `tbl_factura` WHERE orden_trabajo='" +num+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result[0].id_factura);
                    let factura = result[0].id_factura
                    detallesDeFactura(factura)
                }
            });
        }
        //////////////////////////////////////////////////////////////
    }    
    else if(req.body.id_tipo_factura == 5){
        //////////////////SI ES ORDEN DE TRABAJO A CREDITO//////////////////////
        const sql = "SELECT * FROM `tbl_numero_orden_trabajo_tmp`";
        let numNC;
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate 1', err);
                res.send('3');
            }
            if(result){
                numNC=result[0].numero_orden_trabajo;
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result)
                crearFactura(numNC)
            }
        });

        async function crearFactura(numNC){
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            /*console.log('!!!!!!!!!!!!!!!!!!!!!!TIME', new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })))*/
            let sumaDolares = 0, sumaPesos = 0, sumaBolivares = 0;
            let nombreDivisa;
            let pesosToDolares;
            let bsToDolares;
            let montoPagoDolaresTotal;
            let montoPagoDolaresTotalRedondeado;
            let sumaPesosVueltos = 0;
            let sumaDolaresVueltos = 0;
            let sumaBolivaresVueltos = 0;
            let sumaPesosIGTF = 0; 
            let sumaDolaresIGTF = 0;
            let sumaBolivaresIGTF = 0;
            for(const itemPago of req.body.pagos){
                //console.log("--------------------------------------", itemPago)
                nombreDivisa = await getNombreDivisa(nombreDivisa, itemPago.id_registro_divisa)
                if(nombreDivisa == "DOLARES" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                    sumaDolares = sumaDolares + itemPago.monto;
                }else if(nombreDivisa == "PESOS" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                    sumaPesos = sumaPesos + itemPago.monto;
                }else if(nombreDivisa == "BOLIVARES" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                   sumaBolivares =sumaBolivares + itemPago.monto;
                }
                //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
                if(itemPago.divisa_nombre == "DOLARES" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                    sumaDolaresVueltos = sumaDolaresVueltos + itemPago.monto;
                }else if(itemPago.divisa_nombre == "PESOS" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                    sumaPesosVueltos = sumaPesosVueltos + (itemPago.monto / req.body.tasa_pesos_dia);
                }else if(itemPago.divisa_nombre == "BOLIVARES" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                //console.log("!!!!!!", itemPago.monto)
                    sumaBolivaresVueltos = sumaBolivaresVueltos + itemPago.monto;
                }   
                //////////////////////////////SUMATORIA DE IGTF//////////////////////////////////////
                if(itemPago.divisa_nombre == "DOLARES" && itemPago.igtf_pago == '1'){
                    sumaDolaresIGTF = sumaDolaresIGTF + itemPago.monto;
                }else if(itemPago.divisa_nombre == "PESOS" && itemPago.igtf_pago == '1'){
                    sumaPesosIGTF = sumaPesosIGTF + (itemPago.monto / req.body.tasa_pesos_dia);
                }else if(itemPago.divisa_nombre == "BOLIVARES" && itemPago.igtf_pago == '1'){
                //console.log("!!!!!!", itemPago.monto)
                    sumaBolivaresIGTF = sumaBolivaresIGTF + itemPago.monto;
                }  
            }
            pesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
            bsToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
            montoPagoDolaresTotal = pesosToDolares + bsToDolares + sumaDolares;
            montoPagoDolaresTotalRedondeado = Number(Math.round(montoPagoDolaresTotal + "e+2") + "e-2")
            debe = req.body.total_dolares - montoPagoDolaresTotalRedondeado;
            //console.log("ERRRRR DEBE", debe)
            if(sumaPesosVueltos > 0){
                sumaPesos = sumaPesos - sumaPesosVueltos - sumaPesosIGTF;
            }else{
                sumaPesos = sumaPesos
            }
            let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
            let totalDolares;
            let dolaresRedondeado; //LA BASE IMPONIBLE EN IGTF
            let bolivaresRedondeado; //LA BASE IMPONIBLE EN IGTF
            let conversionDolarBolivar;
            if(sumaDolaresVueltos > 0){
                sumaDolares = sumaDolares - sumaDolaresVueltos - sumaDolaresIGTF;
            }else{
                sumaDolares = sumaDolares
            }
            
            sumaBolivares = sumaBolivares - sumaBolivaresVueltos - sumaBolivaresIGTF;
            totalDolares = pesosConvertidos + sumaDolares;
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", /*sumaDolares*/ totalDolares, sumaPesos);
            dolaresRedondeado = Number(Math.round((totalDolares)+ "e+2") + "e-2");
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", /*sumaDolares*/ sumaBolivares);
            ///////////////////CONVIRTIENDO DOLARES//////////////////////////
            conversionDolarBolivar = ((totalDolares) * req.body.tasa_bolivar_dia)
            //totalBolivares = conversionDolarBolivar + sumaBolivares;
            bolivaresRedondeado = Number(Math.round((conversionDolarBolivar)+ "e+2") + "e-2");

            req.body.bolivaresRedondeado = bolivaresRedondeado;
            req.body.dolaresRedondeado = dolaresRedondeado;
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", totalBolivares, bolivaresRedondeado);
            //console.log('PASO A AGREGAR!!!!!!!', req.body)
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    orden_trabajo: numNC,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: req.body.total_bolivares,
                    total_dolares: req.body.total_dolares,
                    total_pesos: req.body.total_pesos,
                    descuento_bolivares: req.body.descuento_bolivares,
                    descuento_dolares: req.body.descuento_dolares,
                    descuento_pesos: req.body.descuento_pesos,
                    tasa_pesos_dia: req.body.tasa_pesos_dia,
                    tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                    debe_dolares: debe,
                    id_tipo_factura: req.body.id_tipo_factura,
                    IGTF_bolivares: req.body.IGTF_bolivares,
                    IGTF_dolares: req.body.IGTF_dolares, 
                    IGTF_pesos: req.body.IGTF_pesos,
                    base_imponible_bolivares: req.body.bolivaresRedondeado,
                    base_imponible_dolares: req.body.dolaresRedondeado,
                    id_usuario: req.body.id_usuario,
                    id_estado_factura: 2,
                    fecha_creacion_factura: null,
                    fecha_creacion_orden_trabajo: time,
                    fecha_cancelacion: null,
                    impreso: 1,
                    factura_qr: config.URL+uniqid()
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO FACTURA!')
                        update(numNC, 3);
                    }
                });
        }

        function update(numNC, tip){
            const sqlUpdate = "UPDATE `tbl_numero_orden_trabajo_tmp` SET numero_orden_trabajo = numero_orden_trabajo + 1 WHERE id_orden_trabajo = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de orden de trabajo aumentado!')
                    //res.send('sea agrego factura con orden de trabajo y numero de orden de trabajo aumentado!')
                    extraerIdOrdenTrabajo(numNC);
                }
            })
        }

        function extraerIdOrdenTrabajo(num){
            const sql = "SELECT id_factura FROM `tbl_factura` WHERE orden_trabajo='" +num+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate 2', err);
                    res.send('3');
                }
                if(result){
                    //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result[0].id_factura);
                    let factura = result[0].id_factura
                    detallesDeFactura(factura)
                }
            });
        }
        //////////////////////////////////////////////////////////////
    }

    async function getNombreDivisa(nombre, idRegistroDivisa){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_divisa.id_divisa, tbl_divisa.divisa_nombre FROM tbl_registro_divisa INNER JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_divisa.id_registro_divisa ='" +idRegistroDivisa+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate 3', err);
                    res.send('3');
                }
                if(result){
                    //console.log("ERROR DEL FUTURO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result, idRegistroDivisa, nombre)
                    nombre = result[0].divisa_nombre;
                    resolve(nombre);
                }
            });
        })
    }

    function extraerFactura(num){
        //console.log('EN EXTRAER FACTRUAAAAAAAAAAAAAAAAAAAAA', num)
        const sql = "SELECT id_factura FROM `tbl_factura` WHERE numero_factura='" +num+"'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate 4', err);
                res.send('3');
            }
            if(result){
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result[0].id_factura);
                let factura = result[0].id_factura
                detallesDeFactura(factura)
            }
        });
    }

    function detallesDeFactura(factura){
        //console.log('EN DETALLES DE FACTURA', req.body.pacientes)
        //console.log('LA FACTURA', factura)
        let pacientesExamenesREQ = req.body.pacientes
        let memory = 0;
        for(let i=0; i<pacientesExamenesREQ.length; i++){
            for(let j=0; j<pacientesExamenesREQ[i].examenes.length; j++){
                memory++;
            }   
        }
        let myValues = new Array(memory);
        //console.log('MEMORIA DE MEMORY', memory);
        for(let i=0; i<memory; i++){
            myValues[i] = new Array(7);
        }

        //console.log('LA MEMORY DEL ARRAY MYVALUES', myValues)

        //PARA LA SUMATORIA EN VALUES
        let r = 0;
        for(let i=0; i<pacientesExamenesREQ.length; i++){
            //console.log('PASO i', i)
            for(let j=0; j<pacientesExamenesREQ[i].examenes.length; j++){
                //console.log('PASO j', j)
                //console.log('EL ID DEL PACIENTE',pacientesExamenesREQ[i].id_paciente)
                let key = Object.keys(pacientesExamenesREQ[i].examenes[j])[0].toString()
                //console.log(pacientesExamenesREQ[i].examenes[j])
                //console.log('!!', key);
                //console.log("00000000000000000000000000", pacientesExamenesREQ[i].examenes[j].nombre)
                if(key == "id_examen"){
                    //console.log('ESTAS ES UN EXAMEN')
                    myValues[r][0]= factura,
                    myValues[r][1]= null,
                    myValues[r][2]= pacientesExamenesREQ[i].id_paciente,
                    myValues[r][3]= pacientesExamenesREQ[i].examenes[j].id_examen,
                    myValues[r][4]= null,
                    myValues[r][5]= pacientesExamenesREQ[i].examenes[j].nombre,
                    myValues[r][6] = pacientesExamenesREQ[i].examenes[j].precio
                }else if(key == "id_cultivo"){
                    //console.log('ESTAS ES UN CULTIVO')
                    myValues[r][0]= factura,
                    myValues[r][1]= null,
                    myValues[r][2]= pacientesExamenesREQ[i].id_paciente,
                    myValues[r][3]= null,
                    myValues[r][4]= pacientesExamenesREQ[i].examenes[j].id_cultivo,
                    myValues[r][5]= pacientesExamenesREQ[i].examenes[j].nombre,
                    myValues[r][6] = pacientesExamenesREQ[i].examenes[j].precio
                }  
                r++;
            }
        }
        //console.log('LOS VALUES', myValues);
        const sql = 'INSERT INTO tbl_detalle_factura_paciente (id_factura, id_registro_convenio, id_paciente, id_examen, id_cultivo, nombre_especifico, precio) VALUES?';
        connection.query(sql, [myValues], (err, result) => {
            if (err) {
                console.log('no se pudo a agregar', err)
                res.send('ERROR!')
            } else {
                //console.log('agrego!!', result)
                //res.send('AGREGO!');
                detallesFiscales(factura);
            }
        });
        
    }

    function detallesFiscales(factura){
        let pagos = req.body.pagos;
        let memory = pagos.length;
        //console.log('LOS PAGOS', pagos);
        let myValues = new Array(memory);
        //console.log('MEMORIA DE MEMORY', memory);
        let fecha_creacion = new Date(new Date().toLocaleString("en-US", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }));
        
        for(let i=0; i<memory; i++){
            myValues[i] = new Array(11);
        }
        for(let i=0; i<memory; i++){
            for(let j=0; j<1; j++){
               myValues[i][0] = factura;
               myValues[i][1] = pagos[i].id_registro_divisa
               myValues[i][2] = pagos[i].id_tipo_pago
               myValues[i][3] = pagos[i].id_banco
               myValues[i][4] = pagos[i].numero_referencia
               myValues[i][5] = pagos[i].tipo_registro
               myValues[i][6] = pagos[i].monto
               myValues[i][7] = pagos[i].igtf_pago
               myValues[i][8] = fecha_creacion
               myValues[i][9] = pagos[i].igtf_monto
               myValues[i][10] = req.body.id_usuario
            }
        }
        //console.log('LOS VALUES DE LOS PAGOS', myValues);
        if(myValues == 0){
            extraerDetallesFacturaPaciente(factura);
        }else{
            const sql = 'INSERT INTO `tbl_registro_pago` (id_factura, id_registro_divisa, id_tipo_pago, id_banco, numero_referencia, tipo_registro, monto, igtf_pago, fecha_creacion, igtf_monto, id_usuario) VALUES?';
            connection.query(sql, [myValues], (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR!')
                } else {
                    //console.log('agrego!!', result)
                    //res.send('AGREGO!');
                    //extraerNumeroOrden(factura)
                    extraerDetallesFacturaPaciente(factura);
                }
            });
        }
    }

    function moduladorDeOrden(factura, num, result, memoryRest){
        //console.log('PREEEEEEE', factura)
        if(num == 1){
            //extraerDetallesFacturaPaciente(numOrden, factura, num);
            crearOrden(factura, result, memoryRest);
        }else if(num == 2){
            //res.send('CREACION DE TODO')
            imprimirFactura(factura);
        }
    }

    function crearOrden(factura, result, memoryRest){
        //console.log('USANDO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', memoryRest)
        if(memoryRest == 0){
            ////SI YA PASO TODOS LOS PACIENTES////
            moduladorDeOrden(factura, 2, '');
        }else{
                //console.log('RESULT DEL PRINCIPIO', result)
                //result.splice(0, 1);
                //console.log('RESULT DEL SPLICE', result)
                const sql = "SELECT numero_orden FROM `tbl_numero_orden_tmp`";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        //console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result) {
                        //console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', result)
                        numOrden = result[0].numero_orden;
                        //console.log('MEMORY RESTO DENTRO DEL CONNECT MYSQL', memoryRest)
                        insertarOrden(numOrden, memoryRest);
                    }
                    });

                //////SI SIGUE HABIENDO PACIENTES///////
                ////QUITO LOS PACIENTES QUE YA SE PUSIERON EN LA ORDEN Y MANDO LOS QUE FALTAN/////
                //moduladorDeOrden(factura, 1, result)

                function insertarOrden(numOrden, memoryRest){
                    let orden_qr = uniqid();
                    let orden_qr_nube = config.URL2+uniqid()
                    let time = new Date(new Date().toLocaleString("en-US", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    }));
                    connection.query('INSERT INTO `tbl_orden` SET?', {
                        numero_orden: numOrden,
                        orden_qr: orden_qr,
                        orden_qr_nube: orden_qr_nube,
                        fecha: time
                    }, (err, result) => {
                        if (err) {
                            console.log('no se pudo a agregar', err)
                            res.send('ERROR EN CREAR LA ORDEN!')
                        } else {
                            updateOrden(numOrden, memoryRest, orden_qr);
                        }
                    });
                }

                function updateOrden(numOrden, memoryRest, orden_qr){
                    const sqlUpdate = "UPDATE `tbl_numero_orden_tmp` SET numero_orden = numero_orden + 1 WHERE id_numero_orden = 1"
                    connection.query(sqlUpdate, function (err, result, fie) {
                        if (err) {
                            console.log('error en la conexion intente de nuevo', err)
                            res.send('3')
                        }else{
                            //console.log('numero de factura aumentado!')
                            //res.send('sea modifico la factura y numero de factura aumentado!')
                            //crearDetalleOrden(numOrden, memoryRest);
                            extraerIdOrden(numOrden, memoryRest, orden_qr);
                        }
                    })
                }
            
                function extraerIdOrden(numOrden, memoryRest, orden_qr){
                    const sql = "SELECT id_orden FROM `tbl_orden` WHERE orden_qr='" +orden_qr+"'";
                    connection.query(sql, function (err, result, fields) {
                        if (err) {
                            console.log('ERROR en CheckTemplate 5', err);
                            res.send('3');
                        }
                        if(result){
                            //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result[0].id_factura);
                            let idOrden = result[0].id_orden
                            crearDetalleOrden(numOrden, memoryRest, idOrden);
                        }
                     });
                }

            function crearDetalleOrden(numOrden, memoryRest, idOrden){
                //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', result[0].id_paciente)
                //console.log('!!!!!!!!!!!!!!!!!!!!!!RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
                let memory = 0;
                let myValues;
                let id_paciente = result[0].id_paciente;
                let i = 0;
                let conteo;
                let resultRes
                if(memoryRest == 99){
                    memoryRest = 0;
                    memory = memory - memoryRest;
                }else if(memoryRest != 99){
                    memory = memory - memoryRest;
                }
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', id_paciente)
                
                //console.log('CUANTO VALE LA MEMORYREST?', memoryRest)
                //console.log('CUANTO VALE LA MEMORY?', memory)
                if(memory == 0){
                    let i = 0;
                    //let conteo = 1;
                    //console.log('00000000000000000000000000000000000000000000', result)
                    //console.log('EN LA 493XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', id_paciente, result[i].id_paciente)

                    for(let i=0;i<result.length;i++){
                        if(id_paciente != result[i].id_paciente){break;}
                        //console.log('LA MEMROY', memory)
                        //console.log(id_paciente, result[i].id_paciente)
                        memory++;
                    }
                    myValues = new Array(memory);
                    for(let i=0;i<memory;i++){
                        myValues[i] = new Array(2);
                    }
                    i=0;

                    for(let i=0;i<result.length;i++){
                        if(id_paciente != result[i].id_paciente){break;}
                        myValues[i][0]=idOrden
                        myValues[i][1]=result[i].id_detalle_factura_paciente
                        //console.log(i)
                    }
                    result.splice(0,memory);
                    //console.log('LOS VALUES PARA EL DETALLE ORDEN', myValues)
                }else{
                    let i = 0;  
                    let restAux = 0;
                    let memoryAUX = 0;
                    for(let i=0;i<memoryRest;i++){
                        //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!111', id_paciente, result[i].id_paciente)
                        if(id_paciente == result[i].id_paciente)
                        {
                            memoryAUX++;
                        }else{
                            break;
                        }
                    }
                   //console.log('LA MEMORY AUX', memoryAUX)
                    myValues = new Array(memoryAUX);
                    //console.log('EN EL ELSEEEEE', myValues)
                    for(let i=0;i<memoryAUX;i++){
                        myValues[i] = new Array(2);
                    }
                    i=0;
                    restAux = memoryRest;
                    for(let i=0;i<memoryAUX;i++){
                        myValues[i][0]=idOrden
                        myValues[i][1]=result[i].id_detalle_factura_paciente
                        //if(id_paciente != result[i].id_paciente) break;
                    }
                    result.splice(0,memoryAUX);
                    memoryRest = restAux;
                    //console.log('LOS VALUES PARA EL DETALLE ORDEN EN MEMORYREST', myValues)
            
                }

                const sql = 'INSERT INTO tbl_detalle_orden (id_orden, id_detalle_factura_paciente) VALUES?';
                connection.query(sql, [myValues], (err, result) => {
                    if (err) {
                        //console.log('no se pudo a agregar', err)
                        res.send('ERROR!')
                    } else {
                        //console.log('agrego el detalle de orden!!', result)
                        //res.send('AGREGO!');
                        //extraerNumeroOrden(factura)
                    }
                });
                
                
                //console.log('RESULT DEL FINAL', result)
                resultRes = result;
                if(resultRes.length == 0){
                    //console.log('ENTRO A RESULTRES', resultRes)
                    memoryRest = 0;
                }else if(resultRes.length != 0){
                    memoryRest = resultRes.length;
                    //console.log('EL RESULTRES DIFERENTE DE 0', memoryRest)
                    //console.log('LA MEMORYREST EN EL IF2', memoryRest)
                }
                //console.log('LA MEMORY DESPUES DE TODO', memoryRest);
                moduladorDeOrden(factura, 1, resultRes, memoryRest)
            }
        }
    }

    function extraerDetallesFacturaPaciente(factura){
        //console.log('LA FACTURA', factura)
        const sql = "SELECT id_detalle_factura_paciente, id_paciente FROM `tbl_detalle_factura_paciente` WHERE id_factura='" +factura+"'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                //console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                //console.log('PASO A RESULT!', result)
                //return result;
                moduladorDeOrden(factura, 1, result, 99)
            }
        });
    }
    function imprimirFactura(factura){
            let ipSocket, ipNormal, ip, ipDef;
            //ipSocket = req.socket.remoteAddress;
            ipNormal = req.ip;
            //ip = "192.168.0.112";

            ipNormal = ipNormal.split(":");
            ipDef = ipNormal[3];
            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", ipSocket);
            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", ipNormal);
            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", req);
                    //http://localhost:3000/ordenesImpresion
            axios.get('http://localhost:3000/ordenesImpresion/'+factura)
            .then(function (response) {
                imprimirFacturaOrdenes(response.data)
            })

            function imprimirFacturaOrdenes(respOrdenes){
                //console.log("JAJAJAJAJAJAJAJAJAJAJAJAJAJAJAJJAJAJAJAJAA", respOrdenes);
                let numOrdenes = respOrdenes.length;
                //'http://'+ipDef+':5000/impresion'
                axios.post('http://'+ipDef+':5000/impresion',{
                ordenes: respOrdenes,
                numero_impresiones: numOrdenes,
                id_factura: factura
                }).then(function (response) {
                //response.data);
                
                //res.send(response.data)
                //res.redirect('/imprimirFactura/119/1');
                res.redirect('/imprimirFactura/'+factura+'/'+req.body.id_tipo_factura)
                }).catch(function (error) {
                    // handle error
                    //console.log(error);
                    //console.log("OJOJOJOJOJOJOJJOJOJOJOJOJOJO")
                    res.redirect('/imprimirFactura/'+factura+'/'+req.body.id_tipo_factura)
                  })
            }
        //res.redirect('/imprimirFactura/'+factura+'/'+req.body.id_tipo_factura);
    }
    
}

facturacionCtrl.index = async(req, res) =>{
    console.log("api healthcheck")
}

module.exports = facturacionCtrl;