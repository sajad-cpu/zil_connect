import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Info } from "lucide-react";

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the onboarding modal
    const hasSeenOnboarding = localStorage.getItem("zilconnect_onboarding_seen");
    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem("zilconnect_onboarding_seen", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-[#00246B] to-[#FB6542] rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl text-center text-[#00246B]">
            Welcome to Zil Business Nexus!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 text-base pt-4">
            We use some non-confidential data to show information about your business to others. 
            This helps you gain more connections and visibility in our business community.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Your Privacy Matters</p>
            <p>No sensitive financial data is ever shared publicly. You have full control over your profile visibility.</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Learn More
          </Button>
          <Button
            onClick={handleAgree}
            className="w-full sm:w-auto bg-[#FB6542] hover:bg-[#e5573a] text-white"
          >
            Agree and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}