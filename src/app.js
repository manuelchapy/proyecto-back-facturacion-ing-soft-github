const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const session = require('express-session');


app.set('port', process.env.PORT || 3000);


// middlewares
app.use(express.urlencoded({extended: false}));	
app.use(cors()); //cada vez que llegue una petición a mi servidor va permitir poder enviar y recibir datos
app.use(express.json()); //desde mi servidor se puede ver info en formato json y string
app.use(session({
	secret: '24781279_provida',
	resave: true,
	sevenUninitialized: true
}));

app.use(require('../src/routes/facturacion'))
app.use(require('../src/routes/clientes'))
app.use(require('../src/routes/pacientes'))

//static files
//app.use('/public',express.static(path.join(__dirname, '../public')));

module.exports = app;