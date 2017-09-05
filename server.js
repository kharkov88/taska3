let http = require( 'http' ),
    express = require('express'),
    app = express(),
    server = http.createServer(app);


app.use( express.static( __dirname + '/' ) );
app.get( '/', function ( request, response ) { 
    response.redirect( '/' );
}); 

let port = process.env.PORT || 5007;
server.listen(port);
console.log('Express-сервер прослушивает порт %d в режиме %s',
	        server.address().port, app.settings.env);