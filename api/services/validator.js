const config = require('../config.json');

var validatorFunctions = {
    user(req, res, callback) {
        if (req.session.userid && req.session.email) callback();
        else {
            res.sendStatus(401)
        };
    },

    teacher(req, res, next) {
        validatorFunctions.user(req, res, () => {
            if (req.session.teacher) next();
            else res.sendStatus(401);
        })
    },
    
    admin(req, res, next) {
        validatorFunctions.user(req, res, () => {
            if (config.admins.includes(req.session.email)) next();
            else res.sendStatus(401);
        })
    },

    student(req, res, next) {
        validatorFunctions.user(req, res, () => {
            next()
        })
    }
}

module.exports = validatorFunctions