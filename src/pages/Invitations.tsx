import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Building2,
  Send,
  Inbox,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { connectionService } from "@/api/services/connectionService";

export default function Invitations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("received");

  // Fetch received connection requests
  const { data: receivedInvitations = [], isLoading: loadingReceived } = useQuery({
    queryKey: ['connection-requests-received'],
    queryFn: () => connectionService.getPendingRequests(),
  });

  // Fetch sent connection requests
  const { data: sentInvitations = [], isLoading: loadingSent } = useQuery({
    queryKey: ['connection-requests-sent'],
    queryFn: () => connectionService.getSentRequests(),
  });

  // Accept connection mutation
  const acceptMutation = useMutation({
    mutationFn: (connectionId: string) => connectionService.acceptRequest(connectionId),
    onSuccess: () => {
      toast.success("Connection request accepted!");
      queryClient.invalidateQueries({ queryKey: ['connection-requests-received'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to accept connection request");
    }
  });

  // Reject connection mutation
  const rejectMutation = useMutation({
    mutationFn: (connectionId: string) => connectionService.rejectRequest(connectionId),
    onSuccess: () => {
      toast.success("Connection request declined");
      queryClient.invalidateQueries({ queryKey: ['connection-requests-received'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to decline connection request");
    }
  });

  // Cancel sent request mutation
  const cancelMutation = useMutation({
    mutationFn: (connectionId: string) => connectionService.removeConnection(connectionId),
    onSuccess: () => {
      toast.success("Connection request cancelled");
      queryClient.invalidateQueries({ queryKey: ['connection-requests-sent'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to cancel connection request");
    }
  });

  const hasConnections = receivedInvitations.length > 0 || sentInvitations.length > 0;

  const handleAccept = (connectionId: string) => {
    acceptMutation.mutate(connectionId);
  };

  const handleDecline = (connectionId: string) => {
    rejectMutation.mutate(connectionId);
  };

  const handleCancelRequest = (connectionId: string) => {
    cancelMutation.mutate(connectionId);
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  // Show loading state
  if (loadingReceived || loadingSent) {
    return (
      <div className="min-h-screen bg-[#F1F1F2] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FB6542] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading connection requests...</p>
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
                  onClick={() => navigate(createPageUrl("Profile"))}
                >
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
              {receivedInvitations.length === 0 ? (
                <Card className="text-center py-12 border-none shadow-lg">
                  <CardContent>
                    <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#00246B] mb-2">No pending requests</h3>
                    <p className="text-gray-600">You don't have any connection requests at the moment</p>
                  </CardContent>
                </Card>
              ) : (
                receivedInvitations.map((invitation: any) => {
                  const senderBusiness = invitation.expand?.business_from;
                  const senderUser = invitation.expand?.user_from;

                  return (
                    <Card key={invitation.id} className="border-none shadow-lg hover:shadow-xl transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00246B] to-[#FB6542] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {senderBusiness?.business_name?.[0]?.toUpperCase() || "?"}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-lg text-[#00246B]">
                                  {senderUser?.name || "Unknown User"}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                  <Building2 className="w-4 h-4" />
                                  <span>{senderBusiness?.business_name || "Unknown Business"}</span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">{formatTimestamp(invitation.created)}</span>
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
                                disabled={acceptMutation.isPending}
                              >
                                {acceptMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <UserCheck className="w-4 h-4 mr-2" />
                                )}
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleDecline(invitation.id)}
                                disabled={rejectMutation.isPending}
                              >
                                <UserX className="w-4 h-4 mr-2" />
                                Decline
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            {/* Sent Invitations */}
            <TabsContent value="sent" className="space-y-4">
              {sentInvitations.length === 0 ? (
                <Card className="text-center py-12 border-none shadow-lg">
                  <CardContent>
                    <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#00246B] mb-2">No sent requests</h3>
                    <p className="text-gray-600">You haven't sent any connection requests yet</p>
                  </CardContent>
                </Card>
              ) : (
                sentInvitations.map((invitation: any) => {
                  const receiverBusiness = invitation.expand?.business_to;
                  const receiverUser = invitation.expand?.user_to;

                  return (
                    <Card key={invitation.id} className="border-none shadow-lg hover:shadow-xl transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00246B] to-[#FB6542] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {receiverBusiness?.business_name?.[0]?.toUpperCase() || "?"}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-lg text-[#00246B]">
                                  {receiverUser?.name || "Unknown User"}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                  <Building2 className="w-4 h-4" />
                                  <span>{receiverBusiness?.business_name || "Unknown Business"}</span>
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                                Pending
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-500 mb-4">
                              Invitation sent {formatTimestamp(invitation.created)}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleCancelRequest(invitation.id)}
                                disabled={cancelMutation.isPending}
                              >
                                {cancelMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <UserX className="w-4 h-4 mr-2" />
                                )}
                                Cancel Request
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}