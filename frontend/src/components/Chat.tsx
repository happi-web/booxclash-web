import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./css/chat.css";

const socket = io("http://localhost:4000");

const ChatBox = () => {
  const [messages, setMessages] = useState<{ userId: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Generate or retrieve userId
    let storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = Math.random().toString(36).substring(7);
      sessionStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);

    // Listen for incoming messages
    socket.on("receiveMessage", (message: { userId: string; text: string }) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && userId) {
      const message = { userId, text: input };
      socket.emit("sendMessage", message);
      setInput(""); 
    }
  };
  

  return (
    <div className="chat-box">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.userId === userId ? "sent" : "received"}`}
          >
            <div className="message-avatar">
              {msg.userId === userId ? "Me" : "Other"}
            </div>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
