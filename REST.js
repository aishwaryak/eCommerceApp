var mysql = require("mysql");
function REST_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

REST_ROUTER.prototype.handleRoutes= function(router) {

    var health = require('./routes/health');
	var registerController = require('./routes/register');
	var loginController = require('./routes/login');
    var logoutController = require('./routes/logout');
    var updateController = require('./routes/updateContact');
    var viewUsersController = require('./routes/viewUsers');
    var modifyProductController = require('./routes/modifyProduct');
    var viewProductsController = require('./routes/viewProducts');
    var buyProductsController = require('./routes/buyProduct');
    var getOrdersController = require('./routes/getOrders'); 
    var addRelated = require('./routes/alsoBought.js');
    var getRecommendations = require('./routes/getRecommendations');

    router.use("/health",health);
	router.use("/registerUser",registerController);
	router.use("/login",loginController);
    router.use("/logout",logoutController);
    router.use("/updateInfo",updateController);
    router.use("/viewUsers",viewUsersController);
    router.use("/modifyProduct",modifyProductController);
    router.use("/getProducts",viewProductsController);
    router.use("/buyProduct",buyProductsController);
    router.use("/getOrders",getOrdersController);
    router.use("/alsoBought",addRelated);
    router.use("/getRecommendations",getRecommendations);

}

module.exports = REST_ROUTER;