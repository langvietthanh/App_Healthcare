const errorHandler = (err, req, res, next) => {
    // Nếu lỗi có statusCode riêng thì dùng, không thì mặc định là 500 (Lỗi server)
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        status: err.status || "Error",
        message: err.message || "Lỗi hệ thống không xác định",
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
};

module.exports = errorHandler;