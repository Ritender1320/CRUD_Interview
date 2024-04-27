const { Products } = require("../models");

const getProduct = async (id, next) => {
    const product = await Products.findById(id);
    return product;

}

const listProducts = async ( user, next) => {
    const products = await Products.find({}, { productName: 1, current:1, createdAt:1});
    return products;

}


const updateProduct = async (productId, requestBody, next) => {

    const updatedProduct = await Products.findByIdAndUpdate(productId, requestBody, {new: true}); //new -> true for 
    return updatedProduct;
    
};


const deleteProduct = async (productId, next) => {
    const deletedProduct = await Products.findByIdAndDelete(productId);

    return deletedProduct;
};


module.exports = { getProduct, listProducts, updateProduct, deleteProduct }