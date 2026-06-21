import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

function Login(){
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  })
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const res = await axios.post("https://nexora-backend-yo2e.onrender.com/api/auth/login", formData, { withCredentials: true })
      alert(res.data.message || "Logged in successfully")
      navigate("/dashboard")
    }catch(err){
      console.log(err)
      alert(err, "\nSomething went wrong, Log in failed")
    }
  }
  return(
    <div className="container">
      <div className="card auth">
        <h1 className="title auth">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email/Username</label>
            <input name="identifier" type="text" placeholder="Enter email or username" onChange={handleInput} value={formData.identifier} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="password" onChange={handleInput} value={formData.password} required />
          </div>
          <button className="btn btn-primary" type="submit">Submit</button>
          <p className="Q-prompt">Don't have an account? <Link to="/register">Register</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Login