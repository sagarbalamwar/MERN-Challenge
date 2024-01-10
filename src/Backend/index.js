const express = require("express")
const mongoose = require("mongoose")
const axios = require("axios")
const cors = require("cors")
const app = express()
const port = 3000
app.use(cors())
mongoose.connect("mongodb://127.0.0.1:27017/Task2")

const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  sold: String,
})

const Transaction = mongoose.model("Transaction", transactionSchema)

// Middleware for parsing JSON requests
app.use(express.json())

// API to initialize the database with seed data from the third-party API
app.get("/initializeDatabase", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    )
    const seedData = response.data

    await Transaction.insertMany(seedData)

    res.status(200).json({ message: "Database initialized successfully." })
  } catch (error) {
    console.error("Error initializing database:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// API to list all transactions with search and pagination support
app.get("/transactions", async (req, res) => {
  try {
    const { page = 1, perPage = 5, search } = req.query
    const query = search
      ? {
          $or: [
            { title: new RegExp(search, "i") },
            { description: new RegExp(search, "i") },
            { price: new RegExp(search, "i") },
          ],
        }
      : {}
    const transactions = await Transaction.find(query)
      .limit(Number(perPage))
      .skip((Number(page) - 1) * Number(perPage))

    res.status(200).json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Other APIs for statistics, bar chart, pie chart, and combined response go here...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
