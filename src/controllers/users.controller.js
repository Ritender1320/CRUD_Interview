const httpStatus = require("http-status");

const { catchAsync, ApplicationError } = require('../utils');

const { usersService } = require("../services");

const getUser = catchAsync(async (req, res, next) => {
    const user = await usersService.getUser(req.params.id, next);
    if(!user)
    {
        return next(new ApplicationError("User not found", httpStatus.NOT_FOUND));
    }

    return res.status(httpStatus.OK).json({ user });
});

const listUsers = catchAsync(async (req, res, next) => {
    const users = await usersService.listUsers(next);
    if(!users)
    {
        return next(new ApplicationError("Users not found", httpStatus.NOT_FOUND));
    }

    return res.status(httpStatus.OK).json({ users });
});

const updateUser = catchAsync(async (req, res, next) => {
    const user = await usersService.updateUser(req.params.id, req.body, next);
    if(!user){
        return next(new ApplicationError("Users couldn't be updated", httpStatus.NOT_FOUND));
    }

    return res.status(httpStatus.OK).json({ user });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const user = await usersService.deleteUser(req.params.id, next);
    if(!user){
        return next(new ApplicationError("Users couldn't be deleted", httpStatus.NOT_FOUND));
    }
    return res.status(httpStatus.OK).json({ user });
});

module.exports = { getUser, listUsers, updateUser, deleteUser};