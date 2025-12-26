import { pb } from "@/api/pocketbaseClient";
import { connectionService } from "@/api/services/connectionService";
import { messageService } from "@/api/services/messageService";
import { ConnectionListSkeleton, MessageSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createPageUrl } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Check,
  CheckCheck,
  Loader2,
  MessageSquare,
  MoreVertical,
  Search,
  Send,
  UserPlus
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function Connected() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const connectionIdFromUrl = searchParams.get("connection");

  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [, setOptimisticMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);
  const connectionsListRef = useRef<HTMLDivElement>(null);
  const invalidateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
    staleTime: 10000, // Consider data fresh for 10 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
  });

  // Initial fetch of messages for selected connection
  const { data: initialMessages = [], isLoading: loadingMessages, error: messagesError } = useQuery({
    queryKey: ['messages', selectedConnection?.id],
    queryFn: async () => {
      if (!selectedConnection) {
        console.log('No connection selected, returning empty array');
        return [];
      }
      console.log('Fetching messages for connection:', selectedConnection.id);
      try {
        const messages = await messageService.getMessages(selectedConnection.id);
        console.log('Fetched messages:', messages.length);
        return messages;
      } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
    },
    enabled: !!selectedConnection,
    staleTime: 30000, // Consider data fresh for 30 seconds (real-time updates handle new messages)
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Log errors
  useEffect(() => {
    if (messagesError) {
      console.error('Messages query error:', messagesError);
    }
  }, [messagesError]);

  // Update local messages state when initial messages are loaded
  useEffect(() => {
    console.log('Messages effect - selectedConnection:', selectedConnection?.id);
    console.log('Messages effect - initialMessages:', initialMessages.length);
    console.log('Messages effect - loadingMessages:', loadingMessages);

    if (selectedConnection) {
      if (initialMessages.length > 0) {
        // Sort messages by created time
        const sorted = [...initialMessages].sort((a, b) =>
          new Date(a.created).getTime() - new Date(b.created).getTime()
        );
        console.log('Setting messages:', sorted.length);
        setMessages(sorted);
      } else if (!loadingMessages) {
        console.log('No messages found, clearing state');
        setMessages([]);
      }
    } else {
      console.log('No connection selected, clearing messages');
      setMessages([]);
    }
  }, [initialMessages, selectedConnection, loadingMessages]);

  // Send message mutation with optimistic UI
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { text: string }) => {
      if (!selectedConnection) throw new Error('No connection selected');

      // Get the other user in the connection
      const isUserFrom = selectedConnection.user_from === currentUserId;
      const receiverId = isUserFrom ? selectedConnection.user_to : selectedConnection.user_from;

      // Create optimistic message
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        id: tempId,
        connection: selectedConnection.id,
        sender: currentUserId,
        receiver: receiverId,
        content: data.text,
        read: false,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };

      // Add optimistic message to UI immediately
      setOptimisticMessages(prev => new Set(prev).add(tempId));
      setMessages(prev => [...prev, optimisticMessage]);

      try {
        const result = await messageService.sendMessage({
          connection_id: selectedConnection.id,
          receiver_id: receiverId,
          text: data.text,
        });

        // Remove optimistic message - the subscription will add the real message
        setOptimisticMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(tempId);
          return newSet;
        });

        // Remove optimistic message from UI - subscription will handle adding the real one
        setMessages(prev => prev.filter(m => m.id !== tempId));

        return result;
      } catch (error) {
        // Remove optimistic message on error
        setOptimisticMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(tempId);
          return newSet;
        });
        setMessages(prev => prev.filter(m => m.id !== tempId));
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setMessageText("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send message");
    }
  });

  // Setup real-time subscription for messages
  useEffect(() => {
    console.log('Subscription effect - selectedConnection:', selectedConnection?.id);
    console.log('Subscription effect - currentUserId:', currentUserId);

    if (!selectedConnection || !currentUserId) {
      // Clear messages if no connection selected
      console.log('No connection or user, clearing messages');
      setMessages([]);
      return;
    }

    console.log('Setting up subscription for connection:', selectedConnection.id);

    // Cleanup previous subscription
    if (subscriptionRef.current && typeof subscriptionRef.current === 'function') {
      console.log('Cleaning up previous subscription');
      try {
        subscriptionRef.current();
      } catch (error) {
        console.error('Error cleaning up subscription:', error);
      }
      subscriptionRef.current = null;
    }

    // Subscribe to all messages (filtered by connection in the callback)
    const subscribeResult = pb.collection('messages').subscribe('*', (e) => {
      console.log('Subscription event:', e.action, 'for connection:', e.record.connection);
      const message = e.record;

      // Only process messages for the current connection
      if (message.connection !== selectedConnection.id) {
        return;
      }

      // Check if message is for current user (sender or receiver)
      const isRelevant = message.sender === currentUserId || message.receiver === currentUserId;

      if (isRelevant) {
        if (e.action === 'create') {
          // New message created - add to list if not already present
          setMessages(prev => {
            const exists = prev.some(m => m.id === message.id);
            if (exists) return prev;

            // Check if there's an optimistic message with same content that should be replaced
            const optimisticIndex = prev.findIndex(m =>
              m.id.startsWith('temp-') &&
              m.content === message.content &&
              m.sender === message.sender &&
              Math.abs(new Date(m.created).getTime() - new Date(message.created).getTime()) < 5000
            );

            if (optimisticIndex !== -1) {
              // Replace optimistic message with real one
              const newMessages = [...prev];
              newMessages[optimisticIndex] = message;
              return newMessages.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
            }

            // Add new message and sort by created time
            const newMessages = [...prev, message];
            return newMessages.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
          });

          // Remove from optimistic messages set if it was there
          setOptimisticMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(message.id);
            return newSet;
          });

          // Mark as read if current user is the receiver
          if (message.receiver === currentUserId && !message.read) {
            messageService.markAsRead(message.id).then(() => {
              // Update unread count in Layout
              queryClient.invalidateQueries({ queryKey: ['unread-messages-count'] });
            }).catch(console.error);
          }

          // Update conversations list (debounced to prevent excessive API calls)
          if (invalidateTimeoutRef.current) {
            clearTimeout(invalidateTimeoutRef.current);
          }
          invalidateTimeoutRef.current = setTimeout(() => {
            queryClient.invalidateQueries({
              queryKey: ['conversations'],
              refetchType: 'active'
            });
          }, 500);
        } else if (e.action === 'update') {
          // Message updated (e.g., marked as read)
          setMessages(prev => prev.map(m => m.id === message.id ? message : m));
          // Only invalidate if it's a read status update that affects the conversation list
          if (message.read !== undefined) {
            if (invalidateTimeoutRef.current) {
              clearTimeout(invalidateTimeoutRef.current);
            }
            invalidateTimeoutRef.current = setTimeout(() => {
              queryClient.invalidateQueries({
                queryKey: ['conversations'],
                refetchType: 'active'
              });
            }, 500);
          }
        } else if (e.action === 'delete') {
          // Message deleted
          setMessages(prev => prev.filter(m => m.id !== message.id));
        }
      }
    });

    // Handle the result returned by subscribe (could be a Promise or function)
    if (subscribeResult instanceof Promise) {
      subscribeResult
        .then((unsubscribe: any) => {
          console.log('Subscription created successfully');
          if (unsubscribe && typeof unsubscribe === 'function') {
            subscriptionRef.current = unsubscribe;
          } else {
            console.error('Subscription did not return a valid unsubscribe function');
            subscriptionRef.current = null;
          }
        })
        .catch((error: any) => {
          console.error('Error setting up subscription:', error);
          subscriptionRef.current = null;
        });
    } else if (typeof subscribeResult === 'function') {
      console.log('Subscription created successfully (direct function)');
      subscriptionRef.current = subscribeResult;
    } else {
      console.error('Subscription returned unexpected type:', typeof subscribeResult);
      subscriptionRef.current = null;
    }

    // Cleanup on unmount or connection change
    return () => {
      if (subscriptionRef.current && typeof subscriptionRef.current === 'function') {
        console.log('Cleaning up subscription on unmount/change');
        try {
          subscriptionRef.current();
        } catch (error) {
          console.error('Error cleaning up subscription:', error);
        }
        subscriptionRef.current = null;
      }
    };
  }, [selectedConnection?.id, currentUserId, queryClient]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (selectedConnection) {
      messageService.markAllAsRead(selectedConnection.id).then(() => {
        // Only invalidate conversations after marking as read
        queryClient.invalidateQueries({
          queryKey: ['conversations'],
          refetchType: 'active'
        });
      }).catch(console.error);
    }
  }, [selectedConnection?.id, queryClient]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup subscription and timeouts on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current && typeof subscriptionRef.current === 'function') {
        console.log('Cleaning up subscription on component unmount');
        try {
          subscriptionRef.current();
        } catch (error) {
          console.error('Error cleaning up subscription on unmount:', error);
        }
        subscriptionRef.current = null;
      }
      if (invalidateTimeoutRef.current) {
        clearTimeout(invalidateTimeoutRef.current);
        invalidateTimeoutRef.current = null;
      }
    };
  }, []);

  // Select connection from URL parameter
  useEffect(() => {
    console.log('URL effect - connectionIdFromUrl:', connectionIdFromUrl);
    console.log('URL effect - conversations:', conversations.length);
    console.log('URL effect - selectedConnection:', selectedConnection?.id);

    if (connectionIdFromUrl && conversations.length > 0) {
      const conversation = conversations.find((conv: any) => conv.connection.id === connectionIdFromUrl);
      if (conversation) {
        console.log('Found conversation for URL:', conversation.connection.id);
        if (conversation.connection.id !== selectedConnection?.id) {
          console.log('Setting connection from URL');
          setMessages([]); // Clear messages when switching from URL
          setSelectedConnection(conversation.connection);
        }
      } else {
        console.log('Conversation not found for URL:', connectionIdFromUrl);
      }
    } else if (!connectionIdFromUrl && selectedConnection) {
      // Clear selection if URL parameter is removed
      console.log('Clearing selection - no URL parameter');
      setSelectedConnection(null);
      setMessages([]);
    }
  }, [connectionIdFromUrl, conversations]);

  // Handle connection selection
  const handleConnectionSelect = (connection: any) => {
    console.log('Switching to connection:', connection.id);

    // Find the full conversation data with expand to ensure we have all data
    const conversation = conversations.find((conv: any) => conv.connection.id === connection.id);
    const connectionWithData = conversation?.connection || connection;

    console.log('Connection with data:', connectionWithData);
    console.log('Has expand data:', !!connectionWithData.expand);

    // Clear messages immediately when switching
    setMessages([]);
    setMessageText("");

    setSelectedConnection(connectionWithData);
    navigate(`${createPageUrl("Connected")}?connection=${connection.id}`, { replace: true });
  };

  const filteredConversations = conversations.filter((conv: any) => {
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
      <div className="min-h-screen bg-[#F1F1F2]">
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
          <Card className="border-none shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
            <div className="grid md:grid-cols-3 h-full overflow-hidden">
              <div className="border-r border-gray-200 flex flex-col bg-white h-full min-h-0">
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search connections..." className="pl-10" disabled />
                  </div>
                </div>
                <ScrollArea className="flex-1 min-h-0">
                  <ConnectionListSkeleton count={5} />
                </ScrollArea>
              </div>
              <div className="md:col-span-2 flex flex-col bg-gray-50">
                <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 bg-gray-50">
                    <MessageSkeleton count={6} />
                  </div>
                </ScrollArea>
              </div>
            </div>
          </Card>
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
            <div className="grid md:grid-cols-3 h-full overflow-hidden">
              {/* Connections List */}
              <div className="border-r border-gray-200 flex flex-col bg-white h-full min-h-0">
                {/* Search */}
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
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
                <ScrollArea className="flex-1 min-h-0">
                  <div ref={connectionsListRef}>
                    {filteredConversations.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-gray-500">No conversations yet</p>
                      </div>
                    ) : (
                      filteredConversations.map((conv: any) => {
                        const isUserFrom = conv.connection.user_from === currentUserId;
                        const otherBusiness = isUserFrom ? conv.connection.expand?.business_to : conv.connection.expand?.business_from;

                        // Get owner - check if it's already expanded as an object, or in expand.owner
                        let businessOwner = null;

                        if (otherBusiness) {
                          // Check if owner is directly expanded (when using expand: 'business_from.owner')
                          if (otherBusiness.owner && typeof otherBusiness.owner === 'object' && otherBusiness.owner !== null) {
                            // Check if it has user properties (not just an ID object)
                            if ('name' in otherBusiness.owner || 'username' in otherBusiness.owner || 'email' in otherBusiness.owner) {
                              businessOwner = otherBusiness.owner;
                              console.log('Owner found directly expanded on business.owner');
                            }
                          }

                          // If not found, check expand.owner (manually fetched)
                          if (!businessOwner && otherBusiness.expand?.owner) {
                            businessOwner = otherBusiness.expand.owner;
                            console.log('Owner found in business.expand.owner');
                          }
                        }

                        const userName = businessOwner?.name || businessOwner?.username || businessOwner?.email || "Unknown User";
                        const businessName = otherBusiness?.business_name || "Business";

                        console.log('Connected - businessOwner:', businessOwner);
                        console.log('Connected - Final userName:', userName);
                        console.log('Connected - Final businessName:', businessName);

                        return (
                          <div
                            key={conv.connection.id}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleConnectionSelect(conv.connection);
                            }}
                            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedConnection?.id === conv.connection.id
                              ? 'bg-orange-50 border-l-4 border-l-[#FB6542]'
                              : 'hover:bg-gray-50'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00246B] to-[#FB6542] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                  {userName?.[0]?.toUpperCase() || businessName?.[0]?.toUpperCase() || "?"}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h3 className="font-semibold text-[#00246B] text-sm truncate">
                                    {userName}
                                  </h3>
                                  {conv.latestMessage && (
                                    <span className="text-xs text-gray-500">
                                      {formatLastMessageTime(conv.latestMessage.created)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mb-1 truncate">{businessName}</p>
                                {conv.latestMessage && (
                                  <p className="text-sm text-gray-600 truncate">
                                    {conv.latestMessage.content}
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
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className="md:col-span-2 flex flex-col bg-white h-full min-h-0">
                {selectedConnection && selectedConnection.id ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
                      {(() => {
                        // Find the conversation data for the selected connection
                        const conversation = conversations.find((conv: any) => conv.connection.id === selectedConnection.id);
                        const connectionWithExpand = conversation?.connection || selectedConnection;

                        const isUserFrom = connectionWithExpand.user_from === currentUserId;
                        const otherBusiness = isUserFrom ? connectionWithExpand.expand?.business_to : connectionWithExpand.expand?.business_from;

                        // Check if owner is already expanded directly
                        let businessOwner = null;
                        if (otherBusiness?.owner) {
                          if (typeof otherBusiness.owner === 'object' && otherBusiness.owner !== null && 'name' in otherBusiness.owner) {
                            businessOwner = otherBusiness.owner;
                          } else if (otherBusiness?.expand?.owner) {
                            businessOwner = otherBusiness.expand.owner;
                          }
                        }

                        const userName = businessOwner?.name || businessOwner?.username || businessOwner?.email || "Unknown User";
                        const businessName = otherBusiness?.business_name || "Business";

                        return (
                          <>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00246B] to-[#FB6542] flex items-center justify-center text-white font-bold">
                                {userName?.[0]?.toUpperCase() || businessName?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <h3 className="font-bold text-[#00246B]">{userName}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Building2 className="w-3 h-3" />
                                  <span>{businessName}</span>
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
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (otherBusiness?.id) {
                                        navigate(`${createPageUrl("BusinessDetails")}?id=${otherBusiness.id}`);
                                      }
                                    }}
                                  >
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 min-h-0">
                      <div className="p-4 bg-gray-50">
                        {loadingMessages ? (
                          <div className="p-4 bg-gray-50">
                            <MessageSkeleton count={6} />
                          </div>
                        ) : messagesError ? (
                          <div className="flex items-center justify-center h-full min-h-[400px]">
                            <div className="text-center">
                              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                              <p className="text-sm text-red-500">Error loading messages</p>
                              <p className="text-xs text-gray-500 mt-1">Please try again</p>
                            </div>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="flex items-center justify-center h-full min-h-[400px]">
                            <div className="text-center">
                              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-500">No messages yet. Start the conversation!</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map((message: any) => {
                              const isMine = message.sender === currentUserId;
                              const isOptimistic = message.id.startsWith('temp-');
                              const isRead = message.read === true;

                              return (
                                <div
                                  key={message.id}
                                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isMine
                                      ? 'bg-[#FB6542] text-white rounded-br-none'
                                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                      }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                    <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? '' : 'justify-start'}`}>
                                      <p className={`text-xs ${isMine ? 'text-white/70' : 'text-gray-500'}`}>
                                        {formatMessageTime(message.created)}
                                      </p>
                                      {isMine && (
                                        <span className="flex items-center">
                                          {isOptimistic ? (
                                            <Check className="w-3 h-3 text-white/70" />
                                          ) : isRead ? (
                                            <CheckCheck className="w-3.5 h-3.5 text-blue-300" />
                                          ) : (
                                            <CheckCheck className="w-3.5 h-3.5 text-white/70" />
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <div ref={messagesEndRef} />
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
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
