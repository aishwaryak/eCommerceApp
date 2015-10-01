var mysql = require("mysql");
function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {

    var health = require('./routes/health');
	var registerController = require('./routes/register');
	var loginController = require('./routes/login');
    var logoutController = require('./routes/logout');
    var updateController = require('./routes/updateContact');
    var viewUsersController = require('./routes/viewUsers');
    var modifyProductController = require('./routes/modifyProduct');
    var viewProductsController = require('./routes/viewProducts');

    router.use("/health",health);
	router.use("/registerUser",registerController);
	router.use("/login",loginController);
    router.use("/logout",logoutController);
    router.use("/updateInfo",updateController);
    router.use("/viewUsers",viewUsersController);
    router.use("/modifyProduct",modifyProductController);
    router.use("/getProducts",viewProductsController);
    

}

module.exports = REST_ROUTER;