
Cryptocurrency API

A simple Express-based API for fetching and managing cryptocurrency data, specifically for Bitcoin, Ethereum, and Matic. The API retrieves current market data from CoinGecko and stores it in a MySQL database.



Features
- Fetch and store cryptocurrency data (Bitcoin, Ethereum, Matic) from the CoinGecko API.
- Retrieve the latest stats for each cryptocurrency.
- Calculate and retrieve standard deviation for specified cryptocurrencies.

Technologies Used
- Node.js
- Express
- Axios
- MySQL
- dotenv
- body-parser
- CORS

Installation

1. Clone the repository
 

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```plaintext
   api_key = <this is the api key of coingecko>
   user=your_database_username
   password=your_database_password
   database_name=your_database_name
   ```

 Environment Variables
Make sure to set the following environment variables in your `.env` file:

| Variable           | Description                             |
|--------------------|-----------------------------------------|
| `user`             | Your MySQL database username            |
| `password`         | Your MySQL database password            |
| `database_name`    | Your MySQL database name                |

 API Routes

 1. Fetch Coins
- Endpoint: `GET /coins`
- Functionality: Fetches current market data for Bitcoin, Ethereum, and Matic from CoinGecko and stores it in the MySQL database.

 2. Get Stats
- Endpoint: `GET /coins/stats?coin={coinType}`
- Parameters: 
  - `coinType` - The type of coin (`bitcoin`, `ethereum`, `matic`)
- Functionality: Retrieves the latest stats (value, market cap, 24-hour change) for the specified cryptocurrency.

 3. Get Deviation
- Endpoint: `GET /coins/deviation?coin={coinType}`
- Parameters:
  - `coinType` - The type of coin (`bitcoin`, `ethereum`, `matic`)
- Functionality: Calculates and returns the mean and standard deviation of the specified cryptocurrency's values over the last 100 entries in the database.

 Commands

To start the application, run:
```bash
npm start
```



