module.exports = (fn) => {
    return (req, res, next) => {
        // fn là hàm Controller của bạn (một async function)
        // Nếu fn có lỗi, .catch(next) sẽ tự động đẩy lỗi vào errorHandler
        fn(req, res, next).catch(next);
    };
};