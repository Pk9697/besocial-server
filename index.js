import express from "express";
import router from "./routes/index.js";
import db from "./config/mongoose.js";
import passport from "passport"
import passportJWT from "passport-jwt"
import fileDirName from "./utils/file-dir-name.js";
import bodyParser from "body-parser"
const {__dirname,__filename}=fileDirName(import.meta)
// console.log(__dirname,__filename)
const port = 3001;
const app = express();

/* MIDDLEWARES */
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}))
// app.use(express.bodyParser())

// app.use(passport.initialize());
// app.use(passport.session());
//make the uploads path availaible to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));
//use express router
app.use("/", router);



/* RUN SERVER */
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server : ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
