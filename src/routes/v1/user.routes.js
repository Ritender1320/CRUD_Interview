const express = require("express");

const router = express.Router();


const { usersController , authController } = require("../../controllers");

const {protect, restrictTo} = authController;

router
    .route("/")
    .get(protect, restrictTo("Super Admin"), usersController.listUsers);

router
    .route("/:id")
    .get(protect, restrictTo("Super Admin","User"), usersController.getUser)
    .patch(protect, restrictTo("Super Admin", "User"), usersController.updateUser)
    .delete(protect, restrictTo("Super Admin"), usersController.deleteUser);

module.exports = router;