const path = require("path");

const fs = require("fs");

const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");

const {mongoDb} = require("./src/config");
const routes = require("./src/routes/v1/index");

const errorMiddleware = require("./src/middleware/error");
const { title } = require("process");

const port = process.env.PORT || 3000;

const app = express();

// mongoose.connect(mongoDb.mongoDBUri, mongoDb.mongoDBOptions, () => {
//     console.log("Connected to MongoDB 📌...");
// });

app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use(cors());

app.use(errorMiddleware);

app.use("/v1", routes);

app.get("/", (_req, res)=>{
    return res.json({
        title: "Backend API Service",
        author: `Ritender`
    });
});

// app.listen(port, () => console.log(`Server running on port ${port}`));

const startDB = async () => {

    if (!mongoDb.mongoDbUri) {
        throw new Error('mongoDB.mongoDBUri, must be defined');
    }
    try {
        console.log(mongoDb);
        await mongoose.connect(mongoDb.mongoDbUri, mongoDb.mongoDbOptions);
        console.log("Connected to MongoDB 📌...");

    } catch (err) {
        // throw new DbConnectionError();
        console.log(err);
    }


};

startDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port} 🔥`);
    });
})