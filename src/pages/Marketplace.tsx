
import { businessService } from "@/api/services/businessService";
import { BusinessCardSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Eye,
  Filter,
  MapPin,
  Search,
  Star,
  TrendingUp,
  Verified
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("-created");

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['businesses-all', sortBy],
    queryFn: () => businessService.list(sortBy),
    initialData: [],
  });

  const industries = [
    "All Industries",
    "Technology",
    "Manufacturing",
    "Retail",
    "Healthcare",
    "Finance",
    "Logistics",
    "Construction",
    "Food & Beverage",
    "Professional Services",
    "Education"
  ];

  const filteredBusinesses = businesses.filter((business) => {
    const businessName = business.name || business.business_name || '';
    const matchesSearch = businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === "all" || business.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-6 sm:py-8 md:py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3"
          >
            Business Marketplace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-white/90"
          >
            Discover verified SMBs ready to partner with you
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="mb-6 sm:mb-8 border-[#E4E7EB] shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7C7C7C] w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                      type="text"
                      placeholder="Search businesses, services, locations..."
                      className="pl-9 sm:pl-10 h-10 sm:h-12 border-[#E4E7EB] text-sm sm:text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="h-10 sm:h-12 border-[#E4E7EB] text-sm sm:text-base">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.slice(1).map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10 sm:h-12 border-[#E4E7EB] text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-created">Newest</SelectItem>
                    <SelectItem value="created">Oldest</SelectItem>
                    <SelectItem value="name">A-Z</SelectItem>
                    <SelectItem value="-name">Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6"
        >
          <p className="text-sm sm:text-base text-[#7C7C7C]">
            <span className="font-semibold text-[#1E1E1E]">{filteredBusinesses.length}</span> businesses found
          </p>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20 text-xs">
              <Verified className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Verified businesses get 3x more leads</span>
              <span className="sm:hidden">Verified</span>
            </Badge>
          </div>
        </motion.div>

        {/* Business Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <BusinessCardSkeleton count={6} />
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center py-10 sm:py-12 border-[#E4E7EB]">
              <CardContent className="p-4 sm:p-6">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-[#7C7C7C]/30 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-[#1E1E1E] mb-2">No businesses found</h3>
                <p className="text-sm sm:text-base text-[#7C7C7C] mb-4 sm:mb-6">Try adjusting your search or filters</p>
                <Button
                  onClick={() => { setSearchTerm(""); setSelectedIndustry("all"); }}
                  className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white text-sm sm:text-base"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredBusinesses.map((business) => (
              <motion.div
                key={business.id}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-2xl transition-all duration-300 border-[#E4E7EB] shadow-lg group relative overflow-hidden cursor-pointer">
                  {business.is_boosted && (
                    <motion.div
                      initial={{ x: 100 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute top-0 right-0 bg-gradient-to-r from-[#6C4DE6] to-[#7E57C2] text-white text-xs font-bold px-3 py-1 rounded-bl-lg"
                    >
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      Boosted
                    </motion.div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3 mb-3">
                      {business.logo ? (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg"
                        >
                          <img
                            src={businessService.getLogoUrl(business)}
                            alt={business.name || business.business_name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                        >
                          {(business.name || business.business_name || 'B')?.[0]?.toUpperCase() || 'B'}
                        </motion.div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-[#6C4DE6] transition-colors duration-300 mb-1">
                          {business.name || business.business_name || 'Business'}
                        </CardTitle>
                        <p className="text-sm text-[#7C7C7C]">{business.industry}</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {business.is_verified && (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Badge className="bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20 text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </motion.div>
                      )}
                      {(business.verified_badges as string[] | undefined)?.slice(0, 2).map((badge: string, idx: number) => (
                        <motion.div key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Badge variant="outline" className="text-xs border-[#E4E7EB] text-[#7C7C7C]">
                            {badge}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-[#7C7C7C] text-sm mb-4 line-clamp-3">
                      {business.description || business.tagline || "Explore this business profile"}
                    </p>

                    {/* Location */}
                    {business.location && (
                      <div className="flex items-center gap-2 text-sm text-[#7C7C7C] mb-4">
                        <MapPin className="w-4 h-4 text-[#318FFD]" />
                        <span>{business.location}</span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E7EB]">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-bold">{business.trust_score || 0}</span>
                        </div>
                        <p className="text-xs text-[#7C7C7C]">Trust</p>
                      </div>
                      <div className="text-center border-x border-[#E4E7EB]">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Eye className="w-4 h-4 text-[#318FFD]" />
                          <span className="text-sm font-bold text-[#1E1E1E]">{business.profile_views || 0}</span>
                        </div>
                        <p className="text-xs text-[#7C7C7C]">Views</p>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-[#1E1E1E] mb-1">
                          {business.engagement_score || 0}
                        </div>
                        <p className="text-xs text-[#7C7C7C]">Score</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild className="w-full bg-[#6C4DE6] hover:bg-[#593CC9] text-white transition-all duration-300 shadow-md hover:shadow-lg">
                        <Link to={createPageUrl("BusinessDetails") + `?id=${business.id}`}>
                          View Profile
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
