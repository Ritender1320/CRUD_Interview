const { Users } = require("../models");
const ApplicationError = require("../utils/error");
const httpStatus = require("http-status");


const signup = async (requestBody, next ) => {
    const userBody = {...requestBody, status: "active" }
    const user = await Users.create(userBody);
    return user;
};

const login = async (requestBody, next ) => {
    const {email, password} = requestBody;
    console.log(email, password);

    let user = await Users.findOne({email: email}).select("+password");
    console.log(user);
    if(!user || !(await user.correctPassword(password, user.password)))
    {
        return null;
    }

    return user;
};

module.exports = { signup, login };