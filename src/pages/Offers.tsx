import React, { useState } from "react";
import { offerService } from "@/api/services/offerService";
import { useQuery } from "@tanstack/react-query";
import { pb } from "@/api/pocketbaseClient";
import {
  Tag,
  TrendingUp,
  Percent,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import OfferClaimModal from "../components/OfferClaimModal";

export default function Offers() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const currentUserId = pb.authStore.model?.id;

  const { data: offers = [], isLoading, refetch } = useQuery({
    queryKey: ['offers-all'],
    queryFn: () => offerService.list('-created'),
    initialData: [],
  });

  const featuredOffers = offers.filter(o => o.is_featured).slice(0, 5);
  const regularOffers = offers.filter(o => !o.is_featured);

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

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return format(date, 'MMM d, yyyy');
    } catch {
      return null;
    }
  };

  const handleClaimOffer = (offer) => {
    setSelectedOffer(offer);
    setClaimModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <Tag className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Exclusive Offers</h1>
          </div>
          <p className="text-xl text-white/90">Special deals and discounts from our business community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Featured Offers Carousel */}
        {featuredOffers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">🔥 Featured Offers</h2>
            <div className="relative">
              <Card className="border-[#E4E7EB] shadow-2xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image/Discount Side */}
                  <div className="relative h-96 bg-gradient-to-br from-[#6C4DE6] via-[#7E57C2] to-[#593CC9] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200')] opacity-20 bg-cover bg-center" />
                    <div className="relative text-center text-white z-10">
                      <p className="text-8xl font-bold mb-2">{featuredOffers[currentSlide]?.discount_percentage}%</p>
                      <p className="text-3xl font-semibold">OFF</p>
                      <Badge className="mt-4 bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                        Limited Time
                      </Badge>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                    <Badge className="w-fit mb-4 bg-[#6C4DE6]/10 text-[#6C4DE6] border-[#6C4DE6]/20">
                      Featured Offer
                    </Badge>
                    <h3 className="text-3xl font-bold text-[#1E1E1E] mb-4">
                      {featuredOffers[currentSlide]?.title}
                    </h3>
                    <p className="text-[#7C7C7C] text-lg mb-6">
                      {featuredOffers[currentSlide]?.description}
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-[#7C7C7C]">
                        <Tag className="w-5 h-5 text-[#318FFD]" />
                        <span>By {featuredOffers[currentSlide]?.business_name}</span>
                      </div>
                      {formatDate(featuredOffers[currentSlide]?.valid_until) && (
                        <div className="flex items-center gap-2 text-[#7C7C7C]">
                          <Clock className="w-5 h-5 text-[#318FFD]" />
                          <span>Valid until {formatDate(featuredOffers[currentSlide]?.valid_until)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[#7C7C7C]">
                        <TrendingUp className="w-5 h-5 text-[#318FFD]" />
                        <span>{featuredOffers[currentSlide]?.redemptions || 0} businesses redeemed</span>
                      </div>
                    </div>
                    {!isMyOffer(featuredOffers[currentSlide]) ? (
                      <Button
                        size="lg"
                        className="bg-[#08B150] hover:bg-[#06893f] text-white shadow-lg"
                        onClick={() => handleClaimOffer(featuredOffers[currentSlide])}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Claim This Offer
                      </Button>
                    ) : (
                      <Badge className="bg-[#6C4DE6] text-white px-6 py-3 text-base">
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-lg hover:shadow-xl border-[#E4E7EB]"
                    onClick={prevSlide}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-lg hover:shadow-xl border-[#E4E7EB]"
                    onClick={nextSlide}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>

                  {/* Dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {featuredOffers.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentSlide ? 'bg-[#6C4DE6] w-8' : 'bg-[#E4E7EB]'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* All Offers Grid */}
        <div>
          <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">All Available Offers</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse border-[#E4E7EB]">
                  <div className="h-48 bg-gray-200" />
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : regularOffers.length === 0 ? (
            <Card className="text-center py-12 border-[#E4E7EB]">
              <CardContent>
                <Tag className="w-16 h-16 text-[#7C7C7C]/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">No offers available</h3>
                <p className="text-[#7C7C7C]">Check back soon for new deals!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularOffers.map((offer) => (
                <Card
                  key={offer.id}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-[#E4E7EB] shadow-lg overflow-hidden group"
                >
                  {/* Discount Banner */}
                  <div className="h-40 bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800')] opacity-20 bg-cover" />
                    <div className="relative text-center text-white z-10">
                      <p className="text-5xl font-bold">{offer.discount_percentage}%</p>
                      <p className="text-lg font-semibold">OFF</p>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-[#6C4DE6] transition-colors">
                      {offer.title}
                    </CardTitle>
                    <p className="text-sm text-[#7C7C7C]">by {offer.business_name}</p>
                  </CardHeader>

                  <CardContent>
                    <p className="text-[#7C7C7C] text-sm mb-4 line-clamp-2">
                      {offer.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm text-[#7C7C7C]">
                      {formatDate(offer.valid_until) && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#318FFD]" />
                          <span>Valid until {formatDate(offer.valid_until)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-[#318FFD]" />
                        <span>{offer.redemptions || 0} redeemed</span>
                      </div>
                    </div>

                    {!isMyOffer(offer) ? (
                      <Button
                        className="w-full bg-[#08B150] hover:bg-[#06893f] text-white"
                        onClick={() => handleClaimOffer(offer)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Claim Offer
                      </Button>
                    ) : (
                      <Badge className="w-full justify-center bg-[#6C4DE6] text-white py-3">
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