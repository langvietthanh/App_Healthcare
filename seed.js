const mongoose = require('mongoose');

// Connect DB
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/app_healthcare');
        console.log('✅ Kết nối thành công với DB');
    } catch {
        console.log('❌ Kết nối thất bại với DB');
        process.exit(1);
    }
}

// Models
const Exercise = require('./src/app/models/Exercise');
const Food = require('./src/app/models/Food');

// ========== EXERCISE DATA ==========
const exercises = [
    {
        name: 'Bench Press',
        category: 'Strength',
        description: 'Bài tập ngực cơ bản với tạ đòn, giúp phát triển cơ ngực, vai trước và tay sau.',
        imgURL: 'http://localhost:3000/uploads/exercise/bench-press.png',
        targetMuscles: [
            { muscle: 'Chest', rating: 5 },
            { muscle: 'Shoulders', rating: 3 },
            { muscle: 'Arms', rating: 2 }
        ],
        instructions: [
            { stepNumber: 1, text: 'Nằm ngửa trên ghế, tay cầm tạ đòn rộng hơn vai.' },
            { stepNumber: 2, text: 'Hạ tạ xuống ngực một cách kiểm soát.' },
            { stepNumber: 3, text: 'Đẩy tạ lên thẳng cho đến khi tay duỗi thẳng.' }
        ],
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Barbell Squats',
        category: 'Strength',
        description: 'Bài tập chân toàn diện với tạ đòn, phát triển cơ đùi, mông và lưng dưới.',
        imgURL: 'http://localhost:3000/uploads/exercise/barbell-squats.png',
        targetMuscles: [
            { muscle: 'Legs', rating: 5 },
            { muscle: 'Core', rating: 3 },
            { muscle: 'Back', rating: 2 }
        ],
        instructions: [
            { stepNumber: 1, text: 'Đặt tạ đòn lên vai, đứng thẳng chân rộng bằng vai.' },
            { stepNumber: 2, text: 'Ngồi xuống cho đến khi đùi song song với sàn.' },
            { stepNumber: 3, text: 'Đẩy người lên về vị trí ban đầu.' }
        ],
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Pull-Ups',
        category: 'Strength',
        description: 'Bài tập lưng và tay với xà đơn, phát triển cơ lưng rộng và tay trước.',
        imgURL: 'http://localhost:3000/uploads/exercise/pull-ups.png',
        targetMuscles: [
            { muscle: 'Back', rating: 5 },
            { muscle: 'Arms', rating: 3 },
            { muscle: 'Shoulders', rating: 2 }
        ],
        instructions: [
            { stepNumber: 1, text: 'Bám vào xà với tay rộng hơn vai, lòng bàn tay hướng ra ngoài.' },
            { stepNumber: 2, text: 'Kéo người lên cho đến khi cằm vượt qua xà.' },
            { stepNumber: 3, text: 'Hạ người xuống từ từ về vị trí ban đầu.' }
        ],
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Barbell Row',
        category: 'Strength',
        description: 'Bài tập lưng với tạ đòn, tăng cường cơ lưng giữa và tay trước.',
        imgURL: 'http://localhost:3000/uploads/exercise/barbell-row.png',
        targetMuscles: [
            { muscle: 'Back', rating: 5 },
            { muscle: 'Arms', rating: 3 },
            { muscle: 'Core', rating: 2 }
        ],
        instructions: [
            { stepNumber: 1, text: 'Đứng cúi người về phía trước, lưng thẳng, tay cầm tạ đòn.' },
            { stepNumber: 2, text: 'Kéo tạ về phía bụng dưới, khuỷu tay sát người.' },
            { stepNumber: 3, text: 'Hạ tạ xuống từ từ về vị trí ban đầu.' }
        ],
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Overhead Press',
        category: 'Strength',
        description: 'Bài tập vai với tạ đòn, phát triển cơ vai và tay sau.',
        imgURL: 'http://localhost:3000/uploads/exercise/overhead-press.png',
        targetMuscles: [
            { muscle: 'Shoulders', rating: 5 },
            { muscle: 'Arms', rating: 3 },
            { muscle: 'Core', rating: 2 }
        ],
        instructions: [
            { stepNumber: 1, text: 'Đứng thẳng, tay cầm tạ đòn ngang vai.' },
            { stepNumber: 2, text: 'Đẩy tạ thẳng lên trên đầu cho đến khi tay duỗi thẳng.' },
            { stepNumber: 3, text: 'Hạ tạ xuống từ từ về vị trí ban đầu.' }
        ],
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Bicep Curl',
        category: 'Strength',
        description: 'Bài tập tay trước với tạ tay, tập trung phát triển cơ bắp tay.',
        imgURL: 'http://localhost:3000/uploads/exercise/bicep-curl.png',
        targetMuscles: [
            { muscle: 'Arms', rating: 5 },
            { muscle: 'Shoulders', rating: 1 }
        ],
        instructions: [
            { stepNumber: 1, text: 'Đứng thẳng, tay cầm tạ tay hai bên.' },
            { stepNumber: 2, text: 'Cuộn tạ lên phía vai, giữ khuỷu tay cố định.' },
            { stepNumber: 3, text: 'Hạ tạ xuống từ từ về vị trí ban đầu.' }
        ],
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Dumbbell Lunge',
        category: 'Strength',
        description: 'Bài tập chân với tạ tay, phát triển cơ đùi và mông.',
        imgURL: 'http://localhost:3000/uploads/exercise/dumbbell-lunge.png',
        targetMuscles: [
            { muscle: 'Legs', rating: 5 },
            { muscle: 'Core', rating: 2 }
        ],
        instructions: [
            { stepNumber: 1, text: 'Đứng thẳng, hai tay cầm tạ tay hai bên.' },
            { stepNumber: 2, text: 'Bước một chân về phía trước, hạ gối sau xuống gần sàn.' },
            { stepNumber: 3, text: 'Đẩy người lên về vị trí ban đầu, đổi chân.' }
        ],
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Sumo Deadlift',
        category: 'Strength',
        description: 'Bài tập toàn thân với tư thế chân rộng, phát triển cơ lưng, mông và đùi trong.',
        imgURL: 'http://localhost:3000/uploads/exercise/sumo-deadlift.png',
        targetMuscles: [
            { muscle: 'Back', rating: 4 },
            { muscle: 'Legs', rating: 5 },
            { muscle: 'Core', rating: 3 }
        ],
        instructions: [
            { stepNumber: 1, text: 'Đứng chân rộng hơn vai, mũi chân hướng ra ngoài, tay cầm tạ đòn.' },
            { stepNumber: 2, text: 'Giữ lưng thẳng, hạ người xuống và cầm tạ.' },
            { stepNumber: 3, text: 'Đẩy người lên thẳng, siết mông ở đỉnh động tác.' }
        ],
        isPublic: true,
        verifyStatus: 'approved'
    }
];

// ========== FOOD DATA ==========
const foods = [
    {
        name: 'Ức gà áp chảo',
        imgURL: 'http://localhost:3000/uploads/food/uc-ga-ap-chao.png',
        servingSize: { amount: 100, unit: 'g', weightInGram: 100 },
        nutrients: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Trứng gà luộc',
        imgURL: 'http://localhost:3000/uploads/food/trung-ga-luoc.png',
        servingSize: { amount: 100, unit: 'g', weightInGram: 100 },
        nutrients: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Cá hồi nướng',
        imgURL: 'http://localhost:3000/uploads/food/ca-hoi-nuong.png',
        servingSize: { amount: 100, unit: 'g', weightInGram: 100 },
        nutrients: { calories: 208, protein: 20, carbs: 0, fat: 13 },
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Thịt bò',
        imgURL: 'http://localhost:3000/uploads/food/thit-bo.png',
        servingSize: { amount: 100, unit: 'g', weightInGram: 100 },
        nutrients: { calories: 250, protein: 26, carbs: 0, fat: 15 },
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Whey Protein',
        imgURL: 'http://localhost:3000/uploads/food/whey-protein.png',
        servingSize: { amount: 30, unit: 'g', weightInGram: 30 },
        nutrients: { calories: 120, protein: 24, carbs: 3, fat: 1.5 },
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Yến mạch',
        imgURL: 'http://localhost:3000/uploads/food/yen-mach.png',
        servingSize: { amount: 100, unit: 'g', weightInGram: 100 },
        nutrients: { calories: 389, protein: 17, carbs: 66, fat: 7 },
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Khoai lang luộc',
        imgURL: 'http://localhost:3000/uploads/food/khoai-lang-luoc.png',
        servingSize: { amount: 100, unit: 'g', weightInGram: 100 },
        nutrients: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Súp lơ xanh',
        imgURL: 'http://localhost:3000/uploads/food/sup-lo-xanh.png',
        servingSize: { amount: 100, unit: 'g', weightInGram: 100 },
        nutrients: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Sữa chua Hy Lạp',
        imgURL: 'http://localhost:3000/uploads/food/sua-chua-hy-lap.png',
        servingSize: { amount: 100, unit: 'g', weightInGram: 100 },
        nutrients: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
        isPublic: true,
        verifyStatus: 'approved'
    },
    {
        name: 'Bơ đậu phộng',
        imgURL: 'http://localhost:3000/uploads/food/bo-dau-phong.png',
        servingSize: { amount: 32, unit: 'g', weightInGram: 32 },
        nutrients: { calories: 188, protein: 8, carbs: 6, fat: 16 },
        isPublic: true,
        verifyStatus: 'approved'
    }
];

// ========== RUN SEED ==========
async function seed() {
    await connect();

    // Xóa data cũ
    await Exercise.deleteMany({});
    await Food.deleteMany({});
    console.log('🗑️  Đã xóa data cũ');

    // Insert data mới
    await Exercise.insertMany(exercises);
    console.log(`✅ Đã insert ${exercises.length} exercises`);

    await Food.insertMany(foods);
    console.log(`✅ Đã insert ${foods.length} foods`);

    console.log('\n🎉 Seed data hoàn tất!');
    process.exit(0);
}

seed();