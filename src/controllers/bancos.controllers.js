const bancosCtrl = {};
const session = require('express-session');
const { updateLocale } = require('moment');
const connection = require('../database');

bancosCtrl.bancos = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_banco`";
    let numFact;
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR', err);
            res.send('3');
        }
        if(result){
            res.send(result)
        }
    });
}

module.exports = bancosCtrl;