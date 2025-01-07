import React, { useState, useEffect } from "react";
import "./css/chat.css";
import NavBar from "./NavBar";

interface User {
  id: string;
  name: string;
  role: "teacher" | "student";
  isOnline: boolean;
}

const Chat: React.FC = () => {
  const [activeChat, setActiveChat] = useState<"teachers" | "students">("students");
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  // Simulated data for online users
  useEffect(() => {
    const mockUsers: User[] = [
      { id: "1", name: "Mr. Smith", role: "teacher", isOnline: true },
      { id: "2", name: "Ms. Johnson", role: "teacher", isOnline: false },
      { id: "3", name: "Alice", role: "student", isOnline: true },
      { id: "4", name: "Bob", role: "student", isOnline: true },
    ];
    setOnlineUsers(mockUsers);
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", text: inputMessage.trim() },
      ]);
      setInputMessage("");
    }
  };

  return (
    <>
    <NavBar/>
        <div className="chat-container">
      <div className="sidebar">
        <h2>Chat Rooms</h2>
        <button
          className={`chat-button ${activeChat === "students" ? "active" : ""}`}
          onClick={() => setActiveChat("students")}
        >
          Students
        </button>
        <button
          className={`chat-button ${activeChat === "teachers" ? "active" : ""}`}
          onClick={() => setActiveChat("teachers")}
        >
          Teachers
        </button>

        <h3>Online Users</h3>
        <ul className="online-users">
          {onlineUsers
            .filter((user) => user.isOnline && user.role === activeChat.slice(0, -1))
            .map((user) => (
              <li key={user.id}>
                {user.name} <span className="status-indicator online"></span>
              </li>
            ))}
        </ul>
      </div>

      <div className="chat-room">
        <div className="chat-header">
          <h2>Chat with {activeChat === "students" ? "Students" : "Teachers"}</h2>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
    </>

  );
};

export default Chat;
