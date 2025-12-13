import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { applicationService } from "@/api/services/applicationService";
import {
  Briefcase,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Calendar,
  DollarSign,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AppliedOpportunities() {
  // Fetch real applied opportunities from API
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.getMyApplications('-created'),
  });

  const getStatusConfig = (status) => {
    const configs = {
      "Pending": {
        color: "bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20",
        icon: Clock,
        label: "Under Review"
      },
      "Accepted": {
        color: "bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20",
        icon: CheckCircle,
        label: "Accepted"
      },
      "Rejected": {
        color: "bg-[#FF4C4C]/10 text-[#FF4C4C] border-[#FF4C4C]/20",
        icon: XCircle,
        label: "Not Selected"
      }
    };
    return configs[status] || configs.Pending;
  };

  const getTypeColor = (type) => {
    const colors = {
      "Project": "bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20",
      "Partnership": "bg-[#7E57C2]/10 text-[#7E57C2] border-[#7E57C2]/20",
      "Tender": "bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20",
      "RFP": "bg-[#6C4DE6]/10 text-[#6C4DE6] border-[#6C4DE6]/20",
    };
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Button variant="ghost" asChild className="text-white hover:bg-white/10 mb-4">
            <Link to={createPageUrl("Opportunities")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <Briefcase className="w-10 h-10" />
            <h1 className="text-4xl font-bold">My Applications</h1>
          </div>
          <p className="text-xl text-white/90">Track your submitted opportunity applications</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-[#E4E7EB] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#7C7C7C] text-sm mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-[#1E1E1E]">{applications.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#6C4DE6]/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-[#6C4DE6]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#7C7C7C] text-sm mb-1">Accepted</p>
                  <p className="text-3xl font-bold text-[#08B150]">
                    {applications.filter((o: any) => o.status === "Accepted").length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#08B150]/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#08B150]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#7C7C7C] text-sm mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-[#318FFD]">
                    {applications.filter((o: any) => o.status === "Pending").length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#318FFD]/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#318FFD]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-[#6C4DE6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#7C7C7C]">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <Card className="text-center py-16 border-[#E4E7EB]">
            <CardContent>
              <Briefcase className="w-20 h-20 text-[#7C7C7C]/30 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#1E1E1E] mb-3">No Applications Yet</h3>
              <p className="text-[#7C7C7C] mb-8 max-w-md mx-auto">
                Start exploring opportunities and apply to ones that match your business
              </p>
              <Button asChild className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white">
                <Link to={createPageUrl("Opportunities")}>
                  Explore Opportunities
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => {
              const opportunity = app.expand?.opportunity;
              const statusConfig = getStatusConfig(app.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card
                  key={app.id}
                  className="border-[#E4E7EB] shadow-lg hover:shadow-xl transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex gap-2 mb-2">
                              <Badge className={getTypeColor(opportunity?.type)}>
                                {opportunity?.type || "N/A"}
                              </Badge>
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-[#1E1E1E] mb-1">{opportunity?.title || "Untitled"}</h3>
                            <p className="text-[#7C7C7C]">{opportunity?.company_name || app.company_name}</p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-[#318FFD]" />
                            <span className="text-[#7C7C7C]">{opportunity?.budget || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-[#318FFD]" />
                            <span className="text-[#7C7C7C] truncate">{opportunity?.location || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-[#318FFD]" />
                            <span className="text-[#7C7C7C]">Applied: {formatDate(app.created)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-[#318FFD]" />
                            <span className="text-[#7C7C7C]">Deadline: {formatDate(opportunity?.deadline)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button 
                            asChild
                            size="sm" 
                            variant="outline"
                            className="border-[#318FFD] text-[#318FFD] hover:bg-[#318FFD]/10"
                          >
                            <Link to={createPageUrl("OpportunityDetails") + `?id=${app.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                          {app.status === "Accepted" && (
                            <Button 
                              size="sm"
                              className="bg-[#08B150] hover:bg-[#06893f] text-white"
                            >
                              Start Collaboration
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}