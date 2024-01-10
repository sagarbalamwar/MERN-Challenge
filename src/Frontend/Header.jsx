import React, { useState, useEffect } from "react"
import axios from "axios"

const Header = () => {
  const [transactions, setTransactions] = useState([])
  const [month, setMonth] = useState("3")
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        var url = "http://localhost:3000/transactions"
        if (month) {
          url += `?month=${month}`
        }
        const response=await axios.get(url)
        setTransactions(response.data)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      }
    }

    fetchTransactions()
  }, [month])

  const changeMonth = (event) => {
    setMonth(event.target.value)
  }
  return (
    <>
      <div>
        <h1 className="heading">Transaction Dashboard </h1>
        <div className="month">
          <p>Select Month</p>
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

        <div className="m-10 p-1 rounded overflow-hidden  ">
          <table className="border-collapse max-w-full m-2 p-2 table-auto bg-yellow-100 ">
            <tbody>
              <tr className="rounded">
                <th className="border-2 p-2">ID</th>
                <th className="border-2 p-2">TITLE</th>
                <th className="border-2 p-2">DESCRIPTION</th>
                <th className="border-2 p-2">PRICE</th>
                <th className="border-2 p-2">CATEGORY</th>
                <th className="border-2 p-2">SOLD</th>
                <th className="border-2 p-2">IMAGE</th>
              </tr>
              {transactions.map((item, key) => {
                return (
                  <tr key={key}>
                    <td className="border-2 p-1 ">{key + 1}</td>
                    <td className="border-2 p-1">{item.title}</td>
                    <td className="border-2 p-1">{item.description}</td>
                    <td className="border-2 p-1">{item.price.toFixed(2)}</td>
                    <td className="border-2 p-1">{item.category}</td>
                    <td className="border-2 p-1">{item.sold}</td>
                    <td className="border-2 p-1">
                      <img
                        className="w-16 h-16 object-cover"
                        src={item.image}
                        alt="img"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Header
