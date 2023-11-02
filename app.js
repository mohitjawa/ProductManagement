const express = require("express");
const app = express();
const Router = require("./routes/route");
require("dotenv").config();
require("./db/conn");
app.use(express.json());

app.use("/", Router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
