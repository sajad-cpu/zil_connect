import { fintechProductService } from "@/api/services/fintechProductService";
import CategoryFilter from "@/components/marketplace/CategoryFilter";
import EnrollmentModal from "@/components/marketplace/EnrollmentModal";
import ProductCard from "@/components/marketplace/ProductCard";
import ProductModal from "@/components/marketplace/ProductModal";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Filter,
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
  const [sortBy, setSortBy] = useState("-enrollments");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { data: allProducts = [] } = useQuery({
    queryKey: ['fintech-products-all'],
    queryFn: () => fintechProductService.list("-enrollments"),
    initialData: [],
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['fintech-products-filtered', selectedCategory, sortBy],
    queryFn: () => {
      if (selectedCategory === "all") {
        return fintechProductService.list(sortBy);
      } else {
        return fintechProductService.getByCategory(selectedCategory, sortBy);
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
        className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mb-3 flex items-center gap-3"
          >
            <CreditCard className="w-10 h-10" />
            Fintech Marketplace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl text-white/90"
          >
            Discover essential fintech tools for your business - Accounting, Payments, Banking & more
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!searchTerm && selectedCategory === "all" ? (
          <>
            <ScrollReveal>
              <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold text-[#1E1E1E] mb-3">
                  Run Your Business Better
                </h2>
                <p className="text-xl text-[#7C7C7C]">
                  Powerful Tools for Your Operations
                </p>
              </div>
            </ScrollReveal>

            {categories.map((category, categoryIndex) => {
              const categoryProducts = productsByCategory[category.name] || [];
              if (categoryProducts.length === 0) return null;

              return (
                <ScrollReveal key={category.name} delay={categoryIndex * 0.1}>
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-[#1E1E1E]">
                        {category.displayName}
                      </h3>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedCategory(category.name)}
                        className="text-[#6C4DE6] hover:text-[#593CC9] hover:bg-[#6C4DE6]/10"
                      >
                        View All <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>

                    <div className="relative group">
                      <div
                        ref={(el) => (scrollRefs.current[category.name] = el)}
                        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                        style={{
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                        }}
                      >
                        {categoryProducts.map((product: any) => (
                          <div
                            key={product.id}
                            className="flex-shrink-0 w-80"
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
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-gray-200 z-10 hidden group-hover:flex"
                            onClick={() => scrollCategory(category.name, 'left')}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-gray-200 z-10 hidden group-hover:flex"
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
            })}
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

            <ScrollReveal delay={0.2}>
              <Card className="mb-8 border-[#E4E7EB] shadow-lg">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7C7C7C] w-5 h-5" />
                        <Input
                          type="text"
                          placeholder="Search products, providers..."
                          className="pl-10 h-12 border-[#E4E7EB]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-12 border-[#E4E7EB]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-enrollments">Most Popular</SelectItem>
                        <SelectItem value="-created">Newest</SelectItem>
                        <SelectItem value="created">Oldest</SelectItem>
                        <SelectItem value="name">A-Z</SelectItem>
                        <SelectItem value="-name">Z-A</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-12 border-[#E4E7EB]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-4">
                    <CategoryFilter
                      selectedCategory={selectedCategory}
                      onCategoryChange={setSelectedCategory}
                    />
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

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
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="animate-pulse border-[#E4E7EB]">
                      <CardContent className="p-6">
                        <div className="h-16 bg-gray-200 rounded-lg mb-4" />
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-20 bg-gray-200 rounded" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
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

