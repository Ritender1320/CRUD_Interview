const ApplicationError = require("../utils/error");

const { enviornment } = require("../config");

const handleCastErrorDb = (err) => {
    const message = `Invalid ${err.path} and ${err.value}.`
    return new ApplicationError(message, 400);
}

const handleDublicateMongoField = (err) => {
    const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    const message = `Duplicate Field Value: ${value} this field should be unique`
    return new ApplicationError(message, 400);
}

const handleMongoDbValidationError = (err) => {
    const error = Object.values(err.error).map(el => el.message);
    const message = `Invalid Input Data ${error.join(', ')}`;
    return new ApplicationError(message, 400);
}

const handleJwtTokenError = (err) => {
    return new ApplicationError(`Invalid Token Log In Again`, 401);
}

const handleExpireJwtToken = (err) => {
    return new ApplicationError(`Token has been expire login again`, 401);
}

const SendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const SendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    else {
        console.log('Error: ', err);
        res.status(500).json({
            status: 'production error',
            message: 'Something went very Wrong'
        });
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Gobal Error'

    console.log(enviornment);

    if (enviornment === 'development') {
        SendErrorDev(err, res);
    }
    else if (enviornment === 'production') {
        let error = { ...err };
        let erRes;

        if (err.name === 'CastError') {
            erRes = handleCastErrorDb(err);
            SendErrorProd(erRes, res);
        }
        else if (err.name === 'ValidationError') {
            erRes = handleMongoDbValidationError(err)
            SendErrorProd(erRes, res)
        }
        else if (err.name === 'JsonWenTokenErro') {
            erRes = handleJwtTokenError(err)
            SendErrorProd(erRes, res)
        }
        else if (err.name === 'TokenExpriesError') {
            erRes = handleExpireJwtToken(err)
            SendErrorProd(erRes, res)
        }
        else {
            SendErrorProd(err, res)
        }
    }

}

module.exports = errorHandler;