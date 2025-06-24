require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { aiChat } = require("./req");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.post("/chat", aiChat);


app.listen(port, () => {
  console.log("Running");
});
