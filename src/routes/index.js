const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const foodRouter = require("./foodRouter");
const exerciseRouter = require("./exerciseRouter");
const dailyLogRouter = require("./dailyLogRouter");
const workoutPlanRouter = require("./workoutPlanRouter");
const reportRouter = require("./reportRouter");

function router(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api/foods', foodRouter);
    app.use('/api/exercises', exerciseRouter);
    app.use('/api/daily-logs', dailyLogRouter);
    app.use('/api/workout-plans', workoutPlanRouter);
    app.use('/api/reports', reportRouter);
}

module.exports = router;