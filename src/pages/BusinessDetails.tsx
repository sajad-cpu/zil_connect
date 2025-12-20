import { pb } from "@/api/pocketbaseClient";
import { businessService } from "@/api/services/businessService";
import { connectionService } from "@/api/services/connectionService";
import BadgesTab from "@/components/badges/BadgesTab";
import PortfolioTab from "@/components/portfolio/PortfolioTab";
import ServicesTab from "@/components/profile/ServicesTab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPageUrl } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  Clock,
  Eye,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  UserCheck,
  UserPlus,
  Users
} from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function BusinessDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const businessId = urlParams.get("id");
  const currentUserId = pb.authStore.model?.id;

  const { data: business, isLoading } = useQuery({
    queryKey: ['business-details', businessId],
    queryFn: async () => {
      if (!businessId) return null;
      return await businessService.getById(businessId);
    },
    initialData: null,
  });

  // Get connection status with this business owner
  const { data: connectionStatus, error: connectionStatusError } = useQuery({
    queryKey: ['connection-status', business?.owner],
    queryFn: async () => {
      if (!business?.owner) return { status: 'none' as const, connection: null, isSender: false };
      try {
        const status = await connectionService.getConnectionStatus(business.owner);
        return status || { status: 'none' as const, connection: null, isSender: false };
      } catch (error: any) {
        // Silently handle errors - don't show toast for connection status checks
        // This prevents error toasts when API has temporary permission issues
        // (e.g., "admin can only work this" errors that resolve on retry)
        console.error('Error fetching connection status:', error);
        return { status: 'none' as const, connection: null, isSender: false };
      }
    },
    enabled: !!business?.owner && business.owner !== currentUserId,
    retry: 2,
    retryDelay: 1000,
  });

  // Log connection status errors silently (don't show toast)
  useEffect(() => {
    if (connectionStatusError) {
      console.error('Connection status query error (silent):', connectionStatusError);
    }
  }, [connectionStatusError]);

  // Send connection request mutation
  const sendConnectionMutation = useMutation({
    mutationFn: () => {
      if (!business?.owner || !businessId) {
        throw new Error('Invalid business data');
      }
      return connectionService.sendRequest({
        user_to: business.owner,
        business_to: businessId,
        message: `I'd like to connect with ${business.business_name}`
      });
    },
    onSuccess: () => {
      toast.success("Connection request sent!");
      queryClient.invalidateQueries({ queryKey: ['connection-status', business?.owner] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send connection request");
    }
  });

  if (isLoading || !business) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6C4DE6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#7C7C7C]">Loading business profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Back Button */}
      <div className="bg-white border-b border-[#E4E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button variant="ghost" asChild className="text-[#1E1E1E] hover:bg-[#F8F9FC]">
            <Link to={createPageUrl("Marketplace")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-[#6C4DE6] to-[#7E57C2] overflow-hidden">
        {business.cover_image_url && (
          <img src={business.cover_image_url} alt="Cover" className="w-full h-full object-cover opacity-30" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        {/* Profile Header Card */}
        <Card className="border-[#E4E7EB] shadow-2xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center text-white font-bold text-5xl shadow-xl flex-shrink-0">
                {business.business_name[0].toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">{business.business_name}</h1>
                    <p className="text-[#7C7C7C] text-lg mb-3">{business.tagline}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20">
                        {business.industry}
                      </Badge>
                      {business.is_verified && (
                        <Badge className="bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20">
                          <Award className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {business.verified_badges?.map((badge: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="border-[#E4E7EB] text-[#7C7C7C]">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* Show different buttons based on connection status */}
                    {business.owner === currentUserId ? (
                      // Own business - show edit button
                      <Button
                        className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                        onClick={() => navigate(createPageUrl("Profile"))}
                      >
                        Edit Profile
                      </Button>
                    ) : !connectionStatus ? (
                      // No connection - show loading or connect button
                      <Button
                        className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                        onClick={() => sendConnectionMutation.mutate()}
                        disabled={sendConnectionMutation.isPending}
                      >
                        {sendConnectionMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    ) : (!connectionStatus || connectionStatus.status === 'none') ? (
                      // No connection exists
                      <Button
                        className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                        onClick={() => sendConnectionMutation.mutate()}
                        disabled={sendConnectionMutation.isPending}
                      >
                        {sendConnectionMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    ) : connectionStatus.status === 'pending' ? (
                      // Connection request pending
                      <Button
                        variant="outline"
                        className="border-amber-300 text-amber-700 bg-amber-50"
                        disabled
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {(connectionStatus as any)?.isSender ? 'Request Sent' : 'Pending'}
                      </Button>
                    ) : connectionStatus.status === 'accepted' ? (
                      // Already connected
                      <Button
                        variant="outline"
                        className="border-green-300 text-green-700 bg-green-50"
                        disabled
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Connected
                      </Button>
                    ) : null}

                    {/* Message button - only show if connected */}
                    {connectionStatus?.status === 'accepted' && connectionStatus.connection && (
                      <Button
                        variant="outline"
                        className="border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC]"
                        onClick={() => navigate(createPageUrl("Connected") + `?connection=${connectionStatus.connection?.id}`)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {(business.location?.city || business.location?.state) && (
                    <div className="flex items-center gap-2 text-[#7C7C7C]">
                      <MapPin className="w-4 h-4 text-[#318FFD]" />
                      <span>
                        {[business.location?.city, business.location?.state].filter(Boolean).join(', ') || 'Not specified'}
                      </span>
                    </div>
                  )}
                  {business.contact_info?.email && (
                    <div className="flex items-center gap-2 text-[#7C7C7C]">
                      <Mail className="w-4 h-4 text-[#318FFD]" />
                      <span>{business.contact_info.email}</span>
                    </div>
                  )}
                  {business.contact_info?.phone && (
                    <div className="flex items-center gap-2 text-[#7C7C7C]">
                      <Phone className="w-4 h-4 text-[#318FFD]" />
                      <span>{business.contact_info.phone}</span>
                    </div>
                  )}
                  {business.contact_info?.website && (
                    <div className="flex items-center gap-2 text-[#7C7C7C]">
                      <Globe className="w-4 h-4 text-[#318FFD]" />
                      <a
                        href={business.contact_info.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#6C4DE6] hover:underline"
                      >
                        {business.contact_info.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E4E7EB]">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-2xl font-bold">{business.trust_score || 0}</span>
                </div>
                <p className="text-xs text-[#7C7C7C]">Trust Score</p>
              </div>
              <div className="text-center border-l border-[#E4E7EB]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye className="w-5 h-5 text-[#318FFD]" />
                  <span className="text-2xl font-bold text-[#1E1E1E]">{business.profile_views || 0}</span>
                </div>
                <p className="text-xs text-[#7C7C7C]">Profile Views</p>
              </div>
              <div className="text-center border-l border-[#E4E7EB]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-5 h-5 text-[#318FFD]" />
                  <span className="text-2xl font-bold text-[#1E1E1E]">0</span>
                </div>
                <p className="text-xs text-[#7C7C7C]">Connections</p>
              </div>
              <div className="text-center border-l border-[#E4E7EB]">
                <div className="text-2xl font-bold text-[#1E1E1E] mb-1">{business.engagement_score || 0}</div>
                <p className="text-xs text-[#7C7C7C]">Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-6 pb-12">
          <TabsList className="bg-white border border-[#E4E7EB]">
            <TabsTrigger value="about" className="data-[state=active]:bg-[#6C4DE6] data-[state=active]:text-white">About</TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-[#6C4DE6] data-[state=active]:text-white">Services</TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-[#6C4DE6] data-[state=active]:text-white">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#6C4DE6] data-[state=active]:text-white">Reviews</TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-[#6C4DE6] data-[state=active]:text-white">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card className="border-[#E4E7EB] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1E1E1E]">About {business.business_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#7C7C7C] leading-relaxed">{business.description || "No description available."}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab businessId={business.id} isOwner={false} />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioTab businessId={business.id} isOwner={false} />
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="border-[#E4E7EB] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1E1E1E]">Reviews & Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#7C7C7C]">No reviews yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <BadgesTab businessId={business.id} isOwner={false} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}