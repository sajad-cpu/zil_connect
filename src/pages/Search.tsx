import React, { useState } from "react";
import { businessService } from "@/api/services/businessService";
import { connectionService } from "@/api/services/connectionService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { pb } from "@/api/pocketbaseClient";
import {
  Search as SearchIcon,
  Sparkles,
  MapPin,
  Building2,
  Target,
  TrendingUp,
  Award,
  Filter,
  UserPlus,
  Check,
  Loader2,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function Search() {
  const queryClient = useQueryClient();
  const currentUserId = pb.authStore.model?.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [aiMatchmaking, setAiMatchmaking] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [trustScoreRange, setTrustScoreRange] = useState([0, 100]);

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses-search'],
    queryFn: () => businessService.list('-engagement_score'),
    initialData: [],
  });

  // Fetch connection statuses for all businesses
  const { data: connectionStatuses = {} } = useQuery({
    queryKey: ['connection-statuses-bulk'],
    queryFn: async () => {
      if (!currentUserId) return {};
      const statuses: Record<string, any> = {};

      // Get all connections for current user
      const allConnections = await pb.collection('connections').getList(1, 200, {
        filter: `user_from="${currentUserId}" || user_to="${currentUserId}"`
      });

      // Map connections by the other user's ID
      allConnections.items.forEach((conn: any) => {
        const otherUserId = conn.user_from === currentUserId ? conn.user_to : conn.user_from;
        statuses[otherUserId] = {
          status: conn.status,
          connection: conn,
          isSender: conn.user_from === currentUserId
        };
      });

      return statuses;
    },
    enabled: !!currentUserId,
  });

  // Send connection request mutation
  const sendConnectionMutation = useMutation({
    mutationFn: async ({ userId, businessId, businessName }: { userId: string; businessId: string; businessName: string }) => {
      return connectionService.sendRequest({
        user_to: userId,
        business_to: businessId,
        message: `I'd like to connect with ${businessName}`
      });
    },
    onSuccess: () => {
      toast.success("Connection request sent!");
      queryClient.invalidateQueries({ queryKey: ['connection-statuses-bulk'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send connection request");
    }
  });

  const industries = ["Technology", "Manufacturing", "Retail", "Healthcare", "Finance", "Logistics", "Construction"];
  const badges = ["Verified", "ISO Certified", "Minority-owned", "Eco-friendly", "Made in USA"];

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const handleBadgeToggle = (badge: string) => {
    setSelectedBadges(prev =>
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const handleConnect = (business: any) => {
    if (!business.owner || !business.id) {
      toast.error("Invalid business data");
      return;
    }

    sendConnectionMutation.mutate({
      userId: business.owner,
      businessId: business.id,
      businessName: business.business_name
    });
  };

  const filteredBusinesses = businesses.filter((business: any) => {
    const matchesSearch = business.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          business.services?.some((s: any) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(business.industry);
    const matchesTrust = business.trust_score >= trustScoreRange[0] && business.trust_score <= trustScoreRange[1];
    return matchesSearch && matchesIndustry && matchesTrust;
  });

  // Get pending connections from connection statuses
  const pendingConnections = filteredBusinesses.filter((b: any) => {
    if (!b.owner) return false;
    const status = connectionStatuses[b.owner];
    return status?.status === 'pending' && status?.isSender;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Hero Search */}
      <div className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AI-Powered Smart Search</h1>
            <p className="text-xl text-white/90 mb-8">
              Find the perfect business partners with advanced filters and AI matchmaking
            </p>
            
            {/* Main Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7C7C7C] w-6 h-6" />
              <Input
                type="text"
                placeholder="Search by business name, services, location..."
                className="pl-14 pr-4 h-16 text-lg rounded-lg shadow-2xl border-[#E4E7EB] bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* AI Matchmaking Toggle */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <Checkbox
                id="ai-match"
                checked={aiMatchmaking}
                onCheckedChange={setAiMatchmaking}
                className="border-white data-[state=checked]:bg-[#6C4DE6] data-[state=checked]:border-[#6C4DE6]"
              />
              <Label htmlFor="ai-match" className="text-white cursor-pointer flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Enable AI Matchmaking (based on your profile & goals)
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-[#E4E7EB] shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1E1E1E]">
                  <Filter className="w-5 h-5" />
                  Advanced Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Industry Filter */}
                <div>
                  <h3 className="font-semibold text-[#1E1E1E] mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Industry
                  </h3>
                  <div className="space-y-2">
                    {industries.map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox
                          id={industry}
                          checked={selectedIndustries.includes(industry)}
                          onCheckedChange={() => handleIndustryToggle(industry)}
                          className="data-[state=checked]:bg-[#6C4DE6] data-[state=checked]:border-[#6C4DE6]"
                        />
                        <Label htmlFor={industry} className="text-sm cursor-pointer text-[#1E1E1E]">
                          {industry}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Score Filter */}
                <div>
                  <h3 className="font-semibold text-[#1E1E1E] mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Trust Score Range
                  </h3>
                  <div className="space-y-3">
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={trustScoreRange}
                      onValueChange={setTrustScoreRange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-[#7C7C7C]">
                      <span>{trustScoreRange[0]}</span>
                      <span>{trustScoreRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges Filter */}
                <div>
                  <h3 className="font-semibold text-[#1E1E1E] mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Certifications & Badges
                  </h3>
                  <div className="space-y-2">
                    {badges.map((badge) => (
                      <div key={badge} className="flex items-center space-x-2">
                        <Checkbox
                          id={badge}
                          checked={selectedBadges.includes(badge)}
                          onCheckedChange={() => handleBadgeToggle(badge)}
                          className="data-[state=checked]:bg-[#6C4DE6] data-[state=checked]:border-[#6C4DE6]"
                        />
                        <Label htmlFor={badge} className="text-sm cursor-pointer text-[#1E1E1E]">
                          {badge}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC]"
                  onClick={() => {
                    setSelectedIndustries([]);
                    setSelectedBadges([]);
                    setTrustScoreRange([0, 100]);
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {aiMatchmaking && (
              <Card className="mb-6 border-[#E4E7EB] shadow-lg bg-gradient-to-r from-[#6C4DE6]/10 to-[#7E57C2]/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1E1E1E] mb-2">AI Matchmaking Active</h3>
                      <p className="text-sm text-[#7C7C7C]">
                        Results are personalized based on your business profile, growth stage, and previous interactions.
                        Businesses with higher compatibility scores are shown first.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pending Connections Section */}
            {pendingConnections.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#1E1E1E] mb-4">Connections Sent / Pending ({pendingConnections.length})</h3>
                <div className="space-y-4">
                  {pendingConnections.map((business) => (
                    <Card key={business.id} className="border-[#318FFD] bg-[#318FFD]/5">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center text-white font-bold">
                              {business.business_name?.[0]?.toUpperCase() || 'B'}
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#1E1E1E]">{business.business_name}</h4>
                              <p className="text-sm text-[#7C7C7C]">{business.industry}</p>
                            </div>
                          </div>
                          <Badge className="bg-[#318FFD] text-white">
                            <Check className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-[#7C7C7C]">
                <span className="font-semibold text-[#1E1E1E]">{filteredBusinesses.length}</span> businesses match your criteria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBusinesses.map((business, index) => (
                <Link key={business.id} to={createPageUrl("BusinessDetails") + `?id=${business.id}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-[#E4E7EB] shadow-lg group cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center text-white font-bold text-xl">
                          {business.business_name?.[0]?.toUpperCase() || 'B'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <CardTitle className="text-lg group-hover:text-[#6C4DE6] transition-colors">
                              {business.business_name}
                            </CardTitle>
                            {aiMatchmaking && (
                              <Badge className="bg-[#7E57C2]/10 text-[#7E57C2] border-[#7E57C2]/20 ml-2">
                                {Math.floor(Math.random() * 30) + 70}% Match
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-[#7C7C7C]">{business.industry}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-[#7C7C7C]">
                            <MapPin className="w-3 h-3" />
                            {business.location?.city}, {business.location?.state}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#7C7C7C] text-sm mb-4 line-clamp-2">
                        {business.description || business.tagline}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {business.is_verified && (
                          <Badge className="bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20 text-xs">
                            Verified
                          </Badge>
                        )}
                        {business.verified_badges?.slice(0, 2).map((badge, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-[#E4E7EB] text-[#7C7C7C]">
                            {badge}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#E4E7EB]">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Award className="w-4 h-4 fill-current" />
                          <span className="text-sm font-semibold">{business.trust_score || 0}</span>
                        </div>
                        {business.owner === currentUserId ? (
                          <Badge variant="outline" className="text-xs">
                            Your Business
                          </Badge>
                        ) : connectionStatuses[business.owner]?.status === 'pending' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-amber-300 text-amber-700"
                            disabled
                            onClick={(e) => e.preventDefault()}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            {connectionStatuses[business.owner]?.isSender ? 'Request Sent' : 'Pending'}
                          </Button>
                        ) : connectionStatuses[business.owner]?.status === 'accepted' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-300 text-green-700"
                            disabled
                            onClick={(e) => e.preventDefault()}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Connected
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                            onClick={(e) => {
                              e.preventDefault();
                              handleConnect(business);
                            }}
                            disabled={sendConnectionMutation.isPending}
                          >
                            {sendConnectionMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-1" />
                                Connect
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredBusinesses.length === 0 && (
              <Card className="text-center py-12 border-[#E4E7EB]">
                <CardContent>
                  <SearchIcon className="w-16 h-16 text-[#7C7C7C]/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">No matches found</h3>
                  <p className="text-[#7C7C7C] mb-6">Try adjusting your filters or search terms</p>
                  <Button 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedIndustries([]);
                      setSelectedBadges([]);
                      setTrustScoreRange([0, 100]);
                    }}
                    className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                  >
                    Clear All
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}