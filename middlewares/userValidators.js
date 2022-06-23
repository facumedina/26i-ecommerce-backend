const { body, validationResult } = require('express-validator');

function userLoginValidator() {
    return [
        body('email', 'El email es obligatorio').exists(),
        body('email', 'El email es invalido').isEmail(),
        body('password', 'El password es obligatorio'). exists(),
        body('password').isLength({ min: 3, max: 30 }).withMessage('Longitud del password es invalida')
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty()) {
        next()
    }

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

module.exports = {
    userLoginValidator,
    validate
}