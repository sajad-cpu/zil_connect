import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Calendar, Tag, Check, Loader2 } from "lucide-react";
import { pb } from "@/api/pocketbaseClient";
import { offerClaimService } from "@/api/services/offerClaimService";
import { useToast } from "@/components/ui/use-toast";

export default function OfferClaimModal({ offer, open, onClose, onClaimSuccess }: any) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [claimData, setClaimData] = useState<{ code: string; expiresAt: Date } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Process claim when modal opens
  useEffect(() => {
    if (open && offer && !claimData && !isProcessing) {
      processClaim();
    }

    // Reset state when modal closes
    if (!open) {
      setClaimData(null);
      setError("");
    }
  }, [open, offer]);

  if (!offer) return null;

  const processClaim = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        setError("You must be logged in to claim offers");
        setIsProcessing(false);
        return;
      }

      // Check if already claimed
      const alreadyClaimed = await offerClaimService.hasUserClaimed(userId, offer.id);
      if (alreadyClaimed) {
        setError("You've already claimed this offer!");
        setIsProcessing(false);
        return;
      }

      // Check if offer is expired
      if (offer.valid_until && new Date(offer.valid_until) < new Date()) {
        setError("This offer has expired!");
        setIsProcessing(false);
        return;
      }

      // Generate unique coupon code
      const claimCode = `ZIL${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Set expiration (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Create offer claim
      const claim = await offerClaimService.create({
        offer: offer.id,
        user: userId,
        claim_code: claimCode,
        status: 'claimed',
        expires_at: expiresAt.toISOString()
      });

      // Increment redemptions count
      await pb.collection('offers').update(offer.id, {
        redemptions: (offer.redemptions || 0) + 1
      });

      setClaimData({
        code: claimCode,
        expiresAt: expiresAt
      });

      // Call success callback
      if (onClaimSuccess) {
        onClaimSuccess();
      }

      toast({
        title: "Offer Claimed! 🎉",
        description: "Your coupon code has been generated successfully.",
      });

    } catch (error) {
      console.error("Error claiming offer:", error);
      setError("Failed to claim offer. Please try again.");
      toast({
        title: "Error",
        description: "Failed to claim offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (claimData?.code) {
      navigator.clipboard.writeText(claimData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setClaimData(null);
    setError("");
    onClose();
  };

  // Show processing state
  if (isProcessing) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg overflow-hidden p-0">
          <div className="p-12 text-center">
            <Loader2 className="w-16 h-16 text-[#6C4DE6] animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">Claiming Your Offer...</h3>
            <p className="text-[#7C7C7C]">Please wait while we generate your coupon code</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show error state
  if (error) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg overflow-hidden p-0">
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">Oops!</h3>
            <p className="text-[#7C7C7C] mb-6">{error}</p>
            <Button onClick={handleClose} className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show success state with claim data
  if (!claimData) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
                {claimData.code}
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
                    {claimData.expiresAt.toLocaleDateString()}
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
            <Button onClick={handleClose} className="flex-1 bg-[#6C4DE6] hover:bg-[#593CC9] text-white">
              Got It!
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC]"
              onClick={() => {
                handleClose();
                navigate('/MyClaimedOffers');
              }}
            >
              View My Offers
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}