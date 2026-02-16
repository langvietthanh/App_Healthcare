const errorHandler = (err, req, res, next) => {
    // Nếu lỗi có statusCode riêng thì dùng, không thì mặc định là 500 (Lỗi server)
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || "Lỗi hệ thống không xác định",
        // Chỉ hiện stack trace (dòng bị lỗi) khi đang ở môi trường phát triển (development)
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
};

module.exports = errorHandler;