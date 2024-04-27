const httpStatus = require("http-status");

const { productsService } = require("../services");

const getProduct = catchAsync(async (req, res, next) => {
    const product = await productsService.getProduct(req.params.id, req.user, next);
    if(!product)
    {
        return next(new ApplicationError("Product not found", httpStatus.NOT_FOUND));
    }

    return res.status(httpStatus.OK).json({ product });
});


const listProducts = catchAsync(async (req, res, next) => {
    const products = await productsService.listProducts(req.user, next);
    if(!products || products.length === 0)
    {
        return next(new ApplicationError("Products not found", httpStatus.NOT_FOUND));
    }

    return res.status(httpStatus.OK).json({ products });
});

const updateProduct = catchAsync(async (req, res, next) => {
    const product = await productsService.updateProduct(req.params.id, req.body, req.user, next);
    if(!product){
        return next(new ApplicationError("Products couldn't be updated", httpStatus.NOT_FOUND));
    }

    return res.status(httpStatus.OK).json({ product });
});

const deleteProduct = catchAsync(async (req, res, next) => {
    const product = await productsService.deleteProduct(req.params.id, req.user, next);
    if(!product){
        return next(new ApplicationError("Products couldn't be deleted", httpStatus.NOT_FOUND));
    }
    return res.status(httpStatus.OK).json({ product });
});

module.exports = { getProduct, listProducts, updateProduct, deleteProduct};