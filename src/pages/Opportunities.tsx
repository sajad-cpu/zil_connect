import { opportunityService } from "@/api/services/opportunityService";
import { OpportunityCardSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPageUrl } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  DollarSign,
  Eye,
  Filter,
  FolderOpen,
  MapPin,
  Plus,
  Search as SearchIcon,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Opportunities() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("-created");

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities-all', sortBy],
    queryFn: () => opportunityService.list(sortBy),
  });

  const opportunitiesList = opportunities || [];
  const filteredOpportunities = opportunitiesList.filter((opp: any) => {
    const matchesSearch = !searchQuery ||
      opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || opp.type === typeFilter;
    const matchesStatus = statusFilter === "all" || opp.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Project": "bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20",
      "Partnership": "bg-[#7E57C2]/10 text-[#7E57C2] border-[#7E57C2]/20",
      "Tender": "bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20",
      "RFP": "bg-[#6C4DE6]/10 text-[#6C4DE6] border-[#6C4DE6]/20",
      "Collaboration": "bg-pink-100 text-pink-700 border-pink-200",
      "Investment": "bg-amber-100 text-amber-700 border-amber-200"
    };
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Open": "bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20",
      "In Progress": "bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20",
      "Awarded": "bg-[#6C4DE6]/10 text-[#6C4DE6] border-[#6C4DE6]/20",
      "Closed": "bg-gray-100 text-gray-600 border-gray-200"
    };
    return colors[status] || colors.Open;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Open";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Open";
      return date.toLocaleDateString();
    } catch {
      return "Open";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6C4DE6] to-[#7E57C2] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Business Opportunities</h1>
              <p className="text-sm sm:text-base text-white/90">Discover and apply to opportunities that match your business</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 sm:mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base">{filteredOpportunities.length}</span>
                <span className="text-white/80 text-xs sm:text-sm">Available</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button asChild className="bg-white text-[#6C4DE6] hover:bg-white/90 w-full sm:w-auto">
                <Link to={createPageUrl("CreateOpportunity")}>
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Post Opportunity</span>
                  <span className="sm:hidden">Post</span>
                </Link>
              </Button>
              <Button asChild className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30 w-full sm:w-auto">
                <Link to={createPageUrl("MyOpportunities")}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">My Opportunities</span>
                  <span className="sm:hidden">My Posts</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Filters */}
        <Card className="border-[#E4E7EB] shadow-lg mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7C7C7C]" />
                  <Input
                    placeholder="Search opportunities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-[#E4E7EB]"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="border-[#E4E7EB]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="Tender">Tender</SelectItem>
                    <SelectItem value="RFP">RFP</SelectItem>
                    <SelectItem value="Collaboration">Collaboration</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-[#E4E7EB]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Awarded">Awarded</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-[#E4E7EB]">
              <span className="text-sm text-[#7C7C7C] whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px] border-[#E4E7EB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-created">Latest</SelectItem>
                  <SelectItem value="created">Oldest</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="-title">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading || !opportunities ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <OpportunityCardSkeleton count={6} />
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <Card className="text-center py-12 sm:py-16 border-[#E4E7EB]">
            <CardContent className="p-4 sm:p-6">
              <Briefcase className="w-16 h-16 sm:w-20 sm:h-20 text-[#7C7C7C]/30 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-2 sm:mb-3">No Opportunities Found</h3>
              <p className="text-sm sm:text-base text-[#7C7C7C] mb-6 sm:mb-8 max-w-md mx-auto">
                Try adjusting your filters or search terms
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredOpportunities.map((opp: any, index: number) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
              >
                <Card className="border-[#E4E7EB] shadow-lg hover:shadow-xl transition-all h-full cursor-pointer">
                  <Link
                    to={createPageUrl("OpportunityDetails") + `?id=${opp.id}`}
                    onClick={() => {
                      // Track view when clicking on opportunity card
                      opportunityService.incrementViews(opp.id)
                        .then(() => {
                          // Invalidate queries to refresh the view count
                          queryClient.invalidateQueries({ queryKey: ['opportunities-all'] });
                          queryClient.invalidateQueries({ queryKey: ['opportunities-recent'] });
                        })
                        .catch(err => {
                          console.error('Failed to increment views:', err);
                        });
                    }}
                  >
                    <CardContent className="p-4 sm:p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex flex-col gap-1 sm:gap-2">
                          <Badge className={`${getTypeColor(opp.type)} text-xs`}>
                            {opp.type}
                          </Badge>
                          <Badge className={`${getStatusColor(opp.status)} text-xs`}>
                            {opp.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Title & Company */}
                      <h3 className="text-base sm:text-lg font-bold text-[#1E1E1E] mb-2 line-clamp-2">
                        {opp.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#7C7C7C] mb-3 sm:mb-4 truncate">{opp.company_name}</p>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#7C7C7C] mb-3 sm:mb-4 line-clamp-2">
                        {opp.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                          <span className="text-[#1E1E1E] font-semibold truncate">{opp.budget || "TBD"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                          <span className="text-[#7C7C7C] truncate">{opp.location || "Remote"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                          <span className="text-[#7C7C7C] truncate">Deadline: {formatDate(opp.deadline)}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-[#E4E7EB]">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#7C7C7C]">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{opp.views || 0} views</span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white w-full sm:w-auto text-xs"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
