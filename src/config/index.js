const { mongo } = require("mongoose");

require("dotenv").config();

module.exports = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || "development",

    mongoDb: {
        mongoDbUri: process.env.MONGO_HOST + "/" + process.env.MONGO_DB_NAME,
        mongoDbOptions: {
            useNewUrlParser: true,
            userUnifiedTopology: true,
        }
    },

    jwt: {
        superSecertKey: process.env.JWT_SECERET || "CRUD_SUPER_SECERT_KEY",
        expiresIn: process.env.JWT_EXPIRY || "1d",
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRY || "10m",
        refreshExpiresIn: process.env.JWT_REFERSH_EXPIRY || "30d"
    }
}