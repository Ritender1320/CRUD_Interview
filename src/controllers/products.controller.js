const httpStatus = require("http-status");

const { catchAsync, ApplicationError } = require('../utils');

const { productsService } = require("../services");

const getProduct = catchAsync(async (req, res, next) => {
    const product = await productsService.getProduct(req.params.id, next);
    if(!product)
    {
        return next(new ApplicationError("Product not found", httpStatus.NOT_FOUND));
    }

    return res.status(httpStatus.OK).json({ product });
});

const createProduct = async (req, res, next) => {

    const product = await productsService.createProduct(req.body, next);
    if(!product){
        return res.status(httpStatus.NOT_FOUND).json({ message: "Document Couldn't be created"});
    }
    console.log("Document created");

    return res.status(httpStatus.CREATED).json({ product });

}

const listProducts = catchAsync(async (req, res, next) => {
    const products = await productsService.listProducts(next);
    if(!products)
    {
        return next(new ApplicationError("Products not found", httpStatus.NOT_FOUND));
    }

    return res.status(httpStatus.OK).json({ products });
});

const updateProduct = catchAsync(async (req, res, next) => {
    const product = await productsService.updateProduct(req.params.id, req.body, next);
    if(!product){
        return next(new ApplicationError("Products couldn't be updated", httpStatus.NOT_FOUND));
    }

    return res.status(httpStatus.OK).json({ product });
});

const deleteProduct = catchAsync(async (req, res, next) => {
    const product = await productsService.deleteProduct(req.params.id, next);
    if(!product){
        return next(new ApplicationError("Products couldn't be deleted", httpStatus.NOT_FOUND));
    }
    return res.status(httpStatus.OK).json({ product });
});

module.exports = { getProduct, listProducts, updateProduct, deleteProduct, createProduct};