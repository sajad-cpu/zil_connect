import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  GraduationCap,
  BookOpen,
  Video,
  Clock,
  Users,
  Heart,
  Star,
  Search,
  TrendingUp,
  DollarSign,
  Briefcase,
  Target,
  ChevronRight,
  ChevronLeft,
  Play
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Knowledge() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [featuredSlide, setFeaturedSlide] = useState(0);

  // Mock course data
  const courses = [
    {
      id: 1,
      title: "Funding Your Business",
      category: "Finance",
      duration: "2h 30m",
      difficulty: "Beginner",
      enrolled: 1240,
      likes: 456,
      rating: 4.8,
      modules: 8,
      description: "Learn about funding options, investor pitches, and financial planning for your business",
      instructor: "Dr. Sarah Chen",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
      isFeatured: true,
      progress: 0
    },
    {
      id: 2,
      title: "Scaling Your SMB",
      category: "Growth",
      duration: "3h 15m",
      difficulty: "Intermediate",
      enrolled: 2150,
      likes: 892,
      rating: 4.9,
      modules: 12,
      description: "Strategic approaches to sustainable business growth and expansion",
      instructor: "Michael Rodriguez",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      isFeatured: true,
      progress: 0
    },
    {
      id: 3,
      title: "Export Compliance",
      category: "Legal",
      duration: "2h 45m",
      difficulty: "Advanced",
      enrolled: 856,
      likes: 234,
      rating: 4.6,
      modules: 15,
      description: "Navigate international trade regulations and compliance requirements",
      instructor: "Jessica Williams",
      thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
      isFeatured: true,
      progress: 0
    },
    {
      id: 4,
      title: "Cross-Border Trading",
      category: "International",
      duration: "1h 50m",
      difficulty: "Intermediate",
      enrolled: 1580,
      likes: 623,
      rating: 4.7,
      modules: 10,
      description: "Expand globally with confidence and best practices",
      instructor: "David Park",
      thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
      isFeatured: false,
      progress: 0
    },
    {
      id: 5,
      title: "Building Strong Partnerships",
      category: "Networking",
      duration: "1h 30m",
      difficulty: "Beginner",
      enrolled: 3200,
      likes: 1456,
      rating: 4.9,
      modules: 6,
      description: "Create and maintain valuable business relationships",
      instructor: "Emma Thompson",
      thumbnail: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
      isFeatured: false,
      progress: 0
    },
    {
      id: 6,
      title: "Digital Marketing Essentials",
      category: "Marketing",
      duration: "2h 20m",
      difficulty: "Beginner",
      enrolled: 2890,
      likes: 1024,
      rating: 4.8,
      modules: 9,
      description: "Master digital marketing strategies for small businesses",
      instructor: "Alex Martinez",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      isFeatured: false,
      progress: 0
    },
  ];

  const categories = [
    { name: "All", icon: BookOpen },
    { name: "Finance", icon: DollarSign },
    { name: "Growth", icon: TrendingUp },
    { name: "Marketing", icon: Target },
    { name: "Legal", icon: Briefcase },
    { name: "Networking", icon: Users },
  ];

  const featuredCourses = courses.filter(c => c.isFeatured);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    const colors = {
      "Beginner": "bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20",
      "Intermediate": "bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20",
      "Advanced": "bg-[#6C4DE6]/10 text-[#6C4DE6] border-[#6C4DE6]/20"
    };
    return colors[difficulty] || colors.Beginner;
  };

  const nextFeatured = () => {
    setFeaturedSlide((prev) => (prev + 1) % featuredCourses.length);
  };

  const prevFeatured = () => {
    setFeaturedSlide((prev) => (prev - 1 + featuredCourses.length) % featuredCourses.length);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#241C3A] via-[#3C2F63] to-[#241C3A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Knowledge Hub</h1>
          </div>
          <p className="text-xl text-white/90">Grow your business skills with curated courses</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7C7C7C] w-5 h-5" />
            <Input
              type="text"
              placeholder="Search courses by title or topic..."
              className="pl-12 h-12 border-[#E4E7EB] rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.name
                    ? 'bg-[#6C4DE6] text-white shadow-md'
                    : 'bg-white text-[#1E1E1E] border border-[#E4E7EB] hover:border-[#6C4DE6] hover:text-[#6C4DE6]'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Courses Carousel */}
        {featuredCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">⭐ Featured Courses</h2>
            <div className="relative">
              <Card className="border-[#E4E7EB] shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Side */}
                  <div className="relative h-96 overflow-hidden">
                    <img 
                      src={featuredCourses[featuredSlide]?.thumbnail} 
                      alt={featuredCourses[featuredSlide]?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <Badge className="bg-[#08B150] text-white border-none mb-3">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {featuredCourses[featuredSlide]?.rating} Rating
                      </Badge>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                    <Badge className="w-fit mb-4 bg-[#7E57C2]/10 text-[#7E57C2] border-[#7E57C2]/20">
                      {featuredCourses[featuredSlide]?.category}
                    </Badge>
                    <h3 className="text-3xl font-bold text-[#1E1E1E] mb-4">
                      {featuredCourses[featuredSlide]?.title}
                    </h3>
                    <p className="text-[#7C7C7C] text-lg mb-6">
                      {featuredCourses[featuredSlide]?.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-[#7C7C7C]">
                        <Clock className="w-4 h-4 text-[#318FFD]" />
                        <span>{featuredCourses[featuredSlide]?.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#7C7C7C]">
                        <Users className="w-4 h-4 text-[#318FFD]" />
                        <span>{(featuredCourses[featuredSlide]?.enrolled / 1000).toFixed(1)}k Enrolled</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#7C7C7C]">
                        <BookOpen className="w-4 h-4 text-[#318FFD]" />
                        <span>{featuredCourses[featuredSlide]?.modules} Modules</span>
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      asChild
                      className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                    >
                      <Link to={createPageUrl("CourseDetails") + `?id=${featuredCourses[featuredSlide]?.id}`}>
                        <Play className="w-5 h-5 mr-2" />
                        Start Learning
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Carousel Controls */}
              {featuredCourses.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-lg border-[#E4E7EB]"
                    onClick={prevFeatured}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white shadow-lg border-[#E4E7EB]"
                    onClick={nextFeatured}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>

                  <div className="flex justify-center gap-2 mt-4">
                    {featuredCourses.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setFeaturedSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === featuredSlide ? 'bg-[#6C4DE6] w-8' : 'bg-[#E4E7EB]'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* All Courses Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1E1E1E]">All Courses</h2>
            <p className="text-[#7C7C7C]">
              <span className="font-semibold text-[#1E1E1E]">{filteredCourses.length}</span> courses available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-[#E4E7EB] shadow-lg overflow-hidden group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                    <Badge className="bg-white/90 text-[#1E1E1E] border-none">
                      <Clock className="w-3 h-3 mr-1" />
                      {course.duration}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <Badge className="w-fit mb-2 bg-[#7E57C2]/10 text-[#7E57C2] border-[#7E57C2]/20 text-xs">
                    {course.category}
                  </Badge>
                  <CardTitle className="text-lg group-hover:text-[#6C4DE6] transition-colors line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-[#7C7C7C]">by {course.instructor}</p>
                </CardHeader>

                <CardContent>
                  <p className="text-[#7C7C7C] text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E4E7EB]">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="w-4 h-4 text-[#318FFD]" />
                      <span className="text-[#7C7C7C]">{(course.enrolled / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-[#7C7C7C]">{course.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="font-semibold text-[#1E1E1E]">{course.rating}</span>
                    </div>
                  </div>

                  <Button 
                    asChild
                    className="w-full bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                  >
                    <Link to={createPageUrl("CourseDetails") + `?id=${course.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Learning
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <Card className="text-center py-12 border-[#E4E7EB]">
              <CardContent>
                <BookOpen className="w-16 h-16 text-[#7C7C7C]/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">No courses found</h3>
                <p className="text-[#7C7C7C] mb-6">Try adjusting your search or filters</p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}