require("dotenv").config();

const express = require("express");

const connectDB = require("./src/config/dbcon");

const demoRoutes = require("./src/routes/demoRoutes");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const app = express();



// DATABASE CONNECTION


connectDB();



// MIDDLEWARE


app.use(express.json());



// ROUTES


app.use("/api/demo", demoRoutes);



// DEFAULT ROUTE


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MongoDB Indexing Demo API is running"
  });
});


// SERVER


const PORT = process.env.PORT || 3009;


app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});