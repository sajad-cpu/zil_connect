import { pb } from "@/api/pocketbaseClient";
import { offerService } from "@/api/services/offerService";
import { ListSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar,
  Edit,
  Eye,
  Loader2,
  Plus,
  Tag,
  Trash2,
  TrendingUp,
  Users
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyOffers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: myOffers = [], isLoading, refetch } = useQuery({
    queryKey: ['my-offers'],
    queryFn: async () => {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];
      return await offerService.filter({ created_by: userId }, '-created');
    },
    initialData: [],
  });

  const handleDelete = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer? This action cannot be undone.")) {
      return;
    }

    setDeletingId(offerId);
    try {
      await offerService.delete(offerId);
      toast({
        title: "Offer Deleted",
        description: "The offer has been removed successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast({
        title: "Error",
        description: "Failed to delete offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return null;
    }
  };

  const isExpired = (dateString: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const getStats = () => {
    const total = myOffers.length;
    const active = myOffers.filter((o: any) => !isExpired(o.valid_until)).length;
    const expired = myOffers.filter((o: any) => isExpired(o.valid_until)).length;
    const totalClaims = myOffers.reduce((sum: number, o: any) => sum + (o.redemptions || 0), 0);

    return { total, active, expired, totalClaims };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Tag className="w-8 h-8 sm:w-10 sm:h-10" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">My Offers</h1>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-white/90">Manage your special offers and track performance</p>
            </div>
            <Button
              onClick={() => navigate("/CreateOffer")}
              className="bg-[#08B150] hover:bg-[#06893f] text-white shadow-lg w-full sm:w-auto text-sm sm:text-base"
              size="lg"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Create New Offer</span>
              <span className="sm:hidden">Create Offer</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <Card className="border-[#E4E7EB] shadow-md">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-[#7C7C7C]">Total Offers</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#1E1E1E]">{stats.total}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#6C4DE6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-[#6C4DE6]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-md">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-[#7C7C7C]">Active Offers</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#08B150]">{stats.active}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#08B150]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#08B150]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-md">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-[#7C7C7C]">Expired</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#FF6B6B]">{stats.expired}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6B6B]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-md">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-[#7C7C7C]">Total Claims</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#318FFD]">{stats.totalClaims}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#318FFD]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#318FFD]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Offers List */}
        {isLoading ? (
          <div className="space-y-4">
            <ListSkeleton count={4} showImage={true} showActions={true} />
          </div>
        ) : myOffers.length === 0 ? (
          <Card className="border-[#E4E7EB] shadow-md text-center py-10 sm:py-12">
            <CardContent className="p-4 sm:p-6">
              <Tag className="w-12 h-12 sm:w-16 sm:h-16 text-[#7C7C7C]/30 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-[#1E1E1E] mb-2">No offers yet</h3>
              <p className="text-sm sm:text-base text-[#7C7C7C] mb-4 sm:mb-6">Create your first offer to start attracting customers</p>
              <Button
                onClick={() => navigate("/CreateOffer")}
                className="bg-[#08B150] hover:bg-[#06893f] text-white text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Offer
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {myOffers.map((offer: any) => (
              <Card
                key={offer.id}
                className="border-[#E4E7EB] shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
                    {/* Left: Offer Details */}
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Discount Badge */}
                        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] rounded-lg flex flex-col items-center justify-center text-white">
                          <span className="text-2xl sm:text-3xl font-bold">{offer.discount_percentage}%</span>
                          <span className="text-xs">OFF</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start gap-1.5 sm:gap-2 mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-[#1E1E1E] break-words">{offer.title}</h3>
                            {offer.is_featured && (
                              <Badge className="bg-[#FFD700] text-[#1E1E1E] border-[#FFD700]/20 text-xs">
                                Featured
                              </Badge>
                            )}
                            {isExpired(offer.valid_until) && (
                              <Badge className="bg-[#FF6B6B] text-white border-[#FF6B6B]/20 text-xs">
                                Expired
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs sm:text-sm text-[#7C7C7C] mb-2 sm:mb-3 line-clamp-2">{offer.description}</p>

                          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-[#7C7C7C]">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                              <span>{offer.redemptions || 0} claims</span>
                            </div>
                            {offer.valid_until && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                                <span className="truncate">Expires: {formatDate(offer.valid_until)}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                              <span className="truncate">Created: {formatDate(offer.created)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#E4E7EB] flex-1 sm:flex-none text-xs sm:text-sm"
                        onClick={() => toast({ title: "Coming Soon", description: "Edit functionality will be added soon" })}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex-1 sm:flex-none text-xs sm:text-sm"
                        onClick={() => handleDelete(offer.id)}
                        disabled={deletingId === offer.id}
                      >
                        {deletingId === offer.id ? (
                          <>
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin" />
                            <span className="hidden sm:inline">Deleting...</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
