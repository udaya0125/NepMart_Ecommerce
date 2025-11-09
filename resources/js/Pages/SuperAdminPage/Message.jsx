import React, { useState } from 'react'
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react'

const Message = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How are you doing?", sender: "other", time: "10:30 AM" },
    { id: 2, text: "I'm doing great! Thanks for asking.", sender: "me", time: "10:32 AM" },
    { id: 3, text: "That's wonderful to hear! Do you want to catch up later?", sender: "other", time: "10:33 AM" },
    { id: 4, text: "Sure! What time works for you?", sender: "me", time: "10:35 AM" },
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [contacts] = useState([
    { id: 1, name: "Sarah Johnson", lastMessage: "See you tomorrow!", time: "2m ago", unread: 2, active: true },
    { id: 2, name: "Mike Chen", lastMessage: "Thanks for your help!", time: "1h ago", unread: 0, active: false },
    { id: 3, name: "Emma Wilson", lastMessage: "That sounds great!", time: "3h ago", unread: 1, active: false },
    { id: 4, name: "Alex Turner", lastMessage: "Perfect, let's do it!", time: "5h ago", unread: 0, active: false },
  ])
  const [selectedContact, setSelectedContact] = useState(contacts[0])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setNewMessage('')
    }
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#EFE9E3' }}>
      {/* Sidebar - Contacts List */}
      <div className="w-80 border-r" style={{ backgroundColor: '#D9CFC7', borderColor: '#c9bfb7' }}>
        {/* Search Header */}
        <div className="p-4" style={{ backgroundColor: '#D9CFC7' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#4a4a4a' }}>Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5" style={{ color: '#6a6a6a' }} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: '#EFE9E3',
                borderColor: '#c9bfb7',
                color: '#4a4a4a'
              }}
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          {contacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className="p-4 cursor-pointer border-b hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: selectedContact.id === contact.id ? '#EFE9E3' : 'transparent',
                borderColor: '#c9bfb7'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
                      style={{ backgroundColor: '#EFE9E3', color: '#4a4a4a' }}
                    >
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {contact.active && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2" style={{ borderColor: '#D9CFC7' }}></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate" style={{ color: '#2a2a2a' }}>{contact.name}</h3>
                    <p className="text-sm truncate" style={{ color: '#6a6a6a' }}>{contact.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className="text-xs mb-1" style={{ color: '#6a6a6a' }}>{contact.time}</p>
                  {contact.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: '#D9CFC7', borderColor: '#c9bfb7' }}>
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
              style={{ backgroundColor: '#EFE9E3', color: '#4a4a4a' }}
            >
              {selectedContact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: '#2a2a2a' }}>{selectedContact.name}</h3>
              <p className="text-sm" style={{ color: '#6a6a6a' }}>
                {selectedContact.active ? 'Active now' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="w-5 h-5 cursor-pointer hover:opacity-70" style={{ color: '#4a4a4a' }} />
            <Video className="w-5 h-5 cursor-pointer hover:opacity-70" style={{ color: '#4a4a4a' }} />
            <MoreVertical className="w-5 h-5 cursor-pointer hover:opacity-70" style={{ color: '#4a4a4a' }} />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'me' ? 'rounded-br-none' : 'rounded-bl-none'
                }`}
                style={{
                  backgroundColor: message.sender === 'me' ? '#D9CFC7' : 'white',
                  color: '#2a2a2a'
                }}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1" style={{ color: '#6a6a6a' }}>{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t" style={{ backgroundColor: '#D9CFC7', borderColor: '#c9bfb7' }}>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#EFE9E3',
                borderColor: '#c9bfb7',
                color: '#4a4a4a'
              }}
            />
            <button
              onClick={handleSendMessage}
              className="p-3 rounded-full hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#4a4a4a' }}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Message