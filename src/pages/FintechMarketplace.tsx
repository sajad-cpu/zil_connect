import { fintechProductService } from "@/api/services/fintechProductService";
import CategoryFilter from "@/components/marketplace/CategoryFilter";
import EnrollmentModal from "@/components/marketplace/EnrollmentModal";
import ProductCard from "@/components/marketplace/ProductCard";
import ProductModal from "@/components/marketplace/ProductModal";
import ScrollReveal from "@/components/ScrollReveal";
import { ProductCardSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Search,
  Sparkles
} from "lucide-react";
import { useRef, useState } from "react";

const categories = [
  {
    name: "Accounting Software",
    displayName: "Accounting & Finance Tools",
    icon: "📊"
  },
  {
    name: "Payment Processing",
    displayName: "Payment Solutions",
    icon: "💳"
  },
  {
    name: "Business Banking",
    displayName: "Banking Services",
    icon: "🏦"
  },
  {
    name: "Tax Software",
    displayName: "Tax & Compliance Solutions",
    icon: "📋"
  },
  {
    name: "Payroll Services",
    displayName: "Payroll & HR Tools",
    icon: "👥"
  },
  {
    name: "Invoicing Tools",
    displayName: "Invoicing & Billing",
    icon: "📄"
  },
  {
    name: "Expense Management",
    displayName: "Expense Management",
    icon: "💰"
  },
  {
    name: "Business Analytics",
    displayName: "Analytics & Reporting",
    icon: "📈"
  },
];

export default function FintechMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { data: allProducts = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['fintech-products-all'],
    queryFn: () => fintechProductService.list("-enrollments"),
    initialData: [],
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['fintech-products-filtered', selectedCategory],
    queryFn: () => {
      if (selectedCategory === "all") {
        return fintechProductService.list("-enrollments");
      } else {
        return fintechProductService.getByCategory(selectedCategory, "-enrollments");
      }
    },
    initialData: [],
  });

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['fintech-products-featured'],
    queryFn: () => fintechProductService.getFeatured(6),
    initialData: [],
  });

  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.name] = allProducts.filter(
      (p: any) => p.category === category.name && p.is_active !== false
    ).slice(0, 8);
    return acc;
  }, {} as Record<string, any[]>);

  const scrollCategory = (categoryName: string, direction: 'left' | 'right') => {
    const container = scrollRefs.current[categoryName];
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = !searchTerm ||
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.provider?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleProductView = (product: any) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleProductEnroll = (product: any) => {
    setSelectedProduct(product);
    setEnrollmentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-6 sm:py-8 md:py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3"
          >
            <CreditCard className="w-8 h-8 sm:w-10 sm:h-10" />
            Business Tools
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-white/90"
          >
            Discover essential business tools - Accounting, Payments, Banking & more
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ScrollReveal delay={0.2}>
          <Card className="mb-6 sm:mb-8 border-[#E4E7EB] shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7C7C7C] w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    type="text"
                    placeholder="Search products, providers..."
                    className="pl-9 sm:pl-10 h-10 sm:h-12 border-[#E4E7EB] text-sm sm:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {!searchTerm && selectedCategory === "all" ? (
          <>
            {isLoadingAll ? (
              <>
                {categories.slice(0, 3).map((category, categoryIndex) => (
                  <ScrollReveal key={category.name} delay={categoryIndex * 0.1}>
                    <div className="mb-8 sm:mb-12">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">
                          {category.displayName}
                        </h3>
                      </div>
                      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
                        <ProductCardSkeleton count={4} />
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </>
            ) : (
              categories.map((category, categoryIndex) => {
                const categoryProducts = productsByCategory[category.name] || [];
                if (categoryProducts.length === 0) return null;

                return (
                  <ScrollReveal key={category.name} delay={categoryIndex * 0.1}>
                    <div className="mb-8 sm:mb-12">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">
                          {category.displayName}
                        </h3>
                      </div>

                      <div className="relative group">
                        <div
                          ref={(el) => (scrollRefs.current[category.name] = el)}
                          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth -mx-4 sm:-mx-6 px-4 sm:px-6"
                          style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                          }}
                        >
                          {categoryProducts.map((product: any) => (
                            <div
                              key={product.id}
                              className="flex-shrink-0 w-[280px] sm:w-80"
                            >
                              <ProductCard
                                product={product}
                                onEnroll={handleProductEnroll}
                                onView={handleProductView}
                              />
                            </div>
                          ))}
                        </div>

                        {categoryProducts.length > 3 && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-gray-200 z-10 hidden group-hover:flex w-8 h-8 sm:w-10 sm:h-10"
                              onClick={() => scrollCategory(category.name, 'left')}
                            >
                              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-gray-200 z-10 hidden group-hover:flex w-8 h-8 sm:w-10 sm:h-10"
                              onClick={() => scrollCategory(category.name, 'right')}
                            >
                              <ChevronRight className="w-5 h-5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })
            )}
          </>
        ) : (
          <>
            {featuredProducts.length > 0 && !searchTerm && (
              <ScrollReveal>
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-[#6C4DE6]" />
                    <h2 className="text-2xl font-bold text-[#1E1E1E]">Featured Products</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProducts.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onEnroll={handleProductEnroll}
                        onView={handleProductView}
                      />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center justify-between mb-6"
            >
              <p className="text-[#7C7C7C]">
                <span className="font-semibold text-[#1E1E1E]">{filteredProducts.length}</span> products found
              </p>

            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCardSkeleton count={6} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="text-center py-12 border-[#E4E7EB]">
                  <CardContent>
                    <CreditCard className="w-16 h-16 text-[#7C7C7C]/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">No products found</h3>
                    <p className="text-[#7C7C7C] mb-6">Try adjusting your search or filters</p>
                    <Button
                      onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
                      className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product: any, index: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard
                      product={product}
                      onEnroll={handleProductEnroll}
                      onView={handleProductView}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

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

