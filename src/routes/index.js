const homeRouter = require("./home");


function router(app){
    app.use('/', homeRouter);

}


module.exports = router;// chuyền cho ../index.js