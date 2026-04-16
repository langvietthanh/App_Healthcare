const WorkoutPlan = require('../app/models/WorkoutPlan');
const AppError = require('../utils/appError');

class WorkoutPlanService {
    // TẠO VÀ QUẢN LÝ LỊCH TẬP (WORKOUT PLAN)
    // ----------------------------------------------------------------------

    /**
     * Khởi tạo Lịch Tập mới
     * @param {Object} payload 
     * @returns {Object} newPlan
     */
    async createPlan({ userId, data }) {
        const { name, description } = data;

        const newPlan = new WorkoutPlan({
            userId,
            name,
            description
        });

        await newPlan.save();
        return newPlan;
    }

    /**
     * Lấy danh sách Lịch tập của người dùng (Không kèm chi tiết sessions để tránh độ trễ mạng)
     */
    async getAllPlans({ userId }) {
        const plans = await WorkoutPlan.find({ userId }).select('-sessions');
        return plans;
    }

    /**
     * Lấy chi tiết Lịch tập bao gồm thông tin chi tiết các Bài tập (Exercises)
     */
    async getPlanById({ planId, userId }) {
        const plan = await WorkoutPlan.findOne({ _id: planId, userId })
            .populate({
                path: 'sessions.exercises.exerciseId',
                select: 'name category targetMuscles isDeleted'
            });
        
        if (!plan) throw new AppError('Không tìm thấy Lịch tập này!', 404);
        return plan;
    }

    /**
     * Cập nhật toàn bộ Lịch Tập (Chỉnh sửa Lịch tập gốc)
     */
    async updatePlan({ planId, userId, data }) {
        const { name, description, sessions } = data;
        
        const updatedPlan = await WorkoutPlan.findOneAndUpdate(
            { _id: planId, userId },
            { 
                $set: {
                    ...(name && { name }),
                    ...(description !== undefined && { description }),
                    ...(sessions && { sessions })
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedPlan) throw new AppError('Không tìm thấy Lịch tập cần sửa!', 404);
        return updatedPlan;
    }

    /**
     * Đặt cấu hình Lịch tập làm Lịch hiện hành (Thuật toán Mutual Exclusion)
     */
    async setActivePlan({ planId, userId }) {
        // Cập nhật trạng thái isActive = false cho toàn bộ lịch tập khác của user
        await WorkoutPlan.updateMany({ userId }, { isActive: false });

        // Kích hoạt trạng thái isActive = true cho lịch được chọn
        const activePlan = await WorkoutPlan.findOneAndUpdate(
            { _id: planId, userId },
            { isActive: true },
            { new: true }
        );

        if (!activePlan) throw new AppError('Không tìm thấy Lịch tập để kích hoạt!', 404);
        return activePlan;
    }

    /**
     * Xóa vĩnh viễn Lịch tập khỏi CSDL
     */
    async deletePlan({ planId, userId }) {
        const plan = await WorkoutPlan.findOneAndDelete({ _id: planId, userId });
        
        if (!plan) throw new AppError('Không tìm thấy Lịch tập để xóa!', 404);
        return plan;
    }

    // QUẢN LÝ MẢNG CẤP 1 - BUỔI TẬP (SESSION)
    // ----------------------------------------------------------------------
    
    /**
     * Thêm Buổi tập mới vào mảng sessions (Toán tử $push)
     */
    async addSession({ planId, userId, data }) {
        const { name, dayOfWeek, startTime, endTime } = data;
        
        const updatedPlan = await WorkoutPlan.findOneAndUpdate(
            { _id: planId, userId },
            { $push: { sessions: { name, dayOfWeek, startTime, endTime, exercises: [] } } },
            { new: true }
        );

        if (!updatedPlan) throw new AppError('Không tìm thấy cấu trúc Lịch tập tương ứng!', 404);
        return updatedPlan;
    }

    /**
     * Cập nhật thông tin Buổi tập (Toán tử $set kết hợp Positional Operator $)
     */
    async updateSession({ planId, sessionId, userId, data }) {
        const { name, dayOfWeek, startTime, endTime } = data;

        const updatedPlan = await WorkoutPlan.findOneAndUpdate(
            { _id: planId, userId, "sessions._id": sessionId },
            {
                $set: {
                    ...(name && { "sessions.$.name": name }),
                    ...(dayOfWeek && { "sessions.$.dayOfWeek": dayOfWeek }),
                    ...(startTime && { "sessions.$.startTime": startTime }),
                    ...(endTime && { "sessions.$.endTime": endTime })
                }
            },
            { new: true }
        );

        if (!updatedPlan) throw new AppError('Trường Dữ liệu Lịch tập hoặc Session ID không tồn tại!', 404);
        return updatedPlan;
    }

    /**
     * Xóa Buổi tập khỏi mảng sessions (Toán tử $pull)
     */
    async deleteSession({ planId, sessionId, userId }) {
        const updatedPlan = await WorkoutPlan.findOneAndUpdate(
            { _id: planId, userId },
            { $pull: { sessions: { _id: sessionId } } },
            { new: true }
        );

        if (!updatedPlan) throw new AppError('Truy vấn cấu trúc Lịch tập thất bại!', 404);
        return updatedPlan;
    }

    // QUẢN LÝ MẢNG CẤP 2 - BÀI TẬP (NESTED EXERCISES)
    // ----------------------------------------------------------------------

    /**
     * Thêm Bài tập vào mảng exercises của một Buổi tập cụ thể ($push trên mảng lồng)
     */
    async addExercise({ planId, sessionId, userId, data }) {
        const { exerciseId, targetSets, targetReps, targetDurationMinutes, restTimeSeconds } = data;
        
        const updatedPlan = await WorkoutPlan.findOneAndUpdate(
            { _id: planId, userId, "sessions._id": sessionId },
            { 
                $push: { 
                    "sessions.$.exercises": {
                        exerciseId, targetSets, targetReps, targetDurationMinutes, restTimeSeconds
                    } 
                } 
            },
            { new: true }
        );

        if (!updatedPlan) throw new AppError('Không tìm thấy tham số truy chiếu đến Session ID!', 404);
        return updatedPlan;
    }

    /**
     * Cập nhật thông số Bài tập (Kết hợp $set và arrayFilters cho Data Structures Nested Cấp 2)
     */
    async updateExercise({ planId, sessionId, exerciseObjectId, userId, data }) {
        const { targetSets, targetReps, targetDurationMinutes, restTimeSeconds } = data;
        
        const updatedPlan = await WorkoutPlan.findOneAndUpdate(
            { _id: planId, userId },
            {
                $set: {
                    ...(targetSets && { "sessions.$[sessionObj].exercises.$[exerciseObj].targetSets": targetSets }),
                    ...(targetReps && { "sessions.$[sessionObj].exercises.$[exerciseObj].targetReps": targetReps }),
                    ...(targetDurationMinutes && { "sessions.$[sessionObj].exercises.$[exerciseObj].targetDurationMinutes": targetDurationMinutes }),
                    ...(restTimeSeconds !== undefined && { "sessions.$[sessionObj].exercises.$[exerciseObj].restTimeSeconds": restTimeSeconds })
                }
            },
            { 
                arrayFilters: [
                    { "sessionObj._id": sessionId }, 
                    { "exerciseObj._id": exerciseObjectId } 
                ],
                new: true 
            }
        );

        if (!updatedPlan) throw new AppError('Bản ghi cấp 2 không tồn tại trong hệ thống!', 404);
        return updatedPlan;
    }

    /**
     * Xóa Bài tập khỏi mảng lồng ($pull với Positional Array $)
     */
    async deleteExercise({ planId, sessionId, exerciseObjectId, userId }) {
        const updatedPlan = await WorkoutPlan.findOneAndUpdate(
            { _id: planId, userId, "sessions._id": sessionId },
            { 
                $pull: { 
                    "sessions.$.exercises": { _id: exerciseObjectId } 
                } 
            },
            { new: true }
        );

        if (!updatedPlan) throw new AppError('Ràng buộc Session ID thất bại, hệ thống từ chối truy cập!', 404);
        return updatedPlan;
    }
}

module.exports = new WorkoutPlanService();