const httpStatus = require("http-status");

const jwtConfig = require("../config").jwt;
const jwt = require("jsonwebtoken");

const { catchAsync, ApplicationError } = require('../utils');

const { authServices } = require("../services");

const util = require('util');

const host_url = process.env.HOST_URL;

const { Users } = require("../models");
const userModel = require("../models/user.model");
const { sign } = require("crypto");

const signJwtToken = (id) => {
    return jwt.sign({
        id: id
    },
        jwtConfig.superSecertKey,
        {
            expiresIn: jwtConfig.expiresIn,
        }
    )
}

const protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new ApplicationError("You are not logged  in.", httpStatus.UNAUTHORIZED));
    }

    const jwtDecodedToken = await util.promisify(jwt.verify)(token, jwtConfig.superSecertKey);

    const currentUser = await Users.findById(jwtDecodedToken.id);
    if (!currentUser) {
        return next(new ApplicationError("This token doesn't belong to any user", httpStatus.UNAUTHORIZED));
    }

    if (currentUser.status === "inactive") {
        return next(new ApplicationError("The user has been deactivated, Kindly contact to Admin", httpStatus.UNAUTHORIZED));
    }

    req.user = currentUser;

    next();
});

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
        {
            return next(new ApplicationError("You are not authorized to perform this action", httpStatus.FORBIDDEN));
        }

        next();
    }
}

const signup = catchAsync(async (req, res, next) => {
    let user = await Users.findOne({email: req.body.email});
    if(user)
    {
        return next(new ApplicationError("Another User with the given email, already exists", httpStatus.NOT_ACCEPTABLE));
    }

    user = await authServices.signup(req.body, next);
    if(!user)
    {
        return next(new ApplicationError("User couldn't be created", httpStatus.NOT_FOUND));
    }

    const token = signJwtToken(user._id);

    return res.status(httpStatus.CREATED).json({
        status: "success",
        token: token,
        user: user
    });
})

const login = catchAsync(async (req, res, next) => {
    const user = await authServices.login(req.body, next)
    if(!user)
    {
        console.log("User not found");
        return next(new ApplicationError("Invalid Credentials, please try again", httpStatus.BAD_REQUEST));
    }

    if(user.status === "inactive")
    {
        return next(new ApplicationError("The User has been deactivated, Kindly contact the organization Admin", httpStatus.UNAUTHORIZED));
    }

    const token = signJwtToken(user._id);

    return res.status(200).json({
        user: user,
        token: token
    });
});

const updatePassword = catchAsync(async (req,res,next) => {

    const currentPassword = req.body.currentPassword;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    console.log(password, confirmPassword);

    const user = await Users.findById(req.user.id).select("+password");     //to get the password field from User model which is not available in find() since we changed the select value to false;

    if(!(await user.correctPassword(currentPassword, user["password"])))
    {
        return next(new ApplicationError("Your password is incorrect", httpStatus.BAD_REQUEST));
    }

    user["password"] = password;
    user["confirmPassword"] = confirmPassword;

    await user.save();

    console.log("User Password Updated");

    const token = signJwtToken(user._id);
    return res.status(httpStatus.OK).json({"status": "success", message: "Your Password has been Updated", token: token});

});

module.exports = {signup, protect, restrictTo, login, updatePassword};