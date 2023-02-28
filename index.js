import express from "express";
import router from "./routes/index.js";
import db from "./config/mongoose.js";
import passport from "passport"
import passportJWT from "passport-jwt"

const port = 3001;
const app = express();

/* MIDDLEWARES */
app.use(express.json());
app.use(passport.initialize());
// app.use(passport.session());

//use express router
app.use("/", router);



/* RUN SERVER */
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server : ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
