import React, { useState, useEffect } from "react"
import axios from "axios"


export default function Data() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        )
        setData(response.data)
        console.log(response.data) // Move the console.log inside this block
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, []) // Empty dependency array means this effect runs once after the initial render

  return (
    <div>
      {data.map((item) => {
        return <p key={item.id}>{item.name}</p>
      })}
    </div>
  )
}
