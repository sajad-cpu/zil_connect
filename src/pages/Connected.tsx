import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import {
  MessageSquare,
  Send,
  Building2,
  Search,
  MoreVertical,
  UserPlus,
  Loader2
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
import { connectionService } from "@/api/services/connectionService";
import { messageService } from "@/api/services/messageService";
import { pb } from "@/api/pocketbaseClient";

export default function Connected() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const connectionIdFromUrl = searchParams.get("connection");

  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = pb.authStore.model?.id;

  // Fetch all accepted connections
  const { data: connections = [], isLoading: loadingConnections } = useQuery({
    queryKey: ['connections'],
    queryFn: () => connectionService.getConnections(),
  });

  // Fetch conversations (connections with latest messages)
  const { data: conversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
  });

  // Fetch messages for selected connection
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', selectedConnection?.id],
    queryFn: () => selectedConnection ? messageService.getMessages(selectedConnection.id) : [],
    enabled: !!selectedConnection,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: { text: string }) => {
      if (!selectedConnection) throw new Error('No connection selected');

      // Get the other user in the connection
      const isUserFrom = selectedConnection.user_from === currentUserId;
      const receiverId = isUserFrom ? selectedConnection.user_to : selectedConnection.user_from;

      return messageService.sendMessage({
        connection_id: selectedConnection.id,
        receiver_id: receiverId,
        text: data.text,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConnection?.id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setMessageText("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send message");
    }
  });

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (selectedConnection) {
      messageService.markAllAsRead(selectedConnection.id);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  }, [selectedConnection, queryClient]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Select connection from URL parameter
  useEffect(() => {
    if (connectionIdFromUrl && connections.length > 0) {
      const connection = connections.find((c: any) => c.id === connectionIdFromUrl);
      if (connection) {
        setSelectedConnection(connection);
      }
    }
  }, [connectionIdFromUrl, connections]);

  const filteredConversations = conversations.filter((conv: any) =>
    {
      const isUserFrom = conv.connection.user_from === currentUserId;
      const otherUser = isUserFrom ? conv.connection.expand?.user_to : conv.connection.expand?.user_from;
      const otherBusiness = isUserFrom ? conv.connection.expand?.business_to : conv.connection.expand?.business_from;

      const userName = otherUser?.username || otherUser?.email || "";
      const businessName = otherBusiness?.business_name || "";

      return userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             businessName.toLowerCase().includes(searchTerm.toLowerCase());
    }
  );

  const hasConnections = connections.length > 0;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessageMutation.mutate({ text: messageText.trim() });
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Show loading state
  if (loadingConnections || loadingConversations) {
    return (
      <div className="min-h-screen bg-[#F1F1F2] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FB6542] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

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
              <h3 className="text-2xl font-bold text-[#00246B] mb-3">No Connections Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Connect with businesses to start messaging
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  className="bg-[#FB6542] hover:bg-[#e5573a] text-white"
                  onClick={() => navigate(createPageUrl("Search"))}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Find Businesses
                </Button>
                <Button
                  variant="outline"
                  className="border-[#00246B] text-[#00246B] hover:bg-[#00246B] hover:text-white"
                  onClick={() => navigate(createPageUrl("Invitations"))}
                >
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

                {/* Conversations */}
                <ScrollArea className="flex-1">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No conversations yet</p>
                    </div>
                  ) : (
                    filteredConversations.map((conv: any) => {
                      const isUserFrom = conv.connection.user_from === currentUserId;
                      const otherUser = isUserFrom ? conv.connection.expand?.user_to : conv.connection.expand?.user_from;
                      const otherBusiness = isUserFrom ? conv.connection.expand?.business_to : conv.connection.expand?.business_from;

                      return (
                        <div
                          key={conv.connection.id}
                          onClick={() => setSelectedConnection(conv.connection)}
                          className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                            selectedConnection?.id === conv.connection.id
                              ? 'bg-orange-50 border-l-4 border-l-[#FB6542]'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00246B] to-[#FB6542] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                {otherBusiness?.business_name?.[0]?.toUpperCase() || "?"}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="font-semibold text-[#00246B] text-sm truncate">
                                  {otherUser?.username || otherUser?.email || "Unknown User"}
                                </h3>
                                {conv.latestMessage && (
                                  <span className="text-xs text-gray-500">
                                    {formatLastMessageTime(conv.latestMessage.created)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mb-1 truncate">{otherBusiness?.business_name}</p>
                              {conv.latestMessage && (
                                <p className="text-sm text-gray-600 truncate">
                                  {conv.latestMessage.text}
                                </p>
                              )}
                            </div>
                            {conv.unreadCount > 0 && (
                              <div className="w-5 h-5 bg-[#FB6542] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className="md:col-span-2 flex flex-col bg-white">
                {selectedConnection ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                      {(() => {
                        const isUserFrom = selectedConnection.user_from === currentUserId;
                        const otherUser = isUserFrom ? selectedConnection.expand?.user_to : selectedConnection.expand?.user_from;
                        const otherBusiness = isUserFrom ? selectedConnection.expand?.business_to : selectedConnection.expand?.business_from;

                        return (
                          <>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00246B] to-[#FB6542] flex items-center justify-center text-white font-bold">
                                {otherBusiness?.business_name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <h3 className="font-bold text-[#00246B]">{otherUser?.username || otherUser?.email || "Unknown User"}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Building2 className="w-3 h-3" />
                                  <span>{otherBusiness?.business_name}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost" className="text-[#00246B] hover:bg-gray-100">
                                    <MoreVertical className="w-5 h-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4 bg-gray-50">
                      {loadingMessages ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="w-8 h-8 text-[#FB6542] animate-spin" />
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No messages yet. Start the conversation!</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message: any) => {
                            const isMine = message.sender_id === currentUserId;

                            return (
                              <div
                                key={message.id}
                                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                    isMine
                                      ? 'bg-[#FB6542] text-white rounded-br-none'
                                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                  }`}
                                >
                                  <p className="text-sm">{message.text}</p>
                                  <p className={`text-xs mt-1 ${
                                    isMine ? 'text-white/70' : 'text-gray-500'
                                  }`}>
                                    {formatMessageTime(message.created)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </ScrollArea>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="flex-1"
                          disabled={sendMessageMutation.isPending}
                        />
                        <Button
                          type="submit"
                          size="icon"
                          className="bg-[#FB6542] hover:bg-[#e5573a] text-white"
                          disabled={sendMessageMutation.isPending || !messageText.trim()}
                        >
                          {sendMessageMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
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
