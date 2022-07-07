import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"

function App() {
  const [ state, setState ] = useState({ message: "", name: "" })
  const [nameSubmit, setNameSubmit] = useState(false)
  const [nameUser, setNameUser]=useState("")
  const [ chat, setChat ] = useState([])
  const socketRef = useRef()
  const onNameChange = (e) =>{
    setNameUser(e.target.value)
  }
  const nameSubmitForm =()=>{
    setNameSubmit(true)
  }
  const onContentChange =(e) =>{
    const getNameUser = nameUser;
    console.log(e.target.value)
    
    setState({ ...state, name: getNameUser , message: e.target.value })
    console.log(state)
  }
  const onMessageSubmit = (e) => {
		const { name, message } = state
		socketRef.current.emit("message", { name, message })
		e.preventDefault()
		setState({ message: "", name })
    console.log(state)
	}
  useEffect(
		() => {
      document.title = "Chat App"
			socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)
	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
       nameUser === name ? (
        <div>
          <div className="bg1 mb-2 p-2 float-right box-messenger mr-4">
            <p className="mb-0 text-messenger text-white">{message} </p>
          </div>
          <div style={{clear: 'both'}}></div>
        </div>
       ):(
        <div>
          <div className="bg2 mb-2 p-2 float-left box-messenger ">
            <p className="mb-0 text-messenger">{message}</p>
          </div>
        <div style={{clear: 'both'}}></div>
        </div>
       )
		))
	}
  return (
    nameSubmit ? (
      <div className="box-main ">
          <div className="bg1 p-3 box-header">
          <p className="font-weight-bold text-white mb-0 text-center text-xl ">{nameUser}</p>
      </div>
      <div className="p-2 box-content">
        {renderChat()}
      </div>
      <form onSubmit={onMessageSubmit}>
        <div className="pl-2 pt-2 box-bottom bg1">
          <div className="box-input">
            <input onChange={(e) => onContentChange(e)} value={state.message} name="message"
                placeholder="Enter your message" 
                className="bg2 pl-2 input-text" 
                type="text" />
          </div>
          <div className="px-2 box-button">
            <button className="bg3 text-center reply-button text-white">
              <i className="text-white" aria-hidden="true" />Send
            </button>
          </div>
        </div>
      </form>
      </div>
      ):(
        <form onSubmit={nameSubmitForm} >
          <div className="flex items-center justify-center p-32">
            <input name="name" onChange={(e) => onNameChange(e)} value={nameUser.name} placeholder="Receiver" className="p-1 rounded-md"></input>
            <button className="mx-2">Enter Chat</button>
          </div>
        </form>
      )
  )
}
export default App