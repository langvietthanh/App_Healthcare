const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const catchAsync = require('../utils/catchAsync');

/**
 * @route   [POST] /api/upload
 * @desc    Upload an image and get its URL
 */
router.post('/',
    authMiddleware,
    upload.single('image'),
    catchAsync(async (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({ message: 'Không có file nào được tải lên.' });
        }
        
        // Lấy type để trả về đúng đường dẫn (cùng logic với uploadMiddleware)
        const type = req.query.type;
        let folder = 'others';
        if (type === 'food') folder = 'food';
        else if (type === 'exercise') folder = 'exercise';
        else if (type === 'avatar') folder = 'avatar';

        // Trả về đường dẫn của file để Frontend hiển thị và lưu DB
        const fileUrl = `/uploads/${folder}/${req.file.filename}`;
        
        res.status(200).json({
            message: 'Tải ảnh lên thành công',
            url: fileUrl
        });
    })
);

module.exports = router;
