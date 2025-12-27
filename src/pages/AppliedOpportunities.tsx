import { applicationService } from "@/api/services/applicationService";
import { ListSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AppliedOpportunities() {
  // Fetch real applied opportunities from API
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.getMyApplications('-created'),
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any; label: string }> = {
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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Project": "bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20",
      "Partnership": "bg-[#7E57C2]/10 text-[#7E57C2] border-[#7E57C2]/20",
      "Tender": "bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20",
      "RFP": "bg-[#6C4DE6]/10 text-[#6C4DE6] border-[#6C4DE6]/20",
    };
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Button variant="ghost" asChild className="text-white hover:bg-white/10 mb-3 sm:mb-4 text-sm sm:text-base">
            <Link to={createPageUrl("Opportunities")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Opportunities</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Briefcase className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">My Applications</h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-white/90">Track your submitted opportunity applications</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-[#E4E7EB] shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[#7C7C7C] text-xs sm:text-sm mb-1">Total Applications</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#1E1E1E]">{applications.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#6C4DE6]/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[#6C4DE6]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[#7C7C7C] text-xs sm:text-sm mb-1">Accepted</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#08B150]">
                    {applications.filter((o: any) => o.status === "Accepted").length}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#08B150]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#08B150]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[#7C7C7C] text-xs sm:text-sm mb-1">Pending Review</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#318FFD]">
                    {applications.filter((o: any) => o.status === "Pending").length}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#318FFD]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#318FFD]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            <ListSkeleton count={4} showImage={true} showActions={true} />
          </div>
        ) : applications.length === 0 ? (
          <Card className="text-center py-12 sm:py-16 border-[#E4E7EB]">
            <CardContent className="p-4 sm:p-6">
              <Briefcase className="w-16 h-16 sm:w-20 sm:h-20 text-[#7C7C7C]/30 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-2 sm:mb-3">No Applications Yet</h3>
              <p className="text-sm sm:text-base text-[#7C7C7C] mb-6 sm:mb-8 max-w-md mx-auto">
                Start exploring opportunities and apply to ones that match your business
              </p>
              <Button asChild className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white text-sm sm:text-base">
                <Link to={createPageUrl("Opportunities")}>
                  Explore Opportunities
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {applications.map((app: any) => {
              const opportunity = app.expand?.opportunity;
              const statusConfig = getStatusConfig(app.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card
                  key={app.id}
                  className="border-[#E4E7EB] shadow-lg hover:shadow-xl transition-all"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-6">
                      {/* Icon */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                              <Badge className={`${getTypeColor(opportunity?.type)} text-xs`}>
                                {opportunity?.type || "N/A"}
                              </Badge>
                              <Badge className={`${statusConfig.color} text-xs`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1 break-words">{opportunity?.title || "Untitled"}</h3>
                            <p className="text-xs sm:text-sm text-[#7C7C7C] truncate">{opportunity?.company_name || app.company_name}</p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                            <span className="text-[#7C7C7C] truncate">{opportunity?.budget || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                            <span className="text-[#7C7C7C] truncate">{opportunity?.location || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                            <span className="text-[#7C7C7C] truncate">Applied: {formatDate(app.created)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                            <span className="text-[#7C7C7C] truncate">Deadline: {formatDate(opportunity?.deadline)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-[#318FFD] text-[#318FFD] hover:bg-[#318FFD]/10 w-full sm:w-auto text-xs sm:text-sm"
                          >
                            <Link to={createPageUrl("OpportunityDetails") + `?id=${app.id}`}>
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                          {app.status === "Accepted" && (
                            <Button
                              size="sm"
                              className="bg-[#08B150] hover:bg-[#06893f] text-white w-full sm:w-auto text-xs sm:text-sm"
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