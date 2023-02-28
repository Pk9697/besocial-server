import express from "express";
import router from "./routes/index.js";
import db from "./config/mongoose.js";

const port = 3001;
const app = express();

/* MIDDLEWARES */
//use express router
app.use("/", router);



/* RUN SERVER */
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server : ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
