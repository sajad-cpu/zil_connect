import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ModuleLessons() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("courseId");
  const moduleId = parseInt(urlParams.get("moduleId"));
  
  const [currentModuleId, setCurrentModuleId] = useState(moduleId);
  const [completedModules, setCompletedModules] = useState([]);

  // Mock course and modules data
  const course = {
    id: 1,
    title: "Funding Your Business",
    modules: [
      { 
        id: 1, 
        title: "Introduction to Business Funding", 
        duration: "15m",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Welcome to the course! In this introductory module, we'll explore the landscape of business funding and why it's crucial for your business growth.",
        keyPoints: [
          "Understanding the importance of business funding",
          "Overview of different funding stages",
          "Common misconceptions about funding",
          "Setting realistic funding goals"
        ],
        transcript: "Welcome to Funding Your Business. In this comprehensive course, we'll guide you through everything you need to know about securing funding for your business venture..."
      },
      { 
        id: 2, 
        title: "Types of Funding Sources", 
        duration: "25m",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Learn about the various funding sources available to businesses, from bootstrapping to venture capital.",
        keyPoints: [
          "Bootstrapping and self-funding",
          "Angel investors and their criteria",
          "Venture capital funding stages",
          "Bank loans and SBA options",
          "Crowdfunding platforms"
        ],
        transcript: "There are numerous ways to fund your business. Let's explore each option in detail..."
      },
      { 
        id: 3, 
        title: "Creating Your Pitch Deck", 
        duration: "30m",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Master the art of creating compelling pitch decks that capture investor attention.",
        keyPoints: [
          "Essential slides for your pitch deck",
          "Storytelling techniques for pitches",
          "Design best practices",
          "Common pitch deck mistakes",
          "Customizing for different audiences"
        ],
        transcript: "Your pitch deck is your business's first impression. Here's how to make it count..."
      },
    ]
  };

  const currentModule = course.modules.find(m => m.id === currentModuleId);
  const currentModuleIndex = course.modules.findIndex(m => m.id === currentModuleId);
  const totalModules = course.modules.length;
  const progressPercentage = (completedModules.length / totalModules) * 100;

  const handleMarkComplete = () => {
    if (!completedModules.includes(currentModuleId)) {
      setCompletedModules([...completedModules, currentModuleId]);
    }
  };

  const goToNextModule = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      const nextModule = course.modules[currentModuleIndex + 1];
      setCurrentModuleId(nextModule.id);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousModule = () => {
    if (currentModuleIndex > 0) {
      const prevModule = course.modules[currentModuleIndex - 1];
      setCurrentModuleId(prevModule.id);
      window.scrollTo(0, 0);
    }
  };

  const isModuleCompleted = completedModules.includes(currentModuleId);

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E4E7EB] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild className="text-[#1E1E1E] hover:bg-[#F8F9FC]">
              <Link to={createPageUrl("CourseDetails") + `?id=${courseId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-[#7C7C7C]">
                <CheckCircle className="w-4 h-4 text-[#318FFD]" />
                <span>{completedModules.length}/{totalModules} completed</span>
              </div>
              <div className="w-32">
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Title */}
            <div>
              <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">{course.title}</h1>
              <p className="text-[#7C7C7C]">
                Module {currentModuleIndex + 1} of {totalModules}
              </p>
            </div>

            {/* Video Player */}
            <Card className="border-[#E4E7EB] shadow-lg overflow-hidden">
              <div className="relative aspect-video bg-black">
                <iframe
                  src={currentModule?.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={currentModule?.title}
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">
                      {currentModule?.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-[#7C7C7C]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[#318FFD]" />
                        <span>{currentModule?.duration}</span>
                      </div>
                      {isModuleCompleted && (
                        <Badge className="bg-[#08B150] text-white border-none">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!isModuleCompleted && (
                    <Button
                      onClick={handleMarkComplete}
                      className="bg-[#08B150] hover:bg-[#06893f] text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Module Description */}
            <Card className="border-[#E4E7EB] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1E1E1E]">About This Module</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#7C7C7C] leading-relaxed mb-6">
                  {currentModule?.description}
                </p>
                
                <h3 className="font-semibold text-[#1E1E1E] mb-3">Key Learning Points</h3>
                <ul className="space-y-2">
                  {currentModule?.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#6C4DE6] mt-0.5 flex-shrink-0" />
                      <span className="text-[#7C7C7C]">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Transcript */}
            <Card className="border-[#E4E7EB] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#1E1E1E] flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Transcript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#7C7C7C] leading-relaxed whitespace-pre-line">
                  {currentModule?.transcript}
                </p>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-[#E4E7EB]">
              <Button
                variant="outline"
                onClick={goToPreviousModule}
                disabled={currentModuleIndex === 0}
                className="border-[#E4E7EB] text-[#1E1E1E] hover:bg-[#F8F9FC] disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Module
              </Button>
              
              {currentModuleIndex === totalModules - 1 ? (
                <Button
                  asChild
                  className="bg-[#08B150] hover:bg-[#06893f] text-white"
                >
                  <Link to={createPageUrl("CourseDetails") + `?id=${courseId}`}>
                    <Award className="w-4 h-4 mr-2" />
                    Complete Course
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={goToNextModule}
                  className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
                >
                  Next Module
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Module List */}
          <div className="lg:col-span-1">
            <Card className="border-[#E4E7EB] shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-[#1E1E1E]">Course Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.modules.map((module, idx) => (
                    <button
                      key={module.id}
                      onClick={() => setCurrentModuleId(module.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        module.id === currentModuleId
                          ? 'border-[#6C4DE6] bg-[#6C4DE6]/5'
                          : 'border-[#E4E7EB] hover:border-[#6C4DE6] hover:bg-[#F8F9FC]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          completedModules.includes(module.id)
                            ? 'bg-[#08B150] text-white'
                            : module.id === currentModuleId
                            ? 'bg-[#6C4DE6] text-white'
                            : 'bg-gray-100 text-[#7C7C7C]'
                        }`}>
                          {completedModules.includes(module.id) ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-semibold truncate ${
                            module.id === currentModuleId ? 'text-[#6C4DE6]' : 'text-[#1E1E1E]'
                          }`}>
                            {idx + 1}. {module.title}
                          </h4>
                          <p className="text-xs text-[#7C7C7C]">{module.duration}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Progress Summary */}
                <div className="mt-6 pt-6 border-t border-[#E4E7EB]">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#7C7C7C]">Overall Progress</span>
                    <span className="font-semibold text-[#1E1E1E]">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 mb-4" />
                  {progressPercentage === 100 && (
                    <Badge className="w-full justify-center bg-[#08B150] text-white border-none py-2">
                      <Award className="w-4 h-4 mr-2" />
                      Course Completed!
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}