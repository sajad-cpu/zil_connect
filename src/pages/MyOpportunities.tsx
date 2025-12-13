import React, { useState } from "react";
import { opportunityService } from "@/api/services/opportunityService";
import { applicationService } from "@/api/services/applicationService";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Briefcase,
  Users,
  Eye,
  Calendar,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function MyOpportunities() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>("all");
  const [isRecalculating, setIsRecalculating] = useState(false);

  const { data: myOpportunities = [], isLoading: loadingOpportunities, refetch: refetchOpportunities } = useQuery({
    queryKey: ['my-opportunities'],
    queryFn: () => opportunityService.getMyOpportunities('-created'),
  });

  const { data: applicationsReceived = [], isLoading: loadingApplications, refetch } = useQuery({
    queryKey: ['applications-received', selectedOpportunity],
    queryFn: () => applicationService.getApplicationsToMyOpportunities(
      selectedOpportunity === "all" ? undefined : selectedOpportunity
    ),
  });

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await applicationService.updateStatus(applicationId, newStatus);
      toast.success(`Application status updated to ${newStatus}`);
      refetch();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleRecalculateCounts = async () => {
    setIsRecalculating(true);
    try {
      await opportunityService.recalculateAllCounts();
      toast.success("Counts updated successfully!");
      refetchOpportunities();
    } catch (error: any) {
      console.error("Error recalculating counts:", error);
      toast.error("Failed to update counts");
    } finally {
      setIsRecalculating(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      "Pending": {
        color: "bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20",
        icon: Clock,
        label: "Pending"
      },
      "Reviewed": {
        color: "bg-[#7E57C2]/10 text-[#7E57C2] border-[#7E57C2]/20",
        icon: Eye,
        label: "Reviewed"
      },
      "Accepted": {
        color: "bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20",
        icon: CheckCircle,
        label: "Accepted"
      },
      "Rejected": {
        color: "bg-[#FF4C4C]/10 text-[#FF4C4C] border-[#FF4C4C]/20",
        icon: XCircle,
        label: "Rejected"
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
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6C4DE6] to-[#7E57C2] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">My Opportunities</h1>
                <p className="text-white/90">Manage your posted opportunities and view applications</p>
              </div>
            </div>
            <Button
              onClick={handleRecalculateCounts}
              disabled={isRecalculating}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRecalculating ? 'animate-spin' : ''}`} />
              {isRecalculating ? 'Updating...' : 'Refresh Counts'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="opportunities">My Opportunities</TabsTrigger>
            <TabsTrigger value="applications">Applications Received</TabsTrigger>
          </TabsList>

          {/* My Posted Opportunities */}
          <TabsContent value="opportunities" className="space-y-4">
            {loadingOpportunities ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-[#6C4DE6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#7C7C7C]">Loading your opportunities...</p>
              </div>
            ) : myOpportunities.length === 0 ? (
              <Card className="text-center py-16 border-[#E4E7EB]">
                <CardContent>
                  <Briefcase className="w-20 h-20 text-[#7C7C7C]/30 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#1E1E1E] mb-3">No Opportunities Posted Yet</h3>
                  <p className="text-[#7C7C7C] mb-8 max-w-md mx-auto">
                    Start posting opportunities to connect with potential partners
                  </p>
                  <Button asChild className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white">
                    <Link to={createPageUrl("CreateOpportunity")}>
                      Post Opportunity
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myOpportunities.map((opp: any) => (
                  <Card key={opp.id} className="border-[#E4E7EB] shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex gap-2 mb-2">
                            <Badge className={getTypeColor(opp.type)}>
                              {opp.type}
                            </Badge>
                            <Badge className={opp.status === 'Open' ? 'bg-[#08B150]/10 text-[#08B150]' : 'bg-gray-100 text-gray-600'}>
                              {opp.status}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">{opp.title}</h3>
                          <p className="text-sm text-[#7C7C7C] line-clamp-2">{opp.description}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[#7C7C7C]">
                          <Users className="w-4 h-4 text-[#318FFD]" />
                          <span>{opp.application_count || 0} applications</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#7C7C7C]">
                          <Eye className="w-4 h-4 text-[#318FFD]" />
                          <span>{opp.views || 0} views</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#7C7C7C]">
                          <Calendar className="w-4 h-4 text-[#318FFD]" />
                          <span>Posted: {formatDate(opp.created)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="flex-1 border-[#E4E7EB]"
                        >
                          <Link to={createPageUrl("OpportunityDetails") + `?id=${opp.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                          onClick={() => {
                            setSelectedOpportunity(opp.id);
                            // Switch to applications tab
                            const tabTrigger = document.querySelector('[value="applications"]') as HTMLElement;
                            tabTrigger?.click();
                          }}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          View Applications
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Applications Received */}
          <TabsContent value="applications" className="space-y-4">
            {/* Filter by Opportunity */}
            {myOpportunities.length > 0 && (
              <Card className="border-[#E4E7EB] shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-[#1E1E1E]">Filter by Opportunity:</label>
                    <Select value={selectedOpportunity} onValueChange={setSelectedOpportunity}>
                      <SelectTrigger className="w-[300px] border-[#E4E7EB]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Opportunities</SelectItem>
                        {myOpportunities.map((opp: any) => (
                          <SelectItem key={opp.id} value={opp.id}>
                            {opp.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {loadingApplications ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-[#6C4DE6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#7C7C7C]">Loading applications...</p>
              </div>
            ) : applicationsReceived.length === 0 ? (
              <Card className="text-center py-16 border-[#E4E7EB]">
                <CardContent>
                  <Users className="w-20 h-20 text-[#7C7C7C]/30 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#1E1E1E] mb-3">No Applications Yet</h3>
                  <p className="text-[#7C7C7C]">
                    Applications to your opportunities will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applicationsReceived.map((app: any) => {
                  const statusConfig = getStatusConfig(app.status);
                  const StatusIcon = statusConfig.icon;
                  const opportunity = app.expand?.opportunity;

                  return (
                    <Card key={app.id} className="border-[#E4E7EB] shadow-lg">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                              <span className="text-sm text-[#7C7C7C]">
                                Applied {formatDate(app.created)}
                              </span>
                            </div>
                            <CardTitle className="text-xl text-[#1E1E1E]">
                              {opportunity?.title || "Opportunity"}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Applicant Details */}
                        <div className="bg-[#F8F9FC] rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-[#1E1E1E] mb-3">Applicant Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-[#7C7C7C] mb-1">Company</p>
                              <p className="font-medium text-[#1E1E1E]">{app.company_name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-[#7C7C7C] mb-1">Contact Person</p>
                              <p className="font-medium text-[#1E1E1E]">{app.contact_person}</p>
                            </div>
                            <div>
                              <p className="text-xs text-[#7C7C7C] mb-1">Email</p>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#318FFD]" />
                                <a href={`mailto:${app.email}`} className="text-[#318FFD] hover:underline">
                                  {app.email}
                                </a>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-[#7C7C7C] mb-1">Phone</p>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#318FFD]" />
                                <a href={`tel:${app.phone}`} className="text-[#318FFD] hover:underline">
                                  {app.phone}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cover Letter */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-[#1E1E1E] mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#318FFD]" />
                            Cover Letter
                          </h4>
                          <p className="text-[#7C7C7C] whitespace-pre-line bg-white p-4 rounded-lg border border-[#E4E7EB]">
                            {app.cover_letter}
                          </p>
                        </div>

                        {/* Portfolio */}
                        {app.portfolio_url && (
                          <div className="mb-4">
                            <a
                              href={app.portfolio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-[#318FFD] hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Portfolio
                            </a>
                          </div>
                        )}

                        {/* Status Update */}
                        <div className="flex gap-4 pt-4 border-t border-[#E4E7EB]">
                          <div className="flex-1">
                            <label className="text-sm font-medium text-[#1E1E1E] mb-2 block">
                              Update Status
                            </label>
                            <Select
                              value={app.status}
                              onValueChange={(value) => handleStatusUpdate(app.id, value)}
                            >
                              <SelectTrigger className="border-[#E4E7EB]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Reviewed">Reviewed</SelectItem>
                                <SelectItem value="Accepted">Accepted</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
