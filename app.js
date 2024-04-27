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

mongoose.connect(mongoDB.mongoDBUri, mongoDB.mongoDBOptions, () => {
    console.log("Connected to MongoDB 📌...");
});

app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use(cors());

app.use(errorMiddleware);

app.get("/", (_req, res)=>{
    return res.json({
        title: "ISM Backend API Service",
        version: `v${packageJson.version}`,
        author: `${packageJson.author}`,
        documentation: "/v1/docs",
    });
});

app.listen(port, () => console.log(`Server running on port ${prot}`));