const documentosCtrl = {};
const connection = require('../database');

documentosCtrl.documentos = async(req, res) =>{
    const sql = "SELECT * FROM tbl_documento_cliente"
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            
            console.log(result);
            res.send(result)
        }});
        
       //console.log(req.body)
    //res.send('Funciona!')
}

module.exports = documentosCtrl;