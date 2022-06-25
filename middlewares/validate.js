const { validationResult } = require('express-validator')

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty()) {
        next()
    }

    if(!errors.isEmpty()) {

        const extractedErrors = errors.array().map(err => {
            console.log(err);
            return {
                [err.param]: err.msg
            }
        })

        return res.status(422).send({
            ok: false,
            error: extractedErrors
        })
    }   
}

module.exports = validate