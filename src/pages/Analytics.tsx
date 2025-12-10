import React from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Target,
  Award,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function Analytics() {
  const profileStats = [
    { label: "Profile Views", value: "2,450", change: "+12.5%", up: true, icon: Eye },
    { label: "Search Appearances", value: "5,680", change: "+8.2%", up: true, icon: Target },
    { label: "Lead Conversions", value: "145", change: "-2.3%", up: false, icon: Users },
    { label: "Trust Score", value: "87/100", change: "+5pts", up: true, icon: Award },
  ];

  const viewsData = [
    { month: "Jul", views: 1200 },
    { month: "Aug", views: 1450 },
    { month: "Sep", views: 1680 },
    { month: "Oct", views: 1950 },
    { month: "Nov", views: 2200 },
    { month: "Dec", views: 2450 },
  ];

  const leadsData = [
    { month: "Jul", leads: 85 },
    { month: "Aug", leads: 95 },
    { month: "Sep", leads: 110 },
    { month: "Oct", leads: 125 },
    { month: "Nov", leads: 135 },
    { month: "Dec", leads: 145 },
  ];

  const trafficSources = [
    { name: "Search", value: 45, color: "#3b82f6" },
    { name: "Direct", value: 30, color: "#8b5cf6" },
    { name: "Referral", value: 15, color: "#ec4899" },
    { name: "Social", value: 10, color: "#10b981" },
  ];

  const industryBenchmark = [
    { metric: "Avg Profile Views", you: 2450, industry: 1850 },
    { metric: "Avg Connections", you: 156, industry: 120 },
    { metric: "Avg Trust Score", you: 87, industry: 72 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Business Growth Analytics</h1>
          </div>
          <p className="text-xl text-white/90">Track your performance and compare with industry benchmarks</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profileStats.map((stat, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className={stat.up ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}>
                    {stat.up ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights Banner */}
        <Card className="border-none shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">💡 Key Insight</h3>
                <p className="text-gray-700">
                  <strong>Verified SMBs get 3x more leads</strong> on average. Complete your verification process to boost visibility and credibility.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Views Chart */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Profile Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Lead Conversions Chart */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Lead Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Industry Benchmark */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Industry Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={industryBenchmark} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="metric" type="category" width={150} stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="you" fill="#3b82f6" name="Your Business" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="industry" fill="#d1d5db" name="Industry Avg" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}