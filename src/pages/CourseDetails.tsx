import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  GraduationCap,
  BookOpen,
  Clock,
  Users,
  Heart,
  Star,
  Play,
  CheckCircle,
  Lock,
  ArrowLeft,
  Award,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function CourseDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [liked, setLiked] = useState(false);

  // Mock course data - in real app, fetch based on courseId
  const course = {
    id: 1,
    title: "Funding Your Business",
    category: "Finance",
    duration: "2h 30m",
    difficulty: "Beginner",
    enrolled: 1240,
    likes: 456,
    rating: 4.8,
    reviews: 234,
    description: "This comprehensive course will guide you through the various funding options available for your business. Learn how to create compelling investor pitches, understand financial planning, and make informed decisions about your business's financial future. Perfect for entrepreneurs looking to scale their operations or secure initial funding.",
    instructor: {
      name: "Dr. Sarah Chen",
      title: "Financial Strategist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
    },
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200",
    learningOutcomes: [
      "Understand different types of business funding options",
      "Create effective investor pitch decks",
      "Develop comprehensive financial plans",
      "Navigate the funding application process",
      "Manage investor relationships effectively"
    ],
    modules: [
      { id: 1, title: "Introduction to Business Funding", duration: "15m", isLocked: false, completed: false },
      { id: 2, title: "Types of Funding Sources", duration: "25m", isLocked: false, completed: false },
      { id: 3, title: "Creating Your Pitch Deck", duration: "30m", isLocked: !isEnrolled, completed: false },
      { id: 4, title: "Financial Projections", duration: "20m", isLocked: !isEnrolled, completed: false },
      { id: 5, title: "Approaching Investors", duration: "25m", isLocked: !isEnrolled, completed: false },
      { id: 6, title: "Due Diligence Process", duration: "20m", isLocked: !isEnrolled, completed: false },
      { id: 7, title: "Negotiating Terms", duration: "15m", isLocked: !isEnrolled, completed: false },
      { id: 8, title: "Post-Funding Management", duration: "20m", isLocked: !isEnrolled, completed: false },
    ],
    progress: 0
  };

  const completedModules = course.modules.filter(m => m.completed).length;
  const totalModules = course.modules.length;
  const progressPercentage = (completedModules / totalModules) * 100;

  const handleEnroll = () => {
    setIsEnrolled(true);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      "Beginner": "bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20",
      "Intermediate": "bg-[#318FFD]/10 text-[#318FFD] border-[#318FFD]/20",
      "Advanced": "bg-[#6C4DE6]/10 text-[#6C4DE6] border-[#6C4DE6]/20"
    };
    return colors[difficulty] || colors.Beginner;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Back Button */}
      <div className="bg-white border-b border-[#E4E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button variant="ghost" asChild className="text-[#1E1E1E] hover:bg-[#F8F9FC]">
            <Link to={createPageUrl("Knowledge")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Knowledge Hub
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 py-12 w-full">
            <Badge className="mb-4 bg-[#7E57C2] text-white border-none">
              {course.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-current" />
                <span className="font-semibold">{course.rating}</span>
                <span>({course.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{(course.enrolled / 1000).toFixed(1)}k enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{course.duration}</span>
              </div>
              <Badge className={getDifficultyColor(course.difficulty)}>
                {course.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Course */}
            <Card className="border-[#E4E7EB] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1E1E1E]">About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#7C7C7C] leading-relaxed mb-6">
                  {course.description}
                </p>
                
                <h3 className="font-semibold text-[#1E1E1E] mb-3">What You'll Learn</h3>
                <ul className="space-y-2">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#08B150] mt-0.5 flex-shrink-0" />
                      <span className="text-[#7C7C7C]">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card className="border-[#E4E7EB] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1E1E1E]">Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <img 
                    src={course.instructor.avatar} 
                    alt={course.instructor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-[#1E1E1E] mb-1">{course.instructor.name}</h3>
                    <p className="text-[#7C7C7C] mb-2">{course.instructor.title}</p>
                    <div className="flex items-center gap-4 text-sm text-[#7C7C7C]">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4 text-[#318FFD]" />
                        <span>15+ Courses</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-[#318FFD]" />
                        <span>12.5k Students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Modules */}
            <Card className="border-[#E4E7EB] shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#1E1E1E]">Course Content</CardTitle>
                  <span className="text-sm text-[#7C7C7C]">{totalModules} modules</span>
                </div>
                {isEnrolled && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#7C7C7C]">Your Progress</span>
                      <span className="font-semibold text-[#1E1E1E]">{completedModules}/{totalModules} completed</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.modules.map((module, idx) => (
                    <Link
                      key={module.id}
                      to={module.isLocked ? "#" : createPageUrl("ModuleLessons") + `?courseId=${courseId}&moduleId=${module.id}`}
                      className={`block ${module.isLocked ? 'cursor-not-allowed' : ''}`}
                    >
                      <div className={`p-4 rounded-lg border border-[#E4E7EB] transition-all ${
                        module.isLocked 
                          ? 'bg-gray-50 opacity-60' 
                          : 'hover:border-[#6C4DE6] hover:bg-[#6C4DE6]/5'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              module.completed 
                                ? 'bg-[#08B150] text-white' 
                                : module.isLocked
                                ? 'bg-gray-200 text-gray-400'
                                : 'bg-[#6C4DE6]/10 text-[#6C4DE6]'
                            }`}>
                              {module.completed ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : module.isLocked ? (
                                <Lock className="w-5 h-5" />
                              ) : (
                                <Play className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#1E1E1E]">
                                Module {idx + 1}: {module.title}
                              </h4>
                              <p className="text-sm text-[#7C7C7C]">{module.duration}</p>
                            </div>
                          </div>
                          {module.completed && (
                            <Badge className="bg-[#08B150] text-white border-none">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-[#E4E7EB] shadow-lg sticky top-6">
              <CardContent className="p-6">
                {!isEnrolled ? (
                  <>
                    <Button 
                      size="lg" 
                      className="w-full bg-[#6C4DE6] hover:bg-[#593CC9] text-white mb-4"
                      onClick={handleEnroll}
                    >
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Enroll Now - Free
                    </Button>
                    <p className="text-center text-sm text-[#7C7C7C] mb-4">
                      Get instant access to all course materials
                    </p>
                  </>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      asChild
                      className="w-full bg-[#08B150] hover:bg-[#06893f] text-white mb-4"
                    >
                      <Link to={createPageUrl("ModuleLessons") + `?courseId=${courseId}&moduleId=1`}>
                        <Play className="w-5 h-5 mr-2" />
                        Continue Learning
                      </Link>
                    </Button>
                    <Badge className="w-full justify-center bg-[#08B150]/10 text-[#08B150] border-[#08B150]/20 py-2 mb-4">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Enrolled
                    </Badge>
                  </>
                )}

                <Button
                  variant="outline"
                  className={`w-full border-[#E4E7EB] mb-6 ${
                    liked ? 'text-red-500 border-red-500' : 'text-[#7C7C7C]'
                  }`}
                  onClick={handleLike}
                >
                  <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                  {liked ? 'Liked' : 'Like This Course'}
                </Button>

                <div className="space-y-4 border-t border-[#E4E7EB] pt-6">
                  <h3 className="font-semibold text-[#1E1E1E] mb-3">This Course Includes:</h3>
                  <div className="flex items-center gap-3 text-sm text-[#7C7C7C]">
                    <BookOpen className="w-5 h-5 text-[#318FFD]" />
                    <span>{totalModules} on-demand modules</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#7C7C7C]">
                    <Clock className="w-5 h-5 text-[#318FFD]" />
                    <span>{course.duration} of content</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#7C7C7C]">
                    <Award className="w-5 h-5 text-[#318FFD]" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#7C7C7C]">
                    <TrendingUp className="w-5 h-5 text-[#318FFD]" />
                    <span>Lifetime access</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}