import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false)
  
  const navigate = useNavigate()
  
	useEffect(() => {
		const checkAuth = async () => {
			try {
				await axios.get(
					"https://collector-tacking-roamer.ngrok-free.dev/api/auth/me",
					{ withCredentials: true }
				)
				setLoading(false)
			}catch (error) {
			  navigate("/login")
			}
		}
		checkAuth();
	}, [])
	if (loading) {
	  return <div></div>
	}
	
	async function logoutUser(){
    await axios.post("https://collector-tacking-roamer.ngrok-free.dev/api/auth/logout",
    {},
  	{ withCredentials: true })
    navigate("/")
  }
	// AI CHAT APIS
	const [chats, setChats] = useState([])
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [messages, setMessages] = useState([])
  
  async function createNewChat(){
    try{
      const response = await axios.post("https://collector-tacking-roamer.ngrok-free.dev/api/ai/chat")
      const currentChat = response.data.chat
      setChats(prev => [currentChat, ...prev])
      setSelectedChatId(response.data.chatId)
    } catch (err){
      console.error(err)
      alert(err,"\nSomething went wrong")
    }
  }
  
  async function sendMessage(message){
    if (!selectedChatId) {
		  createNewChat()
	  }
    try{
      const response = await axios.post(`https://collector-tacking-roamer.ngrok-free.dev/api/ai/chat/${selectedChatId}/message`, {
        prompt: message
      })
      const reply = response.data.reply
      const setMessages(prev => [...prev, {
        role: "user",
        text: message
      },
      {
        role: "model",
        text: reply
      })
    } catch (err) {
      console.error(err)
      alert(err, "\nSomething went wrong")
    }
  }
	
	return (
	  <div>
      <header>
        <div className="title dashboard">Nexora AI</div>
        <button id="settings-btn" onClick={() => setShowMenu(!showMenu)}>⋮</button>
        {showMenu && (
          <div className="drop-down">
            <button>Profile</button>
            <button>Settings</button>
            <button onClick={logoutUser}>Logout</button>
          </div>
        )}
      </header>
      <div id="msg-area"></div>
      <div>
        <input type="text" id="msg-input"></input>
        <button id="send-btn">↑</button>
      </div>
    </div>
	)
}

export default Dashboard;