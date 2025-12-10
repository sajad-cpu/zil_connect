import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#241C3A] via-[#3C2F63] to-[#241C3A] flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-20 h-20 bg-[#6C4DE6] rounded-2xl flex items-center justify-center shadow-2xl"
      >
        <Sparkles className="w-10 h-10 text-white" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white text-lg mt-6 font-medium"
      >
        Loading...
      </motion.p>
    </div>
  );
}
