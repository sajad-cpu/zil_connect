import React, { useState } from "react";
import { opportunityService } from "@/api/services/opportunityService";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Award,
  Eye,
  Send,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export default function OpportunityDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const opportunityId = urlParams.get("id");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { toast } = useToast();

  const { data: opportunity, isLoading } = useQuery({
    queryKey: ['opportunity-details', opportunityId],
    queryFn: async () => {
      if (!opportunityId) return null;
      return await opportunityService.getById(opportunityId);
    },
    initialData: null,
  });

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
    const colors = {
      "Open": "bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20",
      "In Progress": "bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20",
      "Awarded": "bg-[#6C4DE6]/10 text-[#6C4DE6] border-[#6C4DE6]/20",
      "Closed": "bg-gray-100 text-gray-600 border-gray-200"
    };
    return colors[status] || colors.Open;
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
    setShowConfirmDialog(true);
  };

  const handleConfirmApply = () => {
    // Simulate API call
    setTimeout(() => {
      setHasApplied(true);
      setShowConfirmDialog(false);
      toast({
        title: "Application Submitted Successfully!",
        description: "Your application has been sent to the business.",
        className: "bg-[#08B150] text-white border-none",
      });
    }, 500);
  };

  if (isLoading || !opportunity) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6C4DE6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#7C7C7C]">Loading opportunity details...</p>
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
            <Link to={createPageUrl("Opportunities")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header Card */}
        <Card className="border-[#E4E7EB] shadow-xl mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex gap-2 mb-2">
                    <Badge className={getTypeColor(opportunity.type)}>
                      {opportunity.type}
                    </Badge>
                    <Badge className={getStatusColor(opportunity.status)}>
                      {opportunity.status}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold text-[#1E1E1E]">{opportunity.title}</h1>
                </div>
              </div>
              {hasApplied && (
                <Badge className="bg-[#08B150] text-white border-none py-2 px-4">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Applied
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-[#7C7C7C]">
              <Building2 className="w-4 h-4 text-[#318FFD]" />
              <span className="font-medium">Posted by {opportunity.business_name}</span>
              {opportunity.is_verified && (
                <Badge className="bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20 ml-2">
                  <Award className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#F8F9FC] rounded-lg border border-[#E4E7EB] mb-6">
              <div>
                <div className="flex items-center gap-2 text-[#7C7C7C] mb-1">
                  <DollarSign className="w-4 h-4 text-[#318FFD]" />
                  <span className="text-xs">Budget</span>
                </div>
                <p className="font-semibold text-[#1E1E1E]">{opportunity.budget_range || "Negotiable"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#7C7C7C] mb-1">
                  <MapPin className="w-4 h-4 text-[#318FFD]" />
                  <span className="text-xs">Location</span>
                </div>
                <p className="font-semibold text-[#1E1E1E]">{opportunity.location || "Remote"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#7C7C7C] mb-1">
                  <Calendar className="w-4 h-4 text-[#318FFD]" />
                  <span className="text-xs">Deadline</span>
                </div>
                <p className="font-semibold text-[#1E1E1E]">{formatDate(opportunity.deadline)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#7C7C7C] mb-1">
                  <Eye className="w-4 h-4 text-[#318FFD]" />
                  <span className="text-xs">Views</span>
                </div>
                <p className="font-semibold text-[#1E1E1E]">{opportunity.views || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-[#E4E7EB] shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-[#1E1E1E]">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#7C7C7C] leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>
          </CardContent>
        </Card>

        {/* Requirements */}
        {opportunity.requirements && opportunity.requirements.length > 0 && (
          <Card className="border-[#E4E7EB] shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-[#1E1E1E]">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {opportunity.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#08B150] mt-0.5 flex-shrink-0" />
                    <span className="text-[#7C7C7C]">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Apply Button */}
        {!hasApplied && opportunity.status === "Open" && (
          <Card className="border-[#6C4DE6] shadow-lg bg-gradient-to-r from-[#6C4DE6]/5 to-[#7E57C2]/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">Ready to Apply?</h3>
                  <p className="text-[#7C7C7C]">Submit your application and get notified of updates</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={handleApplyClick}
                  className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {hasApplied && (
          <Card className="border-[#08B150] shadow-lg bg-gradient-to-r from-[#08B150]/5 to-[#08B150]/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#08B150] flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1E1E1E] mb-1">Application Submitted</h3>
                  <p className="text-[#7C7C7C]">We'll notify you when there's an update from {opportunity.business_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1E1E1E]">Submit Application?</DialogTitle>
            <DialogDescription className="text-[#7C7C7C]">
              Would you like to apply for this opportunity? Your profile information will be shared with {opportunity.business_name}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmApply}
              className="flex-1 bg-[#08B150] hover:bg-[#06893f] text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}