const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/controller");
const middleware = require("../helper/validation/joi");
const auth = require("../helper/auth/auth");

router.post("/signup", middleware.signUpVal, userCtrl.signup);
router.post("/login", middleware.loginVal, userCtrl.login);
router.get("/product-list",auth.checkToken, userCtrl.productList);
router.post("/log-out",auth.checkToken, userCtrl.logOut);

module.exports = router;
