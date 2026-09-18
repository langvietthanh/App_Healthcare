const Exercise = require('../app/models/Exercise');
const FavoriteExercise = require('../app/models/FavoriteExercise');
const User = require('../app/models/User');
const AppError = require('../utils/appError');
const {
    EXERCISE_CATEGORIES,
    EXERCISE_MUSCLES
} = require('../constants/exercise');

class ExerciseService {
    async createNewExercise({ data, userId, role }) {
        const { name, category, targetMuscles, description, instructions, imgURL } = data;

        // Admin tạo bài tập hệ thống (public) — User tạo bài tập cá nhân (private, không lên hệ thống)
        const isAdmin = role === 'admin';

        const newExercise = new Exercise({
            name,
            category,
            targetMuscles,
            description,
            instructions,
            imgURL,
            isPublic: isAdmin,
            verifyStatus: isAdmin ? 'approved' : 'none',
            creatorId: isAdmin ? null : userId,
        });

        await newExercise.save();
        return newExercise;
    }

    async searchExercise({ data, userId, role }) {
        const keyword = data.q;
        const category = data.category;
        const muscle = data.muscle;
        const origin = data.origin;

        // Chỉ lấy bài tập Public HOẶC bài do chính user tạo
        // Nếu là admin thì lấy toàn bộ
        const query = {
            isDeleted: false
        };

        if (origin === 'system') {
            query.isPublic = true;
        } else if (origin === 'user') {
            query.creatorId = userId;
            console.log('user', userId);
        } else {
            // Lấy tất cả (phân quyền theo role)
            if (role !== 'admin') {
                query.$or = [
                    { isPublic: true },
                    { creatorId: userId }
                ];
            }
        }

        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }

        if (muscle) {
            // Cú pháp này báo cho MongoDB biết: 
            // "Chỉ cần kiểm tra trường muscle bên trong các object của mảng targetMuscles thôi,
            //  các trường khác (như rating) có là gì thì kệ nó
            query['targetMuscles.muscle'] = muscle;
        }
        // Lấy limit từ query, nếu không truyền thì mặc định không giới hạn (0 trong mongoose là không giới hạn)
        const limit = data.limit ? parseInt(data.limit) : 0;

        const listExercises = await Exercise.find(query).limit(limit);
        return listExercises;
    }

    async getDetailExercise({ exerciseId }) {
        const detailExercise = await Exercise.findOne({ _id: exerciseId, isDeleted: false });
        if (!detailExercise) throw new AppError('Không tìm thấy bài tập', 404);
        return detailExercise;
    }

    async updateExercise({ exerciseId, userId, role, data }) {
        const { name, category, targetMuscles, description, instructions, isPublic, imgURL } = data;

        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) throw new AppError('Không tìm thấy bài tập', 404);

        if (exercise.isPublic && role !== 'admin') {
            throw new AppError('Bài tập này là của hệ thống. Chỉ Admin mới được phép chỉnh sửa!', 403);
        } else if (role !== 'admin' && (!exercise.creatorId || exercise.creatorId.toString() !== userId)) {
            throw new AppError('Bạn không có quyền sửa bài tập của người khác!', 403);
        }

        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (category !== undefined) updateFields.category = category;
        if (targetMuscles !== undefined) updateFields.targetMuscles = targetMuscles;
        if (description !== undefined) updateFields.description = description;
        if (instructions !== undefined) updateFields.instructions = instructions;
        if (isPublic !== undefined) updateFields.isPublic = isPublic;
        if (imgURL !== undefined) updateFields.imgURL = imgURL;

        const updatedExercise = await Exercise.findByIdAndUpdate(
            exerciseId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedExercise) throw new AppError('Không tìm thấy bài tập', 404);
        return updatedExercise;
    }

    async deleteExercise({ exerciseId, userId, role }) {
        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            throw new AppError('Không tìm thấy bài tập', 404);
        }

        if (exercise.isPublic && role !== 'admin') {
            throw new AppError('Bài tập này là của hệ thống. Chỉ Admin mới được phép xóa!', 403);
        } else if (role !== 'admin' && (!exercise.creatorId || exercise.creatorId.toString() !== userId)) {
            throw new AppError('Bạn không có quyền xóa bài tập của người khác!', 403);
        }
        exercise.isDeleted = true;
        await exercise.save();
    }

    async getMetadata() {
        return {
            categories: EXERCISE_CATEGORIES,
            muscles: EXERCISE_MUSCLES
        };
    }

    async getRelatedExercises({ exerciseId }) {
        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) throw new AppError('Không tìm thấy bài tập', 404);

        const muscles = exercise.targetMuscles.map(m => m.muscle);

        const related = await Exercise.find({
            _id: { $ne: exerciseId },
            isDeleted: false,
            $or: [
                { category: exercise.category },
                { 'targetMuscles.muscle': { $in: muscles } }
            ]
        })
            .sort({ 'targetMuscles.rating': -1 })
            .limit(5);
        const result = related.map(exercise => {
            const { name, category, targetMuscles } = exercise;
            return { name, category, targetMuscles }
        }
        )
        return result;
    }

    async toggleFavorite({ userId, exerciseId }) {
        const exercise = await Exercise.findOne({ _id: exerciseId, isDeleted: false });
        if (!exercise) throw new AppError('Không tìm thấy bài tập', 404);

        const existingFav = await FavoriteExercise.findOne({ userId, exerciseId });
        if (existingFav) {
            await FavoriteExercise.findByIdAndDelete(existingFav._id);
            return { name: exercise.name, isFavorite: false, msg: 'Đã bỏ lưu bài tập khỏi danh sách yêu thích' };
        } else {
            const newFav = new FavoriteExercise({ userId, exerciseId });
            await newFav.save();
            return { name: exercise.name, isFavorite: true, msg: 'Đã lưu bài tập vào danh sách yêu thích' };
        }
    }

    async getMyFavorites({ userId }) {
        const favorites = await FavoriteExercise.find({ userId }).populate('exerciseId').sort({ createdAt: -1 });
        // Chỉ lấy những bài tập chưa bị xóa mềm
        const validFavorites = favorites.filter(fav => fav.exerciseId && !fav.exerciseId.isDeleted);
        return validFavorites.map(fav => {
            const { _id, name, category, creatorId, imgURL, description, instructions, targetMuscles } = fav.exerciseId;
            return { _id, name, category, creatorId, imgURL, description, instructions, targetMuscles };
        });
    }

    async getRecommendations({ userId }) {
        const user = await User.findById(userId);
        if (!user)
            throw new AppError('Không tìm thấy người dùng', 404);

        // Logic: Giảm cân -> Cardio, Tăng cân -> Strength, Giữ dáng -> Flexibility
        let recommendedCategory = 'Strength';
        if (user.goals && user.physicalDetail) {
            const currentWeight = user.physicalDetail.weight;
            const weightGoal = user.goals.weightGoal;
            if (weightGoal < currentWeight) {
                recommendedCategory = 'Cardio';
            } else if (weightGoal > currentWeight) {
                recommendedCategory = 'Strength';
            } else {
                recommendedCategory = 'Flexibility';
            }
        }

        const recommendations = await Exercise.find({ category: recommendedCategory, isDeleted: false })
            .sort({ 'targetMuscles.rating': -1 })
            .limit(5);

        return recommendations;
    }
}

module.exports = new ExerciseService();