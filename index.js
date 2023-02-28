import express from "express";

const port = 3001;
const app = express();

app.get("/", (req, res) => res.send("Homepage"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server : ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
