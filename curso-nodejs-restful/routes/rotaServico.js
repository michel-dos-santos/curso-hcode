module.exports = (app) =>{

////////////////////////////////////////////////////////////////////// STATUS ///////////////////////////////////////////////////////////////////////
app.get('/servicos/status', function(req, res) {
	res.end('Servidor ON! Bem Vindo.');
});

};