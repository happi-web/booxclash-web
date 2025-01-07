import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import "./css/chat.css";
import NavBar from "./NavBar";

interface User {
  id: string;
  name: string;
  role: "teacher" | "student";
  isOnline: boolean;
}

const socket: Socket = io("http://localhost:4000"); // Connect to backend

const Chat: React.FC = () => {
  const [activeChat, setActiveChat] = useState<"teachers" | "students">("students");
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    // Listen for online users from the server
    socket.on("onlineUsers", (users: User[]) => {
      setOnlineUsers(users);
    });

    // Listen for incoming messages
    socket.on("receiveMessage", (message: { sender: string; text: string }) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup
    return () => {
      socket.off("onlineUsers");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const message = { sender: "You", text: inputMessage.trim() };
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit("sendMessage", { ...message, chatRoom: activeChat });
      setInputMessage("");
    }
  };

  return (
    <>
      <NavBar />
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
