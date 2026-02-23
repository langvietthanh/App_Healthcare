


class AppError extends Error {
    constructor (errorMessage, statusCode) {
        super (errorMessage);
        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith("4") ? "fail" : "error";

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;