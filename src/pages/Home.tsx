
import { pb } from "@/api/pocketbaseClient";
import { businessService } from "@/api/services/businessService";
import { fintechProductService } from "@/api/services/fintechProductService";
import { offerService } from "@/api/services/offerService";
import { opportunityService } from "@/api/services/opportunityService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Sparkles,
  Star,
  Tag,
  Target,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MilestoneMarker from "../components/MilestoneMarker";
import OfferClaimModal from "../components/OfferClaimModal";
import OnboardingModal from "../components/OnboardingModal";
import ParallaxSection from "../components/ParallaxSection";
import ScrollReveal from "../components/ScrollReveal";
import EnrollmentModal from "../components/marketplace/EnrollmentModal";
import ProductCard from "../components/marketplace/ProductCard";
import ProductModal from "../components/marketplace/ProductModal";

export default function Home() {
  // Authentication is now handled by Layout component

  const [currentOfferSlide, setCurrentOfferSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const carouselRef = useRef<HTMLElement | null>(null);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses-trending'],
    queryFn: () => businessService.filter({}, '-created', 6),
    initialData: [],
  });

  const { data: opportunities = [] } = useQuery({
    queryKey: ['opportunities-recent'],
    queryFn: async () => {
      // Try to get open opportunities first
      let result = await opportunityService.filter({ status: 'open' }, '-created', 4);

      // If no open opportunities, get the latest ones regardless of status
      if (result.length === 0) {
        console.log('No open opportunities found, fetching latest opportunities...');
        result = await opportunityService.list('-created');
        result = result.slice(0, 4); // Limit to 4
      }

      console.log('Home page - opportunities fetched:', result.length, result);
      return result;
    },
    initialData: [],
  });

  const { data: offers = [] } = useQuery({
    queryKey: ['offers-featured'],
    queryFn: () => offerService.filter({ is_featured: true }, '-created', 5),
    initialData: [],
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['fintech-products-all'],
    queryFn: () => fintechProductService.list("-enrollments"),
    initialData: [],
  });

  const displayedProducts = allProducts
    .filter((p: any) => p.is_active !== false)
    .slice(0, 12);


  // Get real counts from database
  const { data: businessCount = 0 } = useQuery({
    queryKey: ['stats-business-count'],
    queryFn: async () => {
      const result = await businessService.searchWithFilters({ page: 1, perPage: 1 });
      return result.totalItems;
    },
  });

  const { data: opportunityCount = 0 } = useQuery({
    queryKey: ['stats-opportunity-count'],
    queryFn: async () => {
      const records = await pb.collection('opportunities').getList(1, 1, {
        filter: 'status="open"'
      });
      return records.totalItems;
    },
  });

  const { data: offerCount = 0 } = useQuery({
    queryKey: ['stats-offer-count'],
    queryFn: async () => {
      const records = await pb.collection('offers').getList(1, 1);
      return records.totalItems;
    },
  });

  const { data: connectionCount = 0 } = useQuery({
    queryKey: ['stats-connection-count'],
    queryFn: async () => {
      const records = await pb.collection('connections').getList(1, 1, {
        filter: 'status="accepted"'
      });
      return records.totalItems;
    },
  });

  // Auto-advance carousel (time-based)
  useEffect(() => {
    if (offers.length <= 1 || isCarouselPaused) return;

    const interval = setInterval(() => {
      setCurrentOfferSlide((prev) => (prev + 1) % offers.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [offers.length, isCarouselPaused]);

  // Scroll-based carousel navigation
  useEffect(() => {
    if (offers.length <= 1) return;

    const handleScroll = () => {
      if (!carouselRef.current) return;

      const rect = carouselRef.current.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (!isInView) return;

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Only trigger if scroll is significant (more than 50px)
      if (Math.abs(scrollDelta) > 50) {
        // Clear any existing timeout
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }

        // Debounce scroll events
        scrollTimeout.current = setTimeout(() => {
          if (scrollDelta > 0) {
            // Scrolling down - next slide
            setCurrentOfferSlide((prev) => (prev + 1) % offers.length);
          } else {
            // Scrolling up - previous slide
            setCurrentOfferSlide((prev) => (prev - 1 + offers.length) % offers.length);
          }
          lastScrollY.current = currentScrollY;
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [offers.length]);

  const stats = [
    { label: "Active Businesses", value: businessCount.toLocaleString(), icon: Users, gradient: "from-blue-500 to-cyan-500" },
    { label: "Open Opportunities", value: opportunityCount.toLocaleString(), icon: Briefcase, gradient: "from-purple-500 to-pink-500" },
    { label: "Active Offers", value: offerCount.toLocaleString(), icon: Tag, gradient: "from-[#FB6542] to-red-500" },
    { label: "Total Connections", value: connectionCount.toLocaleString(), icon: Users, gradient: "from-green-500 to-emerald-500" },
  ];

  const { data: profileCompletionData } = useQuery({
    queryKey: ['profile-completion'],
    queryFn: async () => {
      const { getProfileCompletionData, calculateProfileCompletion } = await import("@/utils/profileCompletion");
      const data = await getProfileCompletionData();
      return calculateProfileCompletion(data);
    },
    staleTime: 30000,
  });

  const profileCompletion = profileCompletionData?.percentage || 0;
  const isProfileIncomplete = profileCompletion < 100;

  const nextOffer = () => {
    setCurrentOfferSlide((prev) => (prev + 1) % offers.length);
  };

  const prevOffer = () => {
    setCurrentOfferSlide((prev) => (prev - 1 + offers.length) % offers.length);
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
    <div className="min-h-screen bg-[#F8F9FC] overflow-hidden">
      <OnboardingModal />

      {/* Hero Section with Parallax */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white"
      >
        {/* Background with Parallax */}
        <ParallaxSection speed={-0.5}>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600')] opacity-10 bg-cover bg-center" />
        </ParallaxSection>

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-[#6C4DE6]/10 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-[#318FFD]/10 blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge className="mb-4 bg-[#6C4DE6] text-white border-none">
                <Zap className="w-3 h-3 mr-1" />
                Where SMBs don't just connect, they grow, trade, and thrive
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Welcome back to <span className="bg-gradient-to-r from-[#6C4DE6] to-[#318FFD] bg-clip-text text-transparent">Zil Connect</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl mb-4 text-white/90"
            >
              Connect with verified businesses, discover opportunities, and grow your network.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg md:text-xl mb-8 text-white/80"
            >
              Find partners, explore deals, access business tools, and build trusted relationships that help your business thrive.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(108, 77, 230, 0.4)" }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" asChild className="bg-[#6C4DE6] text-white hover:bg-[#593CC9] transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Link to={createPageUrl("Opportunities")}>
                    Explore Opportunities <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Profile Completion Alert */}
      {isProfileIncomplete && profileCompletionData && (
        <ScrollReveal delay={0.2}>
          <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
            <Alert className="border-[#318FFD] bg-white shadow-xl">
              <AlertCircle className="h-5 w-5 text-[#318FFD]" />
              <AlertDescription className="ml-2">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <span className="font-semibold text-[#1E1E1E]">Your profile is {profileCompletion}% complete.</span>
                    <span className="text-[#7C7C7C] ml-2">Complete it now to unlock more opportunities and boost your visibility!</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="sm" className="bg-[#6C4DE6] hover:bg-[#593CC9] transition-all duration-300">
                      <Link to={createPageUrl("Profile")}>
                        Complete Profile
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </AlertDescription>
            </Alert>
          </section>
        </ScrollReveal>
      )}

      {/* Stats Section with Milestone */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <Card className="border-none shadow-lg bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden">
                  {/* Shimmer Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />

                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <motion.h3
                      className="text-3xl font-bold text-[#1E1E1E] mb-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Featured Offers Carousel - Milestone Section */}
      {offers.length > 0 && (
        <section ref={carouselRef} className="max-w-7xl mx-auto px-6 py-12 scroll-smooth">
          <ScrollReveal>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#1E1E1E] mb-2 flex items-center gap-2">
                  <Sparkles className="w-8 h-8 text-[#6C4DE6]" />
                  Featured Offers
                </h2>
                <p className="text-[#7C7C7C]">Exclusive deals from our community • Scroll to explore</p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" asChild className="border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC] transition-all duration-300">
                  <Link to={createPageUrl("Offers")}>
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>

          <MilestoneMarker icon={Tag} gradient="from-[#FB6542] to-red-500">
            <div
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
              <Card className="border-none shadow-2xl overflow-hidden bg-white relative min-h-[500px]">
                {/* Scroll Hint Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    y: [0, 5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                >

                </motion.div>

                <div className="grid md:grid-cols-2 gap-0 h-full">
                  {/* Discount Side with Parallax */}
                  <ParallaxSection speed={0.3}>
                    <div className="relative h-full min-h-[500px] bg-gradient-to-br from-[#6C4DE6] via-[#7E57C2] to-[#A37FFB] flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200')] opacity-20 bg-cover bg-center" />

                      {/* Animated Circle Background */}
                      <motion.div
                        key={`circle-${currentOfferSlide}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0.1 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-64 h-64 rounded-full bg-white" />
                      </motion.div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentOfferSlide}
                          className="relative text-center text-white z-10"
                          initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                          exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                        >
                          <motion.p
                            className="text-8xl font-bold mb-2"
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            {offers[currentOfferSlide]?.discount_percentage}%
                          </motion.p>
                          <motion.p
                            className="text-3xl font-semibold"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            OFF
                          </motion.p>
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Badge className="mt-4 bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                              Limited Time
                            </Badge>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </ParallaxSection>

                  {/* Content Side */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`content-${currentOfferSlide}`}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="p-8 md:p-12 flex flex-col justify-center"
                    >
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Badge className="w-fit mb-4 bg-[#6C4DE6] text-white border-none">
                          Featured Offer
                        </Badge>
                      </motion.div>
                      <motion.h3
                        className="text-3xl font-bold text-[#1E1E1E] mb-4"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {offers[currentOfferSlide]?.title}
                      </motion.h3>
                      <motion.p
                        className="text-[#7C7C7C] text-lg mb-6 line-clamp-4"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {offers[currentOfferSlide]?.description}
                      </motion.p>
                      <motion.div
                        className="space-y-3 mb-6"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center gap-2 text-[#7C7C7C]">
                          <Tag className="w-5 h-5 text-[#318FFD]" />
                          <span>By {offers[currentOfferSlide]?.business_name}</span>
                        </div>
                        {formatDate(offers[currentOfferSlide]?.valid_until) && (
                          <div className="flex items-center gap-2 text-[#7C7C7C]">
                            <Calendar className="w-5 h-5 text-[#318FFD]" />
                            <span>Valid until {formatDate(offers[currentOfferSlide]?.valid_until)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-[#7C7C7C]">
                            <Eye className="w-5 h-5 text-[#318FFD]" />
                            <span>{offers[currentOfferSlide]?.views || 0} views</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#7C7C7C]">
                            <Heart className="w-5 h-5 text-[#318FFD]" />
                            <span>{offers[currentOfferSlide]?.likes || 0} likes</span>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Button
                          size="lg"
                          className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                          onClick={() => handleClaimOffer(offers[currentOfferSlide])}
                        >
                          Claim This Offer
                        </Button>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Card>

              {/* Carousel Controls */}
              {offers.length > 1 && (
                <div className="mt-6 space-y-3">
                  {/* Progress Dots */}
                  <div className="flex justify-center gap-2">
                    {offers.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentOfferSlide(index)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative"
                      >
                        <div className={`h-2 rounded-full transition-all duration-300 ${index === currentOfferSlide
                          ? 'bg-[#6C4DE6] w-8'
                          : 'bg-gray-300 w-2'
                          }`} />
                        {/* Animated Progress Bar */}
                        {index === currentOfferSlide && !isCarouselPaused && (
                          <motion.div
                            className="absolute top-0 left-0 h-2 bg-[#08B150] rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear" }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Navigation Info */}
                  <div className="flex justify-center items-center gap-4">

                  </div>

                  {/* Previous/Next Buttons */}
                  <div className="flex justify-center gap-3">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevOffer}
                        className="rounded-full bg-white shadow-md hover:shadow-lg border-[#E4E7EB]"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextOffer}
                        className="rounded-full bg-white shadow-md hover:shadow-lg border-[#E4E7EB]"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </MilestoneMarker>
        </section>
      )}

      {/* Business Tools Marketplace Section */}
      {displayedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <ScrollReveal>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-4xl font-bold text-[#1E1E1E] mb-3">
                  Run Your Business Better
                </h2>
                <p className="text-xl text-[#7C7C7C]">
                  Powerful Tools for Your Operations
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" asChild className="border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC] transition-all duration-300">
                  <Link to={createPageUrl("FintechMarketplace")}>
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>

          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {displayedProducts.slice(0, 6).map((product: any, index: number) => (
              <div key={product.id} className="flex-shrink-0 w-80">
                <ScrollReveal delay={index * 0.05}>
                  <ProductCard
                    product={product}
                    onEnroll={(p) => {
                      setSelectedProduct(p);
                      setEnrollmentModalOpen(true);
                    }}
                    onView={(p) => {
                      setSelectedProduct(p);
                      setProductModalOpen(true);
                    }}
                  />
                </ScrollReveal>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Businesses - Milestone Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#1E1E1E] mb-2">Trending Businesses</h2>
              <p className="text-[#7C7C7C]">Top verified SMBs in your network</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" asChild className="border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC] transition-all duration-300">
                <Link to={createPageUrl("Marketplace")}>
                  View All <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </ScrollReveal>

        <MilestoneMarker icon={Users} gradient="from-blue-500 to-cyan-500">
          {businesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#7C7C7C]">No businesses found. Check your database connection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business, index) => (
                <ScrollReveal key={business.id} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -8 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  >
                    <Card className="hover:shadow-2xl transition-all duration-300 border-[#E4E7EB] shadow-lg bg-white group cursor-pointer overflow-hidden">
                      {/* Shimmer on Hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.8 }}
                      />

                      <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                              className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2] flex items-center justify-center text-white font-bold text-xl shadow-lg"
                            >
                              {(business.name || business.business_name || 'B')?.[0]?.toUpperCase() || 'B'}
                            </motion.div>
                            <div>
                              <CardTitle className="text-lg group-hover:text-[#6C4DE6] transition-colors duration-300">
                                {business.name || business.business_name || 'Business'}
                              </CardTitle>
                              <p className="text-sm text-[#7C7C7C]">{business.industry || 'N/A'}</p>
                            </div>
                          </div>
                          {(business.is_verified || business.verified) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                            >
                              <Badge className="bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20">
                                <Award className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            </motion.div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <p className="text-[#7C7C7C] text-sm mb-4 line-clamp-2">{business.tagline || business.description || 'No description available'}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-semibold">{business.trust_score || 0}/100</span>
                          </div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" asChild className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white transition-all duration-300">
                              <Link to={createPageUrl("BusinessDetails") + `?id=${business.id}`}>
                                View Profile <ArrowRight className="ml-1 w-3 h-3" />
                              </Link>
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </MilestoneMarker>
      </section>

      {/* Latest Opportunities */}
      <section className="bg-white py-16 border-t border-[#E4E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#1E1E1E] mb-2">Latest Opportunities</h2>
                <p className="text-[#7C7C7C]">Fresh deals and projects waiting for you</p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" asChild className="border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC] transition-all duration-300">
                  <Link to={createPageUrl("Opportunities")}>
                    View All <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>

          {opportunities.length === 0 ? (
            <Card className="text-center py-12 border-[#E4E7EB]">
              <CardContent>
                <Briefcase className="w-20 h-20 text-[#7C7C7C]/30 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">No Opportunities Available</h3>
                <p className="text-[#7C7C7C] mb-6">Check back later for new opportunities</p>
                <Button asChild className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white">
                  <Link to={createPageUrl("Opportunities")}>
                    Browse All Opportunities
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {opportunities.map((opp, index) => (
                <ScrollReveal key={opp.id} delay={index * 0.15} direction="left">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border-[#E4E7EB] shadow-lg cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge className="bg-[#7E57C2]/10 text-[#7E57C2] border-[#7E57C2]/20">
                            {opp.type}
                          </Badge>
                          <span className="text-xs text-[#7C7C7C]">
                            {opp.created ? new Date(opp.created).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <CardTitle className="text-xl text-[#1E1E1E] hover:text-[#6C4DE6] transition-colors">
                          {opp.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#7C7C7C] mb-4 line-clamp-2">{opp.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-[#7C7C7C]">
                            <span>📍 {opp.location || 'Remote'}</span>
                            <span>💰 {opp.budget || 'TBD'}</span>
                          </div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" asChild className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white">
                              <Link to={createPageUrl("OpportunityDetails") + `?id=${opp.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section with Parallax */}
      <ParallaxSection speed={0.5}>
        <section className="bg-gradient-to-r from-[#241C3A] to-[#3C2F63] text-white py-16 relative overflow-hidden">
          {/* Decorative Elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#6C4DE6]/10 blur-3xl"
          />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <ScrollReveal>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Target className="w-16 h-16 mx-auto mb-6 opacity-90" />
              </motion.div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Grow Your Business?
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of SMBs building credibility, finding partners, and closing deals.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Link to={createPageUrl("Profile")}>
                      Complete Your Profile
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 transition-all duration-300">
                    <Link to={createPageUrl("Search")}>
                      Find Partners
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ParallaxSection>

      {/* Offer Claim Modal */}
      <OfferClaimModal
        offer={selectedOffer}
        open={claimModalOpen}
        onClose={() => {
          setClaimModalOpen(false);
          setSelectedOffer(null);
        }}
        onClaimSuccess={() => {
          // Optionally refetch offers or show success message
        }}
      />

      {/* Product Modal */}
      <ProductModal
        open={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onEnroll={(product) => {
          setProductModalOpen(false);
          setSelectedProduct(product);
          setEnrollmentModalOpen(true);
        }}
      />

      {/* Enrollment Modal */}
      <EnrollmentModal
        open={enrollmentModalOpen}
        onClose={() => {
          setEnrollmentModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={() => {
          // Refetch products to update enrollment counts
        }}
      />
    </div>
  );
}
