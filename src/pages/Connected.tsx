import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Paperclip,
  User,
  Building2,
  Search,
  MoreVertical,
  Phone,
  Video,
  UserPlus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Connected() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock connections - replace with real data
  const connections = [
    { 
      id: 1, 
      userName: "John Smith", 
      businessName: "Tech Solutions Inc", 
      lastMessage: "Looking forward to our meeting tomorrow", 
      timestamp: "2 hours ago",
      unread: 2,
      online: true
    },
    { 
      id: 2, 
      userName: "Sarah Johnson", 
      businessName: "Digital Marketing Pro", 
      lastMessage: "Thanks for the proposal!", 
      timestamp: "Yesterday",
      unread: 0,
      online: true
    },
    { 
      id: 3, 
      userName: "Mike Chen", 
      businessName: "Global Logistics Ltd", 
      lastMessage: "Can we schedule a call?", 
      timestamp: "2 days ago",
      unread: 1,
      online: false
    },
  ];

  // Mock messages for selected chat
  const messages = selectedChat ? [
    { id: 1, sender: "them", text: "Hi! I saw your business profile", timestamp: "10:30 AM" },
    { id: 2, sender: "me", text: "Hello! Thanks for reaching out", timestamp: "10:32 AM" },
    { id: 3, sender: "them", text: "I'd love to discuss a potential partnership", timestamp: "10:35 AM" },
    { id: 4, sender: "me", text: "That sounds great! When would you like to connect?", timestamp: "10:40 AM" },
    { id: 5, sender: "them", text: "Looking forward to our meeting tomorrow", timestamp: "11:15 AM" },
  ] : [];

  const filteredConnections = connections.filter(conn =>
    conn.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasConnections = connections.length > 0;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      console.log("Send message:", messageText);
      setMessageText("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F1F2]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00246B] to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Messages</h1>
          </div>
          <p className="text-xl text-white/90">Chat with your connected businesses</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!hasConnections ? (
          <Card className="text-center py-16 border-none shadow-lg">
            <CardContent>
              <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#00246B] mb-3">Start Your Connection Journey</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Add your first connection or start your journey to connect with businesses that match your goals
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-[#FB6542] hover:bg-[#e5573a] text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Find Businesses
                </Button>
                <Button variant="outline" className="border-[#00246B] text-[#00246B] hover:bg-[#00246B] hover:text-white">
                  View Invitations
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
            <div className="grid md:grid-cols-3 h-full">
              {/* Connections List */}
              <div className="border-r border-gray-200 flex flex-col bg-white">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search connections..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Connections */}
                <ScrollArea className="flex-1">
                  {filteredConnections.map((connection) => (
                    <div
                      key={connection.id}
                      onClick={() => setSelectedChat(connection)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                        selectedChat?.id === connection.id
                          ? 'bg-orange-50 border-l-4 border-l-[#FB6542]'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00246B] to-[#FB6542] flex items-center justify-center text-white font-bold">
                            {connection.userName[0]}
                          </div>
                          {connection.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-[#00246B] text-sm truncate">
                              {connection.userName}
                            </h3>
                            <span className="text-xs text-gray-500">{connection.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1 truncate">{connection.businessName}</p>
                          <p className="text-sm text-gray-600 truncate">{connection.lastMessage}</p>
                        </div>
                        {connection.unread > 0 && (
                          <div className="w-5 h-5 bg-[#FB6542] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {connection.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className="md:col-span-2 flex flex-col bg-white">
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00246B] to-[#FB6542] flex items-center justify-center text-white font-bold">
                            {selectedChat.userName[0]}
                          </div>
                          {selectedChat.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#00246B]">{selectedChat.userName}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Building2 className="w-3 h-3" />
                            <span>{selectedChat.businessName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="text-[#00246B] hover:bg-gray-100">
                          <Phone className="w-5 h-5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-[#00246B] hover:bg-gray-100">
                          <Video className="w-5 h-5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-[#00246B] hover:bg-gray-100">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Share Contact</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4 bg-gray-50">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                message.sender === 'me'
                                  ? 'bg-[#FB6542] text-white rounded-br-none'
                                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'me' ? 'text-white/70' : 'text-gray-500'
                              }`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center gap-2">
                        <Button type="button" size="icon" variant="ghost" className="text-gray-500 hover:bg-gray-100">
                          <Paperclip className="w-5 h-5" />
                        </Button>
                        <Input
                          placeholder="Type your message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="icon" className="bg-[#FB6542] hover:bg-[#e5573a] text-white">
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
                      <p className="text-gray-500">Choose from your connected businesses to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}