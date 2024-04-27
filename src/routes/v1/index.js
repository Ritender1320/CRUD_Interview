const express = require("express");

const authRoute = require("./auth.routes");
//const userRoute = require("./users.route");

const productRoute = require("./product.routes");

const router = express.Router();


const defaultRoutes = [
    { path: "/products", route: productRoute },
    { path: "/auth", route: authRoute },
    // { path: "/users", route: userRoute },
]


defaultRoutes.forEach( (route) => {
    router.use(route.path, route.route);
});

module.exports = router;