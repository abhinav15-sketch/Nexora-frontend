import React from "react";
import { useNavigate } from "react-router-dom"

function LandingPage() {
  const navigate = useNavigate()
	return (
		<div className="container">
			<div className="card">
				<h1 className="title">Welcome to Chatwave</h1>
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