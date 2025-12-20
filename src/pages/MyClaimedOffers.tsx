import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Tag,
  Copy,
  Check,
  Calendar,
  Building2,
  AlertCircle,
  Loader2,
  ShoppingBag
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { pb } from "@/api/pocketbaseClient";
import { offerClaimService } from "@/api/services/offerClaimService";

export default function MyClaimedOffers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: claimedOffers = [], isLoading } = useQuery({
    queryKey: ['my-claimed-offers'],
    queryFn: async () => {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];
      return await offerClaimService.getUserClaims(userId);
    },
    initialData: [],
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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

  const getStatusBadge = (claim: any) => {
    if (claim.status === 'redeemed') {
      return <Badge className="bg-[#08B150] text-white border-[#08B150]/20">Redeemed</Badge>;
    }
    if (isExpired(claim.expires_at)) {
      return <Badge className="bg-[#FF6B6B] text-white border-[#FF6B6B]/20">Expired</Badge>;
    }
    return <Badge className="bg-[#318FFD] text-white border-[#318FFD]/20">Active</Badge>;
  };

  const activeClaims = claimedOffers.filter((c: any) =>
    c.status !== 'redeemed' && !isExpired(c.expires_at)
  );
  const expiredClaims = claimedOffers.filter((c: any) =>
    isExpired(c.expires_at) && c.status !== 'redeemed'
  );
  const redeemedClaims = claimedOffers.filter((c: any) =>
    c.status === 'redeemed'
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingBag className="w-10 h-10" />
            <h1 className="text-4xl font-bold">My Claimed Offers</h1>
          </div>
          <p className="text-xl text-white/90">All your saved coupon codes in one place</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-[#E4E7EB] shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7C7C7C]">Active Coupons</p>
                  <p className="text-3xl font-bold text-[#08B150]">{activeClaims.length}</p>
                </div>
                <div className="w-12 h-12 bg-[#08B150]/10 rounded-full flex items-center justify-center">
                  <Tag className="w-6 h-6 text-[#08B150]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7C7C7C]">Redeemed</p>
                  <p className="text-3xl font-bold text-[#318FFD]">{redeemedClaims.length}</p>
                </div>
                <div className="w-12 h-12 bg-[#318FFD]/10 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-[#318FFD]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4E7EB] shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7C7C7C]">Expired</p>
                  <p className="text-3xl font-bold text-[#FF6B6B]">{expiredClaims.length}</p>
                </div>
                <div className="w-12 h-12 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#FF6B6B]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-[#6C4DE6] animate-spin" />
          </div>
        ) : claimedOffers.length === 0 ? (
          /* Empty State */
          <Card className="border-[#E4E7EB] shadow-md text-center py-12">
            <CardContent>
              <ShoppingBag className="w-16 h-16 text-[#7C7C7C]/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">No claimed offers yet</h3>
              <p className="text-[#7C7C7C] mb-6">Browse available offers and claim your first deal!</p>
              <Button
                onClick={() => window.location.href = '/Offers'}
                className="bg-[#08B150] hover:bg-[#06893f] text-white"
              >
                <Tag className="w-4 h-4 mr-2" />
                Browse Offers
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Claims List */
          <div className="space-y-6">
            {/* Active Claims */}
            {activeClaims.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">Active Coupons</h2>
                <div className="space-y-4">
                  {activeClaims.map((claim: any) => (
                    <Card
                      key={claim.id}
                      className="border-[#E4E7EB] shadow-md hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Discount Badge */}
                          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] rounded-lg flex flex-col items-center justify-center text-white">
                            <span className="text-3xl font-bold">{claim.expand?.offer?.discount_percentage}%</span>
                            <span className="text-xs">OFF</span>
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-[#1E1E1E] mb-1">
                                  {claim.expand?.offer?.title}
                                </h3>
                                <p className="text-[#7C7C7C] text-sm mb-2">
                                  {claim.expand?.offer?.description}
                                </p>
                              </div>
                              {getStatusBadge(claim)}
                            </div>

                            {/* Coupon Code */}
                            <div className="bg-[#F8F9FC] border-2 border-dashed border-[#6C4DE6] rounded-lg p-3 mb-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-[#7C7C7C] mb-1">Your Coupon Code</p>
                                  <p className="font-mono text-lg font-bold text-[#1E1E1E] tracking-wider">
                                    {claim.claim_code}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCopyCode(claim.claim_code)}
                                  className="text-[#6C4DE6] hover:text-[#593CC9] hover:bg-[#6C4DE6]/10"
                                >
                                  {copiedCode === claim.claim_code ? (
                                    <>
                                      <Check className="w-4 h-4 mr-1" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4 mr-1" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-[#7C7C7C]">
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4 text-[#318FFD]" />
                                <span>{claim.expand?.offer?.business_name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-[#318FFD]" />
                                <span>Expires: {formatDate(claim.expires_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Redeemed Claims */}
            {redeemedClaims.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">Redeemed</h2>
                <div className="space-y-4">
                  {redeemedClaims.map((claim: any) => (
                    <Card
                      key={claim.id}
                      className="border-[#E4E7EB] shadow-md opacity-75"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-600">
                            <span className="text-3xl font-bold">{claim.expand?.offer?.discount_percentage}%</span>
                            <span className="text-xs">OFF</span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold text-[#1E1E1E]">
                                {claim.expand?.offer?.title}
                              </h3>
                              {getStatusBadge(claim)}
                            </div>
                            <p className="text-sm text-[#7C7C7C] mb-2">
                              Code: <span className="font-mono font-semibold">{claim.claim_code}</span>
                            </p>
                            <p className="text-xs text-[#7C7C7C]">
                              Redeemed on: {formatDate(claim.redeemed_at)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Expired Claims */}
            {expiredClaims.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">Expired</h2>
                <div className="space-y-4">
                  {expiredClaims.map((claim: any) => (
                    <Card
                      key={claim.id}
                      className="border-[#E4E7EB] shadow-md opacity-60"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-600">
                            <span className="text-3xl font-bold">{claim.expand?.offer?.discount_percentage}%</span>
                            <span className="text-xs">OFF</span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold text-[#1E1E1E]">
                                {claim.expand?.offer?.title}
                              </h3>
                              {getStatusBadge(claim)}
                            </div>
                            <p className="text-sm text-[#7C7C7C]">
                              Expired on: {formatDate(claim.expires_at)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
