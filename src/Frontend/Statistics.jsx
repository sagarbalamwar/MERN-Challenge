import axios from "axios"

import React, { useEffect, useState } from "react"

const Statistics = () => {
  const [statistics, setstatistics] = useState([])
  const [month, setmonth] = useState("3")
  useEffect(() => {
    const fetchstatistics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/transactions/statistics?month=${month}`
        )
        setstatistics(response.data)
      } catch (error) {
        console.error("Error in fetching statistics", error)
      }
    }
    fetchstatistics()
  }, [month])
  const changeMonth = (event) => {
    setmonth(event.target.value)
  }
  return (
    <>
      <div className="main">
        <div className="data">
          <div className="container">
            <h1>
              Statistics-<nbsp></nbsp>
            </h1>
            <div>
              <select name="Month" id="" value={month} onChange={changeMonth}>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
          </div>
          {statistics.map((item, index) => {
            return (
              <>
                <div className="statdata">
                  <p key={index}>Total Sale: {item.totalSale}</p>
                  <p key={index}>Total Items Sold: {item.totalItemSold}</p>
                </div>
              </>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Statistics
