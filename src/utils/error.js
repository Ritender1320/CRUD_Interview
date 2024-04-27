class ApplicationError extends Error{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
        console.log(`Message: ${message}`);
        console.log(`StatusCode: ${statusCode}`);
    }
}

module.exports = ApplicationError;