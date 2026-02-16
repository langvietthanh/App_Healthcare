const authRouter = require("./authRouter");
const userRouter = require("./userRouter");


function router(app){
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
}

module.exports = router;// chuyền cho ../index.js