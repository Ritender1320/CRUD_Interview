const express = require("express");

const { body, validationResult } = require('express-validator');

const { authController } = require("../../controllers");
const { protect, restrictTo } = require("../../controllers/auth.controller");

const { Users } = require("../../models");
const router = express.Router();

router
    .route("/signup")
    .post(authController.signup);

router
    .route("/login")
    .post(authController.login);

router
    .route("/updatePassword")
    .post(protect, restrictTo("Super Admin", "User"), authController.updatePassword);
    
module.exports = router;