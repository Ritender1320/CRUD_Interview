const { Products } = require("../models");

const getProduct = async (id, next) => {
    const product = await Products.findById(id);
    return product;

}

const listProducts = async (next) => {
    const products = await Products.find({});
    return products;

}

const createProduct = async (requestBody, next) => {

    const product = await Products.create(requestBody);
    return product;

};

const updateProduct = async (productId, requestBody, next) => {

    const updatedProduct = await Products.findByIdAndUpdate(productId, requestBody, {new: true}); //new -> true for 
    return updatedProduct;
    
};


const deleteProduct = async (productId, next) => {
    const deletedProduct = await Products.findByIdAndDelete(productId);

    return deletedProduct;
};


module.exports = { getProduct, listProducts, updateProduct, deleteProduct, createProduct }