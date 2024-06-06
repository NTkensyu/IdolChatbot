import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

function Chat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [userIcon, setUserIcon] = useState('/images/user-icon.jpg');
  const [botIcon, setBotIcon] = useState('/images/bot-icon.png');


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/chat/オタク1');
        setUser(response.data);
        setUserIcon(response.data.userIcon || '/images/user-icon.jpg');
        setBotIcon(response.data.botIcon || '/images/bot-icon.png');
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/chat/オタク1');
        setChatHistory(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchUserInfo();
    fetchChatHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error('ユーザーが見つかりません');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/chat', {
        username: 'みね',
        message,
      });
      setChatHistory([...chatHistory, {
        message,
        response: response.data.response,
        sender: 'user',
        username: response.data.username,
//        userIcon: response.data.userIcon,
//        botIcon: response.data.botIcon
      }, {
        message: response.data.response,
        sender: 'bot',
        username: 'アイドル',
//        userIcon: response.data.userIcon,
//        botIcon: response.data.botIcon
      }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete('http://localhost:8080/api/chat/オタク1');
      setChatHistory([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.sender}`}>
            <div className="chat-icon">
              <img src={chat.sender === 'user' ? userIcon : botIcon} alt="icon" />
            </div>
            <div className="chat-content">
              <p className="chat-username">{chat.sender === 'user' ? chat.username : 'アイドル'}</p>
              <p>{chat.message}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを作成"
        />
        <button type="submit">送信</button>
      </form>
      <button onClick={handleClearHistory} className="clear-history-button">チャット履歴削除</button>
    </div>
  );
}

export default Chat;