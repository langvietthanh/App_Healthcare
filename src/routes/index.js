const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const foodRouter = require("./foodRouter");
const exerciseRouter = require("./exerciseRouter");


function router(app){
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api/foods', foodRouter);
    app.use('/api/exercises', exerciseRouter);
}

module.exports = router;// chuyền cho ../index.js