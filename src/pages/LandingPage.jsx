import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function LandingPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const checkAuth = async () => {
      try{
        await axios.get(
					"https://nexora-backend-yo2e.onrender.com/api/auth/me",
					{ withCredentials: true }
				)
				navigate("/dashboard")
				setLoading(false)
      } catch (err) {
        setLoading(false)
        //Not logged in
      }
    }
    checkAuth()
  }, [])
  if (loading) {
    return(
      <div className="loading-screen">
		  	<div className="loader"></div>
			</div>
		)
  }
	return (
		<div className="container">
			<div className="card">
				<h1 className="title">Welcome to Nexora</h1>
				<p className="subtitle">Connect with people instantly and securely.</p>

				<div className="button-group">
					<button className="btn btn-outline" onClick={() => {navigate("/login")}}>
						Login
					</button>

					<button className="btn btn-primary" onClick={() => {navigate("/register")}}>
						Register
					</button>
				</div>
			</div>
		</div>
	);
}

export default LandingPage