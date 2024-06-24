const mysql = require('mysql');

//local host
/*
const connection = mysql.createConnection({
	host: 'localhost',
	database: 'providadb',
	user: 'root',
	password: ''
});
*/

const connection = mysql.createConnection({
	host: '74.208.147.248',
	database: 'db_provida',
	user: 'manuel94',
	password: '9Ws6&k9i4'
});

connection.connect(function (error) {
	if (error) {
		throw error;
	} else {
		console.log('DB Connected')
	}
}),

module.exports = connection;