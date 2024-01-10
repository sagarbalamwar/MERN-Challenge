const express = require("express")
const mongoose = require("mongoose")
const axios = require("axios")
const cors = require("cors")
const app = express()
const port = 3000
app.use(cors())
mongoose.connect("mongodb://127.0.0.1:27017/Assignment")
const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  category: String,
  price: Number,
  image: String,
  dateOfSale: Date,
  sold: String,
})

const Transaction = mongoose.model("Transaction", transactionSchema)

app.get("/initializeDB", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    )
    const SeedData = response.data
    await Transaction.insertMany(SeedData)
    res.status(200).json({ message: "Database created successfully" })
  } catch (error) {
    console.error("Error in createing database:  ", error)
    res.status(500).json({ error: "Error in database creating" })
  }
})
app.get("/transactions", async (req, res) => {
  try {
    const { perPage = 10, month } = req.query

    const selectMonth = parseInt(month)
    if (selectMonth < 1 || selectMonth > 12) {
      res.status(400).json({ error: "month is not valid" })
    }
    const query = {
      $and: [
        {
          $expr: {
            $eq: [{ $month: { $toDate: "$dateOfSale" } }, selectMonth],
          },
        },
      ],
    }
    const transactions = await Transaction.find(query).limit(Number(perPage))
    res.status(200).json(transactions)
  } catch (error) {
    console.error("Error in fetching transactions", error)
    res.status(500).json({ error: "Error in transactions" })
  }
})

app.get("/transactions/statistics", async (req, res) => {
  try {
    const { month } = req.query
    if (!month) {
      res.sendStatus(400).json({ error: "month is required" })
    }
    const selectMonth = parseInt(month)
    if (selectMonth < 1 || selectMonth > 12) {
      res.status(400).json({ error: "month is not valid" })
    }
    const pipe = [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$dateOfSale" }, selectMonth] },
              { $eq: ["$sold", "true"] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSale: { $sum: "$price" },
          totalItemSold: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalItemSold: 1,
          totalSale: 1,
        },
      },
    ]
    const result = await Transaction.aggregate(pipe)
    res.status(200).json(result)
  } catch (error) {
    console.error("Error in fetching statistics", error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
