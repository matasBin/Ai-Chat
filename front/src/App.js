import './App.css';
import {useEffect, useRef, useState} from "react";
import {socket} from "./socket";

function App() {

    const conversationInput = useRef(null)
    const [messages, setMessages] = useState([])
    const [conversationEnded, setConversationEnded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const chatContainerRef = useRef(null)

    function startConversation() {
        const topic = conversationInput.current.value
        setMessages([{type: 'user', content: topic}])
        setConversationEnded(false)
        setIsLoading(true)
        socket.emit("startConversation", topic)
        conversationInput.current.value = ""
    }

    async function nextTurn() {
        if(!conversationEnded) {
            setIsLoading(true)
            socket.emit("next-turn")
        }
    }

    useEffect(() => {
        socket.on("conversationStarted", (data) => {
            console.log(data)
            setIsLoading(false)
            setMessages(prev => [...prev,
                {type: 'system', content: data.message},
                {type: 'system', content: `Participants: ${data.participants.join(", ")}`}
            ])
        })
        socket.on("aiResponse", (data) => {
            setIsLoading(false)
            setMessages(prev => [...prev,
                {type: 'ai', content: data.content, speaker: data.speaker}
            ])
        })
        socket.on("conversationEnded", (data) => {
            setIsLoading(false)
            setMessages(prev => [...prev,
                {type: 'system', content: data.message}
            ])
            setConversationEnded(true)
        })
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading])


    return (
        <div className="App">
            <div className="chatBox" ref={chatContainerRef}>
                {messages.map((item, index) => (
                    <div key={index} className={`message ${item.type}`}>
                        {item.type === 'system' ? (
                            <div className="system-content">{item.content}</div>
                        ) : item.type === 'user' ? (
                            <div className="user-message">
                                <div className="message-label">You:</div>
                                <div className="content">{item.content}</div>
                            </div>
                        ) : (
                            <div className="ai-message">
                                <div className="speaker-name">{item.speaker}</div>
                                <div className="content">{item.content}</div>
                            </div>
                        )}
                    </div>
                ))}

                {
                    isLoading &&
                    <div className={"typing-container"}>
                        <div className={"typing-indicator"}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className={"typing-label"}>AI is thinking...</div>
                    </div>
                }

            </div>

            <div className="inputs">
                <input type="text" placeholder={"Start a conversation"} ref={conversationInput}/>
                <button onClick={startConversation}>Start conversation</button>
                <button onClick={nextTurn}>Next turn</button>
            </div>

        </div>
    );
}

export default App;
