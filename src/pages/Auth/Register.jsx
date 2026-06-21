import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

function Register(){
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "user"
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
      const res = await axios.post("https://collector-tacking-roamer.ngrok-free.dev/api/auth/register", formData)
      alert(res.data.message || "Registered successfully")
      navigate("/dashboard")
    }catch(err){
      console.log(err)
      alert(err.response.data.message || "Something went wrong, Registration failed")
    }
  }
  return(
    <div className="container">
      <div className="card auth">
        <h1 className="title auth">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input name = "email" type="email" placeholder="example@gmail.com" onChange={handleInput} value={formData.email} required />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input name="username" type="text" placeholder="user" onChange={handleInput} value={formData.username} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="password" onChange={handleInput} value={formData.password} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" onChange={handleInput} value={formData.role}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className="btn btn-primary" type="submit">Submit</button>
          <p className="Q-prompt">Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Register