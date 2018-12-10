module.exports = {

    send:(errors, req, res, code = 400)=>{
        console.log(`error: ${errors}`);
        res.status(code).json({
            errors
        });
    }

};