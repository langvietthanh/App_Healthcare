const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const foodRouter = require("./foodRouter");


function router(app){
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api/foods', foodRouter);
}

module.exports = router;// chuyền cho ../index.js