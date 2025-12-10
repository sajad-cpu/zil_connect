import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  MessageSquare,
  Building2,
  Send,
  Inbox
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";

export default function Invitations() {
  // Mock data - replace with real data from entities
  const receivedInvitations = [
    { id: 1, userName: "John Smith", businessName: "Tech Solutions Inc", message: "Would love to connect and explore partnership opportunities", timestamp: "2 hours ago" },
    { id: 2, userName: "Sarah Johnson", businessName: "Digital Marketing Pro", message: "Interested in your services", timestamp: "5 hours ago" },
    { id: 3, userName: "Mike Chen", businessName: "Global Logistics Ltd", message: "Let's discuss collaboration", timestamp: "1 day ago" },
  ];

  const sentInvitations = [
    { id: 4, userName: "Emily Davis", businessName: "Creative Agency", status: "pending", timestamp: "1 day ago" },
    { id: 5, userName: "Robert Wilson", businessName: "Manufacturing Corp", status: "pending", timestamp: "3 days ago" },
  ];

  const hasConnections = receivedInvitations.length > 0 || sentInvitations.length > 0;

  const handleAccept = (id) => {
    console.log("Accept invitation", id);
    // Implement accept logic
  };

  const handleDecline = (id) => {
    console.log("Decline invitation", id);
    // Implement decline logic
  };

  const handleMessage = (id) => {
    console.log("Message user", id);
    // Navigate to chat
  };

  return (
    <div className="min-h-screen bg-[#F1F1F2]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00246B] to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Connection Invitations</h1>
          </div>
          <p className="text-xl text-white/90">Manage your pending and sent connection requests</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!hasConnections ? (
          <Card className="text-center py-16 border-none shadow-lg">
            <CardContent>
              <UserPlus className="w-20 h-20 text-gray-300 mx-auto mb-6" />
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
                  Complete Your Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="received" className="space-y-6">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 bg-white shadow-md">
              <TabsTrigger value="received" className="data-[state=active]:bg-[#FB6542] data-[state=active]:text-white">
                <Inbox className="w-4 h-4 mr-2" />
                Received ({receivedInvitations.length})
              </TabsTrigger>
              <TabsTrigger value="sent" className="data-[state=active]:bg-[#FB6542] data-[state=active]:text-white">
                <Send className="w-4 h-4 mr-2" />
                Sent ({sentInvitations.length})
              </TabsTrigger>
            </TabsList>

            {/* Received Invitations */}
            <TabsContent value="received" className="space-y-4">
              {receivedInvitations.map((invitation) => (
                <Card key={invitation.id} className="border-none shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00246B] to-[#FB6542] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {invitation.userName[0]}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-[#00246B]">{invitation.userName}</h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Building2 className="w-4 h-4" />
                              <span>{invitation.businessName}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{invitation.timestamp}</span>
                        </div>
                        
                        {invitation.message && (
                          <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded-lg">
                            "{invitation.message}"
                          </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-[#FB6542] hover:bg-[#e5573a] text-white"
                            onClick={() => handleAccept(invitation.id)}
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleDecline(invitation.id)}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-[#00246B] text-[#00246B] hover:bg-[#00246B] hover:text-white"
                            onClick={() => handleMessage(invitation.id)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Sent Invitations */}
            <TabsContent value="sent" className="space-y-4">
              {sentInvitations.map((invitation) => (
                <Card key={invitation.id} className="border-none shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00246B] to-[#FB6542] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {invitation.userName[0]}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-[#00246B]">{invitation.userName}</h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Building2 className="w-4 h-4" />
                              <span>{invitation.businessName}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                            Pending
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-4">
                          Invitation sent {invitation.timestamp}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Cancel Request
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-[#00246B] text-[#00246B] hover:bg-[#00246B] hover:text-white"
                            onClick={() => handleMessage(invitation.id)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}