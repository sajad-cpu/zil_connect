import { pb } from "@/api/pocketbaseClient";
import { offerClaimService } from "@/api/services/offerClaimService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Building2,
  Calendar,
  Check,
  Copy,
  ShoppingBag,
  Tag
} from "lucide-react";
import { useState } from "react";

export default function MyClaimedOffers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: claimedOffers, isLoading } = useQuery({
    queryKey: ['my-claimed-offers'],
    queryFn: async () => {
      const userId = pb.authStore.model?.id;
      if (!userId) return [];
      return await offerClaimService.getUserClaims(userId);
    },
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

  const claimedOffersList = claimedOffers || [];
  const activeClaims = claimedOffersList.filter((c: any) =>
    c.status !== 'redeemed' && !isExpired(c.expires_at)
  );
  const expiredClaims = claimedOffersList.filter((c: any) =>
    isExpired(c.expires_at) && c.status !== 'redeemed'
  );
  const redeemedClaims = claimedOffersList.filter((c: any) =>
    c.status === 'redeemed'
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">My Claimed Offers</h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-white/90">All your saved coupon codes in one place</p>
        </div>
      </div>

      {isLoading || !claimedOffers ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-[#E4E7EB] shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="w-12 h-12 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-[#E4E7EB] shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                          </div>
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="bg-[#F8F9FC] border-2 border-dashed border-[#6C4DE6] rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-3 w-32" />
                              <Skeleton className="h-6 w-48" />
                            </div>
                            <Skeleton className="h-9 w-20 rounded-md" />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="border-[#E4E7EB] shadow-md">
              <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-[#7C7C7C]">Active Coupons</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#08B150]">{activeClaims.length}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#08B150]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-[#08B150]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E4E7EB] shadow-md">
              <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-[#7C7C7C]">Redeemed</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#318FFD]">{redeemedClaims.length}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#318FFD]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#318FFD]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E4E7EB] shadow-md">
              <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-[#7C7C7C]">Expired</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#FF6B6B]">{expiredClaims.length}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6B6B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {claimedOffers.length === 0 ? (
            /* Empty State */
            <Card className="border-[#E4E7EB] shadow-md text-center py-10 sm:py-12">
              <CardContent className="p-4 sm:p-6">
                <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-[#7C7C7C]/30 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-[#1E1E1E] mb-2">No claimed offers yet</h3>
                <p className="text-sm sm:text-base text-[#7C7C7C] mb-4 sm:mb-6">Browse available offers and claim your first deal!</p>
                <Button
                  onClick={() => window.location.href = '/Offers'}
                  className="bg-[#08B150] hover:bg-[#06893f] text-white text-sm sm:text-base"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Browse Offers
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {activeClaims.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-3 sm:mb-4">Active Coupons</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {activeClaims.map((claim: any) => (
                      <Card
                        key={claim.id}
                        className="border-[#E4E7EB] shadow-md hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                            {/* Discount Badge */}
                            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] rounded-lg flex flex-col items-center justify-center text-white">
                              <span className="text-2xl sm:text-3xl font-bold">{claim.expand?.offer?.discount_percentage}%</span>
                              <span className="text-xs">OFF</span>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 w-full sm:w-auto">
                              <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg sm:text-xl font-bold text-[#1E1E1E] mb-1 break-words">
                                    {claim.expand?.offer?.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-[#7C7C7C] mb-2 line-clamp-2">
                                    {claim.expand?.offer?.description}
                                  </p>
                                </div>
                                {getStatusBadge(claim)}
                              </div>

                              {/* Coupon Code */}
                              <div className="bg-[#F8F9FC] border-2 border-dashed border-[#6C4DE6] rounded-lg p-2.5 sm:p-3 mb-2 sm:mb-3">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-[#7C7C7C] mb-1">Your Coupon Code</p>
                                    <p className="font-mono text-base sm:text-lg font-bold text-[#1E1E1E] tracking-wider break-all sm:break-normal">
                                      {claim.claim_code}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopyCode(claim.claim_code)}
                                    className="text-[#6C4DE6] hover:text-[#593CC9] hover:bg-[#6C4DE6]/10 text-xs sm:text-sm w-full sm:w-auto"
                                  >
                                    {copiedCode === claim.claim_code ? (
                                      <>
                                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                        Copied!
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                        Copy
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>

                              {/* Info */}
                              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-[#7C7C7C]">
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                                  <span className="truncate">{claim.expand?.offer?.business_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
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
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-3 sm:mb-4">Redeemed</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {redeemedClaims.map((claim: any) => (
                      <Card
                        key={claim.id}
                        className="border-[#E4E7EB] shadow-md opacity-75"
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-600">
                              <span className="text-2xl sm:text-3xl font-bold">{claim.expand?.offer?.discount_percentage}%</span>
                              <span className="text-xs">OFF</span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-2 mb-2">
                                <h3 className="text-base sm:text-lg font-bold text-[#1E1E1E] break-words">
                                  {claim.expand?.offer?.title}
                                </h3>
                                {getStatusBadge(claim)}
                              </div>
                              <p className="text-xs sm:text-sm text-[#7C7C7C] mb-1 sm:mb-2">
                                Code: <span className="font-mono font-semibold break-all">{claim.claim_code}</span>
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
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-3 sm:mb-4">Expired</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {expiredClaims.map((claim: any) => (
                      <Card
                        key={claim.id}
                        className="border-[#E4E7EB] shadow-md opacity-60"
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-600">
                              <span className="text-2xl sm:text-3xl font-bold">{claim.expand?.offer?.discount_percentage}%</span>
                              <span className="text-xs">OFF</span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-2 mb-2">
                                <h3 className="text-base sm:text-lg font-bold text-[#1E1E1E] break-words">
                                  {claim.expand?.offer?.title}
                                </h3>
                                {getStatusBadge(claim)}
                              </div>
                              <p className="text-xs sm:text-sm text-[#7C7C7C]">
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
      )}
    </div>
  );
}
