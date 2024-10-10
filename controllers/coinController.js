const axios = require("axios");
const { connection } = require("../config/db");

let bitcoin_Data = null;
let ethereum_Data = null;
let matic_Data = null;

const fetchCoins = async () => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        ids: "bitcoin,ethereum,matic-network",
      },
      headers: {
        accept: "application/json",
      },
    });

    const bitcoin = response.data.find(coin => coin.id === "bitcoin");
    bitcoin_Data = bitcoin;
    const ethereum = response.data.find(coin => coin.id === "ethereum");
    ethereum_Data = ethereum;
    const matic = response.data.find(coin => coin.id === "matic-network");
    matic_Data = matic;

    const query = `
      INSERT INTO currency (
        bitcoin_value, bitcoin_marketcap, bitcoin_twentyfourhourChange, 
        ethereum_value, ethereum_marketcap, ethereum_twentyfourhourChange,
        matic_value, matic_marketcap, matic_twentyfourhourChange
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      bitcoin.current_price, bitcoin.market_cap, bitcoin.price_change_percentage_24h,
      ethereum.current_price, ethereum.market_cap, ethereum.price_change_percentage_24h,
      matic.current_price, matic.market_cap, matic.price_change_percentage_24h
    ];

    connection.query(query, values, (err) => {
      if (err) {
        console.error("Error inserting into MySQL:", err);
        return;
      }

      connection.commit((err) => {
        if (err) {
          console.error("Error committing data:", err);
        }
      });
    });

  } catch (error) {
    console.error("Error fetching coin data:", error.message);
  }
};

const getStats = (req, res) => {
  const coinType = req.query.coin;
  let column;

  switch (coinType) {
    case "bitcoin":
      column = "bitcoin_value, bitcoin_marketcap, bitcoin_twentyfourhourChange";
      break;
    case "ethereum":
      column = "ethereum_value, ethereum_marketcap, ethereum_twentyfourhourChange";
      break;
    case "matic":
      column = "matic_value, matic_marketcap, matic_twentyfourhourChange";
      break;
    default:
      return res.status(400).send("Invalid coin type. Use 'bitcoin', 'ethereum', or 'matic'.");
  }

  const query = `SELECT ${column} FROM currency ORDER BY id DESC LIMIT 1`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching coin data from MySQL:", err);
      return res.status(500).send("Error fetching coin data from database.");
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("No data found for the requested coin type.");
    }
  });
};


const getDeviation = (req, res) => {
  const coinType = req.query.coin;
  let column = null;

  switch (coinType) {
    case "bitcoin":
      column = "bitcoin_value";
      break;
    case "ethereum":
      column = "ethereum_value";
      break;
    case "matic":
      column = "matic_value";
      break;
    default:
      return res.status(400).send("Invalid coin type. Use 'bitcoin', 'ethereum', or 'matic'.");
  }

  const query = `SELECT ${column} FROM currency ORDER BY id ASC LIMIT 100`;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error retrieving data.");
    }
    if (results.length > 0) {
      const values = results.map(result => result[column]);

      const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
      const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);

      res.json({ mean, standardDeviation: stdDev });
    } else {
      res.status(404).send("Data not found");
    }
  });
};

module.exports = {
  fetchCoins,
  getStats,
  getDeviation,
};
