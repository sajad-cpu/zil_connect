import { opportunityService } from "@/api/services/opportunityService";
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

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['opportunities-all', sortBy],
    queryFn: () => opportunityService.list(sortBy),
    initialData: [],
  });

  const filteredOpportunities = opportunities.filter((opp: any) => {
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
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Business Opportunities</h1>
              <p className="text-white/90">Discover and apply to opportunities that match your business</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">{filteredOpportunities.length}</span>
                <span className="text-white/80">Available</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-white text-[#6C4DE6] hover:bg-white/90">
                <Link to={createPageUrl("CreateOpportunity")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Opportunity
                </Link>
              </Button>
              <Button asChild className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30">
                <Link to={createPageUrl("MyOpportunities")}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  My Opportunities
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="border-[#E4E7EB] shadow-lg mb-8">
          <CardContent className="p-6">
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
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#E4E7EB]">
              <span className="text-sm text-[#7C7C7C]">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-[#E4E7EB]">
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
        {isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-[#6C4DE6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#7C7C7C]">Loading opportunities...</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredOpportunities.length === 0 && (
          <Card className="text-center py-16 border-[#E4E7EB]">
            <CardContent>
              <Briefcase className="w-20 h-20 text-[#7C7C7C]/30 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#1E1E1E] mb-3">No Opportunities Found</h3>
              <p className="text-[#7C7C7C] mb-8 max-w-md mx-auto">
                Try adjusting your filters or search terms
              </p>
            </CardContent>
          </Card>
        )}

        {/* Opportunities Grid */}
        {!isLoading && filteredOpportunities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getTypeColor(opp.type)}>
                            {opp.type}
                          </Badge>
                          <Badge className={getStatusColor(opp.status)}>
                            {opp.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Title & Company */}
                      <h3 className="text-lg font-bold text-[#1E1E1E] mb-2 line-clamp-2">
                        {opp.title}
                      </h3>
                      <p className="text-sm text-[#7C7C7C] mb-4">{opp.company_name}</p>

                      {/* Description */}
                      <p className="text-sm text-[#7C7C7C] mb-4 line-clamp-2">
                        {opp.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-[#318FFD]" />
                          <span className="text-[#1E1E1E] font-semibold">{opp.budget || "TBD"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-[#318FFD]" />
                          <span className="text-[#7C7C7C]">{opp.location || "Remote"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-[#318FFD]" />
                          <span className="text-[#7C7C7C]">Deadline: {formatDate(opp.deadline)}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#E4E7EB]">
                        <div className="flex items-center gap-2 text-sm text-[#7C7C7C]">
                          <Eye className="w-4 h-4" />
                          <span>{opp.views || 0} views</span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
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
