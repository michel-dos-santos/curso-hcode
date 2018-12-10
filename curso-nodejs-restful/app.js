let app = require('./config/appConfig.js');
let consign = require('consign');

app.use(function timeLog(req, res, next) {
    console.log('--------------------------------------------------------');
    console.log('New requisition in : ', new Date(Date.now()).toString());
    console.log('Requisition to : ', req.originalUrl);
    console.log('Method :', req.method);
    next();
});

consign().include('routes').include('utils').into(app);