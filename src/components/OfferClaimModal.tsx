import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, Calendar, Tag, Check } from "lucide-react";

export default function OfferClaimModal({ offer, open, onClose }) {
  const [copied, setCopied] = useState(false);
  
  if (!offer) return null;

  const offerCode = `ZIL${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);

  const handleCopy = () => {
    navigator.clipboard.writeText(offerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg overflow-hidden p-0">
        {/* Success Animation Header */}
        <div className="bg-gradient-to-br from-[#08B150] to-[#06893f] text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-[#08B150]" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Offer Successfully Claimed!</h2>
            <p className="text-white/90 text-lg">You're all set to enjoy this exclusive deal</p>
          </div>
        </div>

        {/* Offer Details */}
        <div className="p-6 space-y-6">
          {/* Discount Badge */}
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-[#6C4DE6] to-[#7E57C2] text-white px-8 py-4 rounded-2xl shadow-lg">
              <p className="text-5xl font-bold">{offer.discount_percentage}%</p>
              <p className="text-lg font-semibold">OFF</p>
            </div>
          </div>

          {/* Offer Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-[#1E1E1E] mb-2">{offer.title}</h3>
              <p className="text-[#7C7C7C]">{offer.description}</p>
            </div>

            {/* Code Section */}
            <div className="bg-[#F8F9FC] border-2 border-dashed border-[#6C4DE6] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#7C7C7C]">Your Offer Code</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="text-[#6C4DE6] hover:text-[#593CC9] hover:bg-[#6C4DE6]/10"
                >
                  {copied ? (
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
              <div className="font-mono text-2xl font-bold text-[#1E1E1E] tracking-wider text-center py-2">
                {offerCode}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E7EB]">
                <Tag className="w-5 h-5 text-[#318FFD] mt-0.5" />
                <div>
                  <p className="text-xs text-[#7C7C7C] mb-1">Business</p>
                  <p className="font-semibold text-[#1E1E1E] text-sm">{offer.business_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E7EB]">
                <Calendar className="w-5 h-5 text-[#318FFD] mt-0.5" />
                <div>
                  <p className="text-xs text-[#7C7C7C] mb-1">Expires On</p>
                  <p className="font-semibold text-[#1E1E1E] text-sm">
                    {expirationDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Terms */}
            {offer.terms && (
              <div className="bg-[#F8F9FC] rounded-lg p-4 border border-[#E4E7EB]">
                <p className="text-xs font-semibold text-[#1E1E1E] mb-2">Terms & Conditions</p>
                <p className="text-xs text-[#7C7C7C] leading-relaxed">{offer.terms}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-[#318FFD]/10 rounded-lg p-4 border border-[#318FFD]/20">
              <p className="text-sm text-[#1E1E1E]">
                <strong>How to use:</strong> Present this code at checkout or contact {offer.business_name} directly to redeem your discount.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={onClose} className="flex-1 bg-[#6C4DE6] hover:bg-[#593CC9] text-white">
              Got It!
            </Button>
            <Button variant="outline" className="flex-1 border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC]">
              View My Offers
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}