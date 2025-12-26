import React, { useState } from "react";
import { eventService } from "@/api/services/eventService";
import { EventCardSkeleton } from "@/components/skeletons";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function Events() {
  const [statusFilter, setStatusFilter] = useState("Upcoming");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events-all'],
    queryFn: () => eventService.list('-date'),
    initialData: [],
  });

  const filteredEvents = events.filter(e => e.status === statusFilter);

  const getEventTypeColor = (type) => {
    const colors = {
      "Trade Fair": "bg-purple-100 text-purple-700 border-purple-200",
      "Webinar": "bg-blue-100 text-blue-700 border-blue-200",
      "Networking": "bg-green-100 text-green-700 border-green-200",
      "Conference": "bg-orange-100 text-orange-700 border-orange-200",
      "Workshop": "bg-pink-100 text-pink-700 border-pink-200"
    };
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "TBA";
      return format(date, 'MMM d, yyyy');
    } catch {
      return "TBA";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "TBA";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "TBA";
      return format(date, 'h:mm a');
    } catch {
      return "TBA";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Virtual Events & Trade Fairs</h1>
          </div>
          <p className="text-xl text-white/90">Connect, learn, and grow with industry-specific events</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="mb-8 border-none shadow-lg">
          <CardContent className="p-6">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
                <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="Live">Live Now</TabsTrigger>
                <TabsTrigger value="Completed">Past Events</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EventCardSkeleton count={4} />
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No {statusFilter.toLowerCase()} events</h3>
              <p className="text-gray-600">Check back soon for new events!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none shadow-lg overflow-hidden group"
              >
                {/* Banner */}
                <div className="h-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200')] opacity-20 bg-cover bg-center" />
                  <div className="relative z-10 text-center text-white p-6">
                    {event.industry && (
                      <Badge className="mb-3 bg-white/20 text-white border-white/30">
                        {event.industry}
                      </Badge>
                    )}
                    {event.status === "Live" && (
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="font-bold text-lg">LIVE NOW</span>
                      </div>
                    )}
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                    {event.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500">Hosted by {event.host_business}</p>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(event.date)} • {event.duration_hours}h</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.attendees_count || 0}
                        {event.max_attendees && ` / ${event.max_attendees}`} attendees
                      </span>
                    </div>
                    {event.is_virtual && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Video className="w-4 h-4" />
                        <span>Virtual Event</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button 
                    className={`w-full ${
                      event.status === "Live" 
                        ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse" 
                        : event.status === "Upcoming"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        : "bg-gray-400"
                    }`}
                    disabled={event.status === "Completed"}
                  >
                    {event.status === "Live" && (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Join Now
                      </>
                    )}
                    {event.status === "Upcoming" && (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Register
                      </>
                    )}
                    {event.status === "Completed" && "Event Ended"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}