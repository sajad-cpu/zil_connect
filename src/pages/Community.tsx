import { businessService } from "@/api/services/businessService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  MapPin,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap
} from "lucide-react";

export default function Community() {
  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses-community'],
    queryFn: () => businessService.list('-created'),
    initialData: [],
  });

  const leaderboard = businesses
    .sort((a, b) => (b.engagement_score || 0) - (a.engagement_score || 0))
    .slice(0, 10);

  const localCircles = [
    { city: "New York", state: "NY", count: 2450, growth: "+12%" },
    { city: "Los Angeles", state: "CA", count: 1890, growth: "+8%" },
    { city: "Chicago", state: "IL", count: 1560, growth: "+15%" },
    { city: "Houston", state: "TX", count: 1340, growth: "+10%" },
    { city: "Miami", state: "FL", count: 1120, growth: "+18%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Community Hub</h1>
          </div>
          <p className="text-xl text-white/90">Connect locally, compete globally, and grow together</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="leaderboard" className="space-y-8">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="local">Local Circles</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="border-none shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Connector of the Month</h3>
                    <p className="text-gray-600">Compete for recognition and exclusive benefits</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {leaderboard.map((business, index) => (
                <Card
                  key={business.id}
                  className={`hover:shadow-xl transition-all duration-300 border-none shadow-lg ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 ring-2 ring-yellow-400' :
                    index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 ring-2 ring-gray-300' :
                      index === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 ring-2 ring-orange-300' :
                        ''
                    }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        {index < 3 ? (
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-slate-400' :
                              'bg-gradient-to-br from-orange-400 to-amber-500'
                            }`}>
                            <Trophy className="w-8 h-8 text-white" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Business Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {business.business_name?.[0]?.toUpperCase() || 'B'}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{business.business_name}</h3>
                            <p className="text-sm text-gray-500">{business.industry}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {business.is_verified && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {(business.achievements as string[])?.slice(0, 2).map((achievement, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-5 h-5 text-yellow-500" />
                          <span className="text-3xl font-bold text-gray-900">
                            {business.engagement_score || 0}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Engagement Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Local Circles Tab */}
          <TabsContent value="local" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Local Business Circles
                </CardTitle>
                <p className="text-gray-600">Connect with businesses in your area</p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localCircles.map((circle, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none shadow-lg group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                            {circle.city}, {circle.state}
                          </CardTitle>
                          <p className="text-sm text-gray-500">{circle.count} businesses</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {circle.growth}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Active networking events every week</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="w-4 h-4" />
                        <span>Local partnerships & collaborations</span>
                      </div>
                      <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        Join Circle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Gamified Achievements
                </CardTitle>
                <p className="text-gray-600">Earn badges and unlock exclusive benefits</p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Early Adopter", icon: Star, color: "from-blue-500 to-cyan-500", description: "Join in the first 1000 businesses" },
                { name: "Super Connector", icon: Users, color: "from-purple-500 to-pink-500", description: "Connect with 50+ businesses" },
                { name: "Deal Maker", icon: Trophy, color: "from-yellow-500 to-orange-500", description: "Close 10 successful deals" },
                { name: "Trendsetter", icon: TrendingUp, color: "from-green-500 to-emerald-500", description: "Be in top 10 leaderboard" },
                { name: "Event Host", icon: Zap, color: "from-orange-500 to-red-500", description: "Host 5 virtual events" },
                { name: "Verified Pro", icon: Award, color: "from-indigo-500 to-purple-500", description: "Complete verification process" },
              ].map((achievement, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none shadow-lg text-center"
                >
                  <CardContent className="p-6">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center`}>
                      <achievement.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {Math.floor(Math.random() * 1000)} earned
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}