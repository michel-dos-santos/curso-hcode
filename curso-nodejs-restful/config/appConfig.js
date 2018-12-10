let express = require('express');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let app = express();

let allowCors = function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	next();
}

app.listen(4000); 
app.use(allowCors);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(expressValidator());

module.exports = app;
