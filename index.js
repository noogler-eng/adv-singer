const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { user_route } = require("./route_user/index.js");
const { token_route } = require("./route_token/index.js");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/v1', user_route);
app.use('/v1', token_route);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server listens at: ", PORT);
});