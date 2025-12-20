import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Tag,
  Plus,
  TrendingUp,
  Eye,
  Users,
  Calendar,
  Edit,
  Trash2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { pb } from "@/api/pocketbaseClient";
import { offerService } from "@/api/services/offerService";
import { useToast } from "@/components/ui/use-toast";

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
      <div className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Tag className="w-10 h-10" />
                <h1 className="text-4xl font-bold">My Offers</h1>
              </div>
              <p className="text-xl text-white/90">Manage your special offers and track performance</p>
            </div>
            <Button
              onClick={() => navigate("/CreateOffer")}
              className="bg-[#08B150] hover:bg-[#06893f] text-white shadow-lg"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Offer
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-[#E4E7EB] shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7C7C7C]">Total Offers</p>
                  <p className="text-3xl font-bold text-[#1E1E1E]">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-[#6C4DE6]/10 rounded-full flex items-center justify-center">
                  <Tag className="w-6 h-6 text-[#6C4DE6]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7C7C7C]">Active Offers</p>
                  <p className="text-3xl font-bold text-[#08B150]">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-[#08B150]/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#08B150]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7C7C7C]">Expired</p>
                  <p className="text-3xl font-bold text-[#FF6B6B]">{stats.expired}</p>
                </div>
                <div className="w-12 h-12 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#FF6B6B]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7C7C7C]">Total Claims</p>
                  <p className="text-3xl font-bold text-[#318FFD]">{stats.totalClaims}</p>
                </div>
                <div className="w-12 h-12 bg-[#318FFD]/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#318FFD]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Offers List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-[#6C4DE6] animate-spin" />
          </div>
        ) : myOffers.length === 0 ? (
          <Card className="border-[#E4E7EB] shadow-md text-center py-12">
            <CardContent>
              <Tag className="w-16 h-16 text-[#7C7C7C]/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">No offers yet</h3>
              <p className="text-[#7C7C7C] mb-6">Create your first offer to start attracting customers</p>
              <Button
                onClick={() => navigate("/CreateOffer")}
                className="bg-[#08B150] hover:bg-[#06893f] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Offer
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myOffers.map((offer: any) => (
              <Card
                key={offer.id}
                className="border-[#E4E7EB] shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Offer Details */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Discount Badge */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] rounded-lg flex flex-col items-center justify-center text-white">
                          <span className="text-3xl font-bold">{offer.discount_percentage}%</span>
                          <span className="text-xs">OFF</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-start gap-2 mb-2">
                            <h3 className="text-xl font-bold text-[#1E1E1E]">{offer.title}</h3>
                            {offer.is_featured && (
                              <Badge className="bg-[#FFD700] text-[#1E1E1E] border-[#FFD700]/20">
                                Featured
                              </Badge>
                            )}
                            {isExpired(offer.valid_until) && (
                              <Badge className="bg-[#FF6B6B] text-white border-[#FF6B6B]/20">
                                Expired
                              </Badge>
                            )}
                          </div>

                          <p className="text-[#7C7C7C] mb-3 line-clamp-2">{offer.description}</p>

                          <div className="flex flex-wrap gap-4 text-sm text-[#7C7C7C]">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-[#318FFD]" />
                              <span>{offer.redemptions || 0} claims</span>
                            </div>
                            {offer.valid_until && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-[#318FFD]" />
                                <span>Expires: {formatDate(offer.valid_until)}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-[#318FFD]" />
                              <span>Created: {formatDate(offer.created)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#E4E7EB]"
                        onClick={() => toast({ title: "Coming Soon", description: "Edit functionality will be added soon" })}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDelete(offer.id)}
                        disabled={deletingId === offer.id}
                      >
                        {deletingId === offer.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1" />
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
