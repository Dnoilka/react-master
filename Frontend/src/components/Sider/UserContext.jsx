// UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    return savedUser && token ? JSON.parse(savedUser) : null
  })

  const verifyToken = async token => {
    try {
      const response = await fetch("/api/verify-token", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) return false

      const data = await response.json()
      return data.valid
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token && (await verifyToken(token))) {
        const userData = JSON.parse(localStorage.getItem("user"))
        setUser(userData)
      } else {
        logout()
      }
    }
    checkAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const updateUser = newUserData => {
    const updatedUser = { ...user, ...newUserData }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
