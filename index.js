const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cors = require("cors");
dotenv.config({ path: "./config/config.env" });

connectDB();
const authentication = require("./routes/authentication");
const products = require("./routes/products");

const app = express();
app.use(cors());
app.use(express.json());

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// MyModel.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });

// app.use('/api/v1/transactions', transactions);
app.use("/api/authentication", authentication);
app.use("/api/products", products);

// if(process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
// }

const PORT = process.env.PORT || 5000;

app
  .get("*", (req, res) => res.send("API :)"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
