import React, { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()
  
	useEffect(() => {
		const init = async () => {
			try {
				await axios.get(
					"https://nexora-backend-yo2e.onrender.com/api/auth/me",
					{ withCredentials: true }
				)
				setLoading(false)
			}catch (error) {
			  navigate("/login")
			}
			try{
			  await loadChatList()
			}catch (err) {
			  console.log(err)
			  alert("Something went wrong")
			}
		}
		init();
	}, [])
	async function logoutUser(){
    await axios.post("https://nexora-backend-yo2e.onrender.com/api/auth/logout",
    {},
  	{ withCredentials: true })
    navigate("/")
  }
  
	// AI CHAT APIS
	const [chats, setChats] = useState([])
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false)
  
  async function createNewChat(){
    try{
      const response = await axios.post("https://nexora-backend-yo2e.onrender.com/api/ai/chat", {}, {
        withCredentials: true
      })
      const currentChat = response.data.chat
      const chatId = response.data.chatId
      setChats(prev => [currentChat, ...prev])
      setSelectedChatId(chatId)
      return chatId
    } catch (err){
      console.error(err)
      alert("Something went wrong")
    }
  }
  
  async function sendMessage(message){
    setMessages(prev => [...prev, {
        role: "user",
        text: message
      }])
    let chatId = selectedChatId
    if (!selectedChatId) {
		  chatId = await createNewChat()
	  }
    try{
      const response = await axios.post(`https://nexora-backend-yo2e.onrender.com/api/ai/chat/${chatId}/message`, {
        prompt: message
      }, {
        withCredentials: true
      })
      const reply = response.data.reply
      setMessages(prev => [...prev,
      {
        role: "model",
        text: reply
      }])
      setChats(prev => prev.map(chat => {
        if (chat._id === chatId) {
          return {
            ...chat,
            title: response.data.title
          }
        } else {
          return chat
        }
      }))
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }
  }
	async function handleSend() {
	  if (!input.trim()) {
	    return
	  }
	  setInput("")
	  await sendMessage(input)
	}
	
	async function loadChatList() {
	  try{
	    const response = await axios.get("https://nexora-backend-yo2e.onrender.com/api/ai/chat", {
	      withCredentials: true
	    })
	    setChats(response.data.chats)
	  } catch (err) {
	    console.log(err)
	    alert("Something went wrong")
	  }
	}
	
	async function openChat(chatId) {
	  try{
	    const response = await axios.get(`https://nexora-backend-yo2e.onrender.com/api/ai/chat/${chatId}`, {
	      withCredentials: true
	    })
	    setMessages(response.data.chat.messages)
	    setSelectedChatId(chatId)
	  } catch(err) {
	    console.log(err)
	    alert("Something went wrong")
	  }
	}
	
	if (loading) {
	  return(
	    <div className="loading-screen">
		  	<div className="loader"></div>
			</div>
	 )
  }
	return (
	  <div>
      <header>
        <div className="title dashboard">Nexora AI</div>
        <button className="settings-btn" onClick={() => setShowMenu(!showMenu)}>⋮</button>
        {showMenu && (
          <div className="drop-down">
            <button>Profile</button>
            <button>Settings</button>
            <button onClick={logoutUser}>Logout</button>
          </div>
        )}
      </header>
      <button className="settings-btn menu" onClick={()=>setIsSlidebarOpen(!isSlidebarOpen)}>☰</button>
      
      <div className={`slidebar ${isSlidebarOpen ? "open" : ""}`}>
        {chats.map((chat) => {
          return <div key={chat._id} onClick={()=>openChat(chat._id)}>{chat.title}</div>
        })}
      </div>
      
      <div id="msg-area">
        {messages.map((msg, index) => {
          if (msg.role === "user") {
            return <div key={index} className="msg sent">{msg.text}</div>
          } else {
            return <div key={index} className="msg received"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          	{msg.text}
          </ReactMarkdown></div>
          }
        })}
      </div>
      
      <div>
        <input value={input} type="text" id="msg-input" onChange={(e) => setInput(e.target.value)}></input>
        <button id="send-btn" onClick={handleSend}>↑</button>
      </div>
      
      <div className={`overlay ${isSlidebarOpen ? "show" : ""}`} onClick={()=>setIsSlidebarOpen(false)}/>
    </div>
	)
}

export default Dashboard