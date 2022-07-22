// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalized = require("./utils/capitalized");
const projectName = "giraffe";

app.locals.appTitle = `${capitalized(projectName)}`;

app.use((req, res, next) => {
    res.locals.session = req.session; // allow access to session data from layout.hbs
    next()
});




hbs.registerHelper('eq', function () {
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return args[0] == expression;
    });
});

hbs.registerHelper('eq2', function () {
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return args[0] == expression.toString();
    });
});

hbs.registerPartials( __dirname + "/views/partials"); // config. for partials

// routes 
const index = require("./routes/index.routes");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const productRoutes = require("./routes/product.routes");
app.use("/products", productRoutes)

const listRoutes = require("./routes/list.routes");
app.use("/lists", listRoutes);



// handle errors
require("./error-handling")(app);

module.exports = app;
