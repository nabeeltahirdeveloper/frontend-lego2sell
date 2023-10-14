import axios from "axios"
import React, { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import AdminDashboard from "./Pages/AdminDashboard"
import { Loader } from "@mantine/core"

const AdminRoute = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true) // Track loading state
  const storedUserId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.lego2sell.com/user/${storedUserId}`
        )
        setUserData(response.data)
        setLoading(false) // Data fetched, set loading to false
      } catch (error) {
        console.error("An error occurred:", error)
        setLoading(false) // Error occurred, set loading to false
      }
    }

    fetchData()
  }, [storedUserId])

  // While loading, show a loading message or spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center my-auto h-full">
        <Loader />
      </div>
    )
  }

  return (
    <div>
      {userData?.admin === "admin" ? <AdminDashboard /> : <Navigate to={"/"} />}
    </div>
  )
}

export default AdminRoute
