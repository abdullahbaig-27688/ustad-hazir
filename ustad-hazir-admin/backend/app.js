const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
app.use((req, res) => {
  console.log("Hello World");
});
app.listen(PORT, (req, res) => {
  console.log(`Server running on http://localhost:${PORT}`);
});
