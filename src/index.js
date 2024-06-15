const app = require('./app');
require('./database');

async function main(){
	await app.listen(app.get('port')); //desde app se obtiene el valer de port que es 3000
    console.log('server on port', app.get('port'));
}

main();