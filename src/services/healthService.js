/**
 * @class
 */
class healthService {
    /**
     * @param {Object} obj 
     * @param {number} obj.idealWeight
     * @param {number} obj.weightGoal 
     */
    getAdvice ({ idealWeight, weightGoal, } = {}) {
        if (!weightGoal || !idealWeight) return "";
        // Sai số chấp nhận được (ví dụ trong khoảng 1kg được coi là bằng nhau)
        const threshold = 1; 
        const difference = weightGoal - idealWeight;
        if (Math.abs(difference) <= threshold) {
            return "Đây là mức cân nặng lý tưởng cho chiều cao của bạn. Hãy duy trì lối sống lành mạnh.";
        } else if (difference > 0) {
            return "Mục tiêu này cao hơn mức chuẩn y tế, thường phù hợp nếu bạn muốn phát triển cơ bắp (Bulk). Hãy tập trung vào tập luyện kháng lực.";
        } else {
            return "Mục tiêu của bạn hơi thấp so với chuẩn sức khỏe. Hãy đảm bảo bạn nạp đủ vi chất và không giảm cân quá nhanh.";
        }
    }
}

module.exports = new healthService();