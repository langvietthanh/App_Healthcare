/**
 * @class
 */
class AppError extends Error {
    constructor (errorMessage, statusCode) {
        super (errorMessage);
        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith("4") ? "fail" : "error";
        this.isOperational = true; // Để phân biệt lỗi do mình tạo ra với lỗi hệ thống (như sập DB)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;