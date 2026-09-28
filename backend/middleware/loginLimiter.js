const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, //limits each ip to 5 login request per window per minute
    message:
    {
        message: 'Too many login attempts from ths IP. Please try again after 60 secondes'
    },
    handler: (req, res, next, options) => {
        logEvents(`Too many requests:${options.message.message}\t${req.method}\t${req.url}\'t${req.headers.origin}`, errLog.log)
        res.status(options.statusCode).send(options.message)
    },
    standartHeaders: true,
    legacyHeaders: false
})

module.exports = loginLimiter