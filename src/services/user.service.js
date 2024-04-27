const { Users } = require("../models");

const getUser = async (id, next) => {
    const user = await Users.findById(id);
    return user;

}

const listUsers = async (next) => {
    const users = await Users.find({});
    return users;

}

const updateUser = async (userId, requestBody, next) => {

    const updatedUser = await Users.findByIdAndUpdate(userId, requestBody, {new: true}); //new -> true for 
    return updatedUser;
    
};


const deleteUser = async (userId, next) => {
    const deletedUser = await Users.findByIdAndDelete(userId);

    return deletedUser;
};


module.exports = { getUser, listUsers, updateUser, deleteUser}