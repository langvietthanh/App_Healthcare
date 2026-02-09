const authRouter = require("./authRouter");


function router(app){
    app.use('/api/auth', authRouter);

}


module.exports = router;// chuyền cho ../index.js