const express = require("express");
const session = require("express-session");
const keys = require("./config/keys");
const stripe = require("stripe")(keys.stripeSecret);
const cors = require("cors");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");

require("./models/Product");

mongoose.connect(keys.mongoURI);

const Product = mongoose.model("products");

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

if (process.env.NODE_ENV === "dev") {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: "https://luxwebsite.josephandrewlux.com",
      credentials: true,
    })
  );
}

app.use(
  session({
    secret: keys.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 36000000, // 10 hours
      secure: true,
      httpOnly: false,
      sameSite: "none",
    },
  })
);

require("./Routes/apiRoutes")(app, Product);
require("./Routes/cartRoutes")(app, Product, stripe);

if (process.env.NODE_ENV === "dev") {
  app.listen(5000, () => {
    console.log("Express server running in development mode on port 5000");
  });
} else {
  const options = {
    key: fs.readFileSync(
      "/etc/letsencrypt/archive/api.josephandrewlux.com/privkey1.pem"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/archive/api.josephandrewlux.com/fullchain1.pem"
    ),
  };

  https.createServer(options, app).listen(443, () => {
    console.log("Express server running over HTTPS on port 443");
  });
}
