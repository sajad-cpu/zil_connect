import { pb } from "@/api/pocketbaseClient";
import { offerService } from "@/api/services/offerService";
import { OfferCardSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Percent,
  Tag,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import OfferClaimModal from "../components/OfferClaimModal";

export default function Offers() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const currentUserId = pb.authStore.model?.id;

  const { data: offers, isLoading, refetch } = useQuery({
    queryKey: ['offers-all'],
    queryFn: () => offerService.list('-created'),
  });

  const offersList = offers || [];
  const featuredOffers = offersList.filter(o => o.is_featured).slice(0, 5);
  const regularOffers = offersList.filter(o => !o.is_featured);

  // Check if current user created the offer
  const isMyOffer = (offer: any) => {
    return offer.created_by === currentUserId;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredOffers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredOffers.length) % featuredOffers.length);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return format(date, 'MMM d, yyyy');
    } catch {
      return null;
    }
  };

  const handleClaimOffer = (offer: any) => {
    setSelectedOffer(offer);
    setClaimModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Tag className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Exclusive Offers</h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-white/90">Special deals and discounts from our business community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Featured Offers Carousel */}
        {isLoading || !offers ? (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-4 sm:mb-6">🔥 Featured Offers</h2>
            <div className="relative">
              <Card className="border-[#E4E7EB] shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-br from-[#6C4DE6] via-[#7E57C2] to-[#593CC9] flex items-center justify-center">
                    <div className="animate-pulse">
                      <div className="h-24 w-24 sm:h-32 sm:w-32 bg-white/20 rounded-lg" />
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center bg-white">
                    <div className="space-y-4">
                      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                      <div className="h-12 w-40 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : featuredOffers.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">🔥 Featured Offers</h2>
            <div className="relative">
              <Card className="border-[#E4E7EB] shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* Image/Discount Side */}
                  <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-br from-[#6C4DE6] via-[#7E57C2] to-[#593CC9] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200')] opacity-20 bg-cover bg-center" />
                    <div className="relative text-center text-white z-10">
                      <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2">{featuredOffers[currentSlide]?.discount_percentage}%</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-semibold">OFF</p>
                      <Badge className="mt-3 sm:mt-4 bg-white/20 text-white border-white/30 text-sm sm:text-base md:text-lg px-3 sm:px-4 py-1.5 sm:py-2">
                        Limited Time
                      </Badge>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center bg-white">
                    <Badge className="w-fit mb-3 sm:mb-4 bg-[#6C4DE6]/10 text-[#6C4DE6] border-[#6C4DE6]/20 text-xs sm:text-sm">
                      Featured Offer
                    </Badge>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1E1E1E] mb-3 sm:mb-4">
                      {featuredOffers[currentSlide]?.title}
                    </h3>
                    <p className="text-[#7C7C7C] text-sm sm:text-base md:text-lg mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-4">
                      {featuredOffers[currentSlide]?.description}
                    </p>
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 text-[#7C7C7C] text-xs sm:text-sm">
                        <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-[#318FFD] flex-shrink-0" />
                        <span className="truncate">By {featuredOffers[currentSlide]?.business_name}</span>
                      </div>
                      {formatDate(featuredOffers[currentSlide]?.valid_until) && (
                        <div className="flex items-center gap-2 text-[#7C7C7C] text-xs sm:text-sm">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#318FFD] flex-shrink-0" />
                          <span>Valid until {formatDate(featuredOffers[currentSlide]?.valid_until)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[#7C7C7C] text-xs sm:text-sm">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#318FFD] flex-shrink-0" />
                        <span>{featuredOffers[currentSlide]?.redemptions || 0} businesses redeemed</span>
                      </div>
                    </div>
                    {!isMyOffer(featuredOffers[currentSlide]) ? (
                      <Button
                        size="lg"
                        className="bg-[#08B150] hover:bg-[#06893f] text-white shadow-lg w-full sm:w-auto text-sm sm:text-base"
                        onClick={() => handleClaimOffer(featuredOffers[currentSlide])}
                      >
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Claim This Offer
                      </Button>
                    ) : (
                      <Badge className="bg-[#6C4DE6] text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                        Your Offer
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>

              {/* Carousel Controls */}
              {featuredOffers.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-lg hover:shadow-xl border-[#E4E7EB] w-8 h-8 sm:w-10 sm:h-10"
                    onClick={prevSlide}
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-lg hover:shadow-xl border-[#E4E7EB] w-8 h-8 sm:w-10 sm:h-10"
                    onClick={nextSlide}
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>

                  {/* Dots */}
                  <div className="flex justify-center gap-2 mt-3 sm:mt-4">
                    {featuredOffers.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-[#6C4DE6] w-6 sm:w-8' : 'bg-[#E4E7EB] w-2'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}

        {/* All Offers Grid */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-4 sm:mb-6">All Available Offers</h2>

          {isLoading || !offers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <OfferCardSkeleton count={6} />
            </div>
          ) : regularOffers.length === 0 && featuredOffers.length === 0 ? (
            <Card className="text-center py-10 sm:py-12 border-[#E4E7EB]">
              <CardContent className="p-4 sm:p-6">
                <Tag className="w-12 h-12 sm:w-16 sm:h-16 text-[#7C7C7C]/30 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-[#1E1E1E] mb-2">No offers available</h3>
                <p className="text-sm sm:text-base text-[#7C7C7C]">Check back soon for new deals!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {regularOffers.map((offer) => (
                <Card
                  key={offer.id}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-[#E4E7EB] shadow-lg overflow-hidden group"
                >
                  {/* Discount Banner */}
                  <div className="h-32 sm:h-40 bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800')] opacity-20 bg-cover" />
                    <div className="relative text-center text-white z-10">
                      <p className="text-4xl sm:text-5xl font-bold">{offer.discount_percentage}%</p>
                      <p className="text-base sm:text-lg font-semibold">OFF</p>
                    </div>
                  </div>

                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg group-hover:text-[#6C4DE6] transition-colors line-clamp-2">
                      {offer.title}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-[#7C7C7C] truncate">by {offer.business_name}</p>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6 pt-0">
                    <p className="text-[#7C7C7C] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {offer.description}
                    </p>

                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm text-[#7C7C7C]">
                      {formatDate(offer.valid_until) && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                          <span className="truncate">Valid until {formatDate(offer.valid_until)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Percent className="w-3 h-3 sm:w-4 sm:h-4 text-[#318FFD] flex-shrink-0" />
                        <span>{offer.redemptions || 0} redeemed</span>
                      </div>
                    </div>

                    {!isMyOffer(offer) ? (
                      <Button
                        className="w-full bg-[#08B150] hover:bg-[#06893f] text-white text-xs sm:text-sm"
                        onClick={() => handleClaimOffer(offer)}
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Claim Offer
                      </Button>
                    ) : (
                      <Badge className="w-full justify-center bg-[#6C4DE6] text-white py-2 sm:py-3 text-xs sm:text-sm">
                        Your Offer
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      <OfferClaimModal
        offer={selectedOffer}
        open={claimModalOpen}
        onClose={() => {
          setClaimModalOpen(false);
          setSelectedOffer(null);
        }}
        onClaimSuccess={() => {
          // Refetch offers to update redemption counts
          refetch();
        }}
      />
    </div>
  );
}