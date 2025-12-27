import { pb } from "@/api/pocketbaseClient";
import { applicationService } from "@/api/services/applicationService";
import { opportunityService } from "@/api/services/opportunityService";
import { OpportunityDetailsSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createPageUrl } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  MapPin,
  Send
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function OpportunityDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const opportunityId = urlParams.get("id");
  const [hasApplied, setHasApplied] = useState(false);
  const [isCheckingApplication, setIsCheckingApplication] = useState(true);
  const hasIncrementedViews = useRef(false);
  const { toast } = useToast();
  const currentUserId = pb.authStore.model?.id;

  const { data: opportunity, isLoading } = useQuery({
    queryKey: ['opportunity-details', opportunityId],
    queryFn: async () => {
      if (!opportunityId) return null;
      return await opportunityService.getById(opportunityId);
    },
  });

  // Increment views when opportunity is loaded (only once per page load)
  useEffect(() => {
    if (opportunity && opportunityId && !hasIncrementedViews.current) {
      hasIncrementedViews.current = true;
      opportunityService.incrementViews(opportunityId)
        .then(() => {
          // Refetch to get updated views count
          queryClient.invalidateQueries({ queryKey: ['opportunity-details', opportunityId] });
          queryClient.invalidateQueries({ queryKey: ['opportunities-all'] });
          queryClient.invalidateQueries({ queryKey: ['opportunities-recent'] });
        })
        .catch(err => {
          console.error('Failed to increment views:', err);
        });
    }
  }, [opportunity, opportunityId, queryClient]);

  // Check if user has already applied
  useEffect(() => {
    const checkApplication = async () => {
      if (!opportunityId) return;
      setIsCheckingApplication(true);
      try {
        const applied = await applicationService.hasApplied(opportunityId);
        setHasApplied(applied);
      } catch (error) {
        console.error("Error checking application:", error);
      } finally {
        setIsCheckingApplication(false);
      }
    };
    checkApplication();
  }, [opportunityId]);

  const getTypeColor = (type) => {
    const colors = {
      "Project": "bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20",
      "Partnership": "bg-[#7E57C2]/10 text-[#7E57C2] border-[#7E57C2]/20",
      "Tender": "bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20",
      "RFP": "bg-[#6C4DE6]/10 text-[#6C4DE6] border-[#6C4DE6]/20",
      "Collaboration": "bg-pink-100 text-pink-700 border-pink-200",
      "Investment": "bg-amber-100 text-amber-700 border-amber-200"
    };
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    const colors: Record<string, string> = {
      "open": "bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20",
      "in progress": "bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20",
      "awarded": "bg-[#6C4DE6]/10 text-[#6C4DE6] border-[#6C4DE6]/20",
      "closed": "bg-gray-100 text-gray-600 border-gray-200",
      "filled": "bg-gray-100 text-gray-600 border-gray-200"
    };
    return colors[statusLower] || colors["open"];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Open";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Open";
      return date.toLocaleDateString();
    } catch {
      return "Open";
    }
  };

  const handleApplyClick = () => {
    // Check if it's own opportunity
    if (opportunity?.created_by === currentUserId || opportunity?.created_by?.id === currentUserId) {
      toast({
        title: "Cannot Apply",
        description: "You cannot apply to your own opportunity.",
      });
      return;
    }

    // Navigate to apply form
    navigate(createPageUrl("OpportunityApply") + `?id=${opportunityId}`);
  };

  if (isLoading || !opportunity) {
    return <OpportunityDetailsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Back Button */}
      <div className="bg-white border-b border-[#E4E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Button variant="ghost" asChild className="text-[#1E1E1E] hover:bg-[#F8F9FC] text-sm sm:text-base">
            <Link to={createPageUrl("Opportunities")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Opportunities</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header Card */}
        <Card className="border-[#E4E7EB] shadow-xl mb-6 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center shadow-lg flex-shrink-0">
                  <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <Badge className={`${getTypeColor(opportunity.type)} text-xs`}>
                      {opportunity.type}
                    </Badge>
                    <Badge className={`${getStatusColor(opportunity.status)} text-xs`}>
                      {opportunity.status}
                    </Badge>
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1E1E1E] break-words">{opportunity.title}</h1>
                </div>
              </div>
              {hasApplied && (
                <Badge className="bg-[#08B150] text-white border-none py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Applied
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#7C7C7C]">
              <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
              <span className="font-medium truncate">
                Posted by {opportunity.expand?.business?.business_name || opportunity.expand?.business?.name || 'Business'}
              </span>
              {(opportunity.expand?.business?.is_verified || opportunity.expand?.business?.verified) && (
                <Badge className="bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20 ml-0 sm:ml-2 text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 pt-0">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F8F9FC] rounded-lg border border-[#E4E7EB] mb-4 sm:mb-6">
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#7C7C7C] mb-1">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                  <span className="text-xs">Budget</span>
                </div>
                <p className="font-semibold text-[#1E1E1E] text-sm sm:text-base truncate">{opportunity.budget || "Negotiable"}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#7C7C7C] mb-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                  <span className="text-xs">Location</span>
                </div>
                <p className="font-semibold text-[#1E1E1E] text-sm sm:text-base truncate">{opportunity.location || "Remote"}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#7C7C7C] mb-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                  <span className="text-xs">Deadline</span>
                </div>
                <p className="font-semibold text-[#1E1E1E] text-sm sm:text-base truncate">{formatDate(opportunity.deadline)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#7C7C7C] mb-1">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                  <span className="text-xs">Views</span>
                </div>
                <p className="font-semibold text-[#1E1E1E] text-sm sm:text-base">{opportunity.views || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-[#E4E7EB] shadow-lg mb-4 sm:mb-6">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-[#1E1E1E] text-lg sm:text-xl">Description</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm sm:text-base text-[#7C7C7C] leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>
          </CardContent>
        </Card>

        {/* Requirements */}
        {opportunity.requirements && (
          <Card className="border-[#E4E7EB] shadow-lg mb-4 sm:mb-6">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-[#1E1E1E] text-lg sm:text-xl">Requirements</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {(() => {
                try {
                  const requirements = typeof opportunity.requirements === 'string'
                    ? JSON.parse(opportunity.requirements)
                    : opportunity.requirements;

                  if (Array.isArray(requirements) && requirements.length > 0) {
                    return (
                      <ul className="space-y-2 sm:space-y-3">
                        {requirements.map((req: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 sm:gap-3">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#08B150] mt-0.5 flex-shrink-0" />
                            <span className="text-sm sm:text-base text-[#7C7C7C]">{req}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p className="text-sm sm:text-base text-[#7C7C7C]">No specific requirements listed.</p>;
                } catch (error) {
                  return <p className="text-sm sm:text-base text-[#7C7C7C]">{opportunity.requirements}</p>;
                }
              })()}
            </CardContent>
          </Card>
        )}

        {/* Apply Button */}
        {!hasApplied && (opportunity.status?.toLowerCase() === "open" || opportunity.status === "Open") && (
          <Card className="border-[#6C4DE6] shadow-lg bg-gradient-to-r from-[#6C4DE6]/5 to-[#7E57C2]/5">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1 sm:mb-2">Ready to Apply?</h3>
                  <p className="text-sm sm:text-base text-[#7C7C7C]">Submit your application and get notified of updates</p>
                </div>
                <Button
                  size="lg"
                  onClick={handleApplyClick}
                  className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white w-full sm:w-auto"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {hasApplied && (
          <Card className="border-[#08B150] shadow-lg bg-gradient-to-r from-[#08B150]/5 to-[#08B150]/10">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#08B150] flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1">Application Submitted</h3>
                  <p className="text-sm sm:text-base text-[#7C7C7C]">
                    We'll notify you when there's an update from {opportunity.expand?.business?.business_name || opportunity.expand?.business?.name || 'the business'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}