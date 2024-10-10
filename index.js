const express = require("express");
const cors = require("./middleware/cors");
const bodyParser = require("body-parser");
const coinRoutes = require("./routes/coins");
const { connectDB } = require("./config/db");
const { fetchCoins } = require("./controllers/coinController");

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hi browser , how are you !!!");
});

// Fetch coin data on server startup and every 2 hours
fetchCoins();
setInterval(fetchCoins, 7200000);

app.use("/coins", coinRoutes);

app.listen(port, () => console.log(`App listening on port ${port}`));
