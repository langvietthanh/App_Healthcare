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
        const { name, category, targetMuscles, description, instructions } = data;

        // Admin tạo bài tập hệ thống (public) — User tạo bài tập cá nhân (private, không lên hệ thống)
        const isAdmin = role === 'admin';

        const newExercise = new Exercise({
            name,
            category,
            targetMuscles,
            description,
            instructions,
            isPublic: isAdmin,
            verifyStatus: isAdmin ? 'approved' : 'none',
            creatorId: isAdmin ? null : userId,
        });

        await newExercise.save();
        return newExercise;
    }

    async searchExercise({ data, userId }) {
        const keyword = data.q;
        const category = data.category;
        const muscle = data.muscle;

        // Chỉ lấy bài tập Public HOẶC bài do chính user tạo (giống logic Food)
        const query = {
            $or: [
                { isPublic: true },
                { creatorId: userId }
            ],
            isDeleted: false
        };
        
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
        const listExercises = await Exercise.find(query).limit(50);
        return listExercises;
    }

    async getDetailExercise({ exerciseId }) {
        const detailExercise = await Exercise.findOne({ _id: exerciseId, isDeleted: false });
        if (!detailExercise) throw new AppError('Không tìm thấy bài tập', 404);
        return detailExercise;
    }

    async updateExercise({ exerciseId, data }) {
        const { name, category, targetMuscles, description, instructions } = data;
        
        const updatedExercise = await Exercise.findByIdAndUpdate(
            exerciseId,
            { name, category, targetMuscles, description, instructions },
            { new: true, runValidators: true }
        );

        if (!updatedExercise) throw new AppError('Không tìm thấy bài tập', 404);
        return updatedExercise;
    }

    async deleteExercise({ exerciseId }) {
        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            throw new AppError('Không tìm thấy bài tập', 404);
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
            const { name, category, targetMuscles} = exercise;
            return { name, category, targetMuscles}  
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
            return { name: exercise.name ,isFavorite: true, msg: 'Đã lưu bài tập vào danh sách yêu thích' };
        }
    }

    async getMyFavorites({ userId }) {
        const favorites = await FavoriteExercise.find({ userId }).populate('exerciseId').sort({ createdAt: -1 });
        // Chỉ lấy những bài tập chưa bị xóa mềm
        const validFavorites = favorites.filter(fav => fav.exerciseId && !fav.exerciseId.isDeleted);
        return validFavorites.map(fav => {
            const {_id, name, category} = fav.exerciseId;
            return { _id, name, category };
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