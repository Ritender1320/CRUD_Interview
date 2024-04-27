const express = require("express");

const router = express.Router();


const { productsController , authController } = require("../../controllers");

const {protect, restrictTo} = authController;

router
    .route("/list")
    .get(protect, restrictTo("Super Admin","User"), productsController.listProducts);

router
    .route("/:id")
    .get(protect, restrictTo("Super Admin","User"), productsController.getProduct)
    .patch(protect, restrictTo("Super Admin"), productsController.updateProduct)
    .delete(protect, restrictTo("Super Admin"), productsController.deleteProduct);

module.exports = router;
