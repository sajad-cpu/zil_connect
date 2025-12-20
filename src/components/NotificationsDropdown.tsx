import { pb } from "@/api/pocketbaseClient";
import { connectionService } from "@/api/services/connectionService";
import { messageService } from "@/api/services/messageService";
import { notificationService } from "@/api/services/notificationService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Bell, MessageSquare, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function NotificationsDropdown({ totalNotifications }: { totalNotifications: number }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Fetch pending connection requests
  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['notifications-pending-requests'],
    queryFn: () => connectionService.getPendingRequests(),
    refetchInterval: 30000,
    initialData: [],
  });

  // Fetch unread messages count per connection
  const { data: conversations = [] } = useQuery({
    queryKey: ['notifications-conversations'],
    queryFn: () => messageService.getConversations(),
    refetchInterval: 30000,
    initialData: [],
  });

  // Filter conversations with unread messages
  const unreadConversations = conversations.filter((conv: any) => conv.unreadCount > 0);

  // Combine all notifications
  const allNotifications = [
    ...pendingRequests.map((request: any) => ({
      id: request.id,
      type: 'connection_request',
      icon: Users,
      title: 'New Connection Request',
      message: `${request.expand?.business_from?.business_name || 'Someone'} wants to connect with you`,
      time: request.created,
      action: () => {
        setOpen(false);
        navigate('/Invitations');
      }
    })),
    ...unreadConversations.map((conv: any) => {
      const otherUser = conv.connection.user_from === pb.authStore.model?.id
        ? conv.connection.expand?.user_to
        : conv.connection.expand?.user_from;
      const otherBusiness = conv.connection.user_from === pb.authStore.model?.id
        ? conv.connection.expand?.business_to
        : conv.connection.expand?.business_from;

      return {
        id: conv.connection.id,
        type: 'message',
        icon: MessageSquare,
        title: 'New Message',
        message: `${otherBusiness?.business_name || 'Someone'} sent you a message`,
        time: conv.latestMessage?.created || conv.connection.created,
        action: () => {
          setOpen(false);
          navigate('/Connected');
        },
        unreadCount: conv.unreadCount
      };
    })
  ];

  // Sort by time (most recent first)
  allNotifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return format(date, 'MMM d');
      }
    } catch {
      return '';
    }
  };

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: (data) => {
      toast.success(`Marked ${data.count} notification${data.count !== 1 ? 's' : ''} as read`);
      queryClient.invalidateQueries({ queryKey: ['notifications-pending-requests'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages-count'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark notifications as read');
    }
  });

  const handleClearAll = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-[#3C2F63] relative transition-all duration-300">
          <Bell className="w-5 h-5" />
          {totalNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#6C4DE6] text-white text-xs border-2 border-[#241C3A] pulse-glow">
              {totalNotifications > 9 ? '9+' : totalNotifications}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-[#1E1E1E]">Notifications</h3>
            <p className="text-xs text-[#7C7C7C]">{totalNotifications} new notification{totalNotifications !== 1 ? 's' : ''}</p>
          </div>
          {allNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-[#6C4DE6] hover:text-[#593CC9] hover:bg-[#6C4DE6]/10 text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {allNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-[#F8F9FC] rounded-full flex items-center justify-center mb-3">
                <Bell className="w-8 h-8 text-[#7C7C7C]/30" />
              </div>
              <p className="text-[#7C7C7C] text-sm">No new notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {allNotifications.map((notification: any) => {
                const Icon = notification.icon;
                return (
                  <button
                    key={notification.id}
                    onClick={notification.action}
                    className="w-full p-4 hover:bg-[#F8F9FC] transition-colors text-left flex items-start gap-3"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'connection_request' ? 'bg-[#6C4DE6]/10' : 'bg-[#318FFD]/10'
                      }`}>
                      <Icon className={`w-5 h-5 ${notification.type === 'connection_request' ? 'text-[#6C4DE6]' : 'text-[#318FFD]'
                        }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-[#1E1E1E] text-sm">{notification.title}</p>
                        {notification.unreadCount && (
                          <Badge className="bg-[#FF4C4C] text-white text-xs px-1.5 py-0.5 h-5">
                            {notification.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[#7C7C7C] text-sm mb-1 line-clamp-2">{notification.message}</p>
                      <p className="text-[#7C7C7C] text-xs">{formatTime(notification.time)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {allNotifications.length > 0 && (
          <div className="p-3 border-t bg-[#F8F9FC]">
            <Button
              variant="ghost"
              className="w-full text-[#6C4DE6] hover:text-[#593CC9] hover:bg-white text-sm font-medium"
              onClick={() => {
                setOpen(false);
                navigate('/Invitations');
              }}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
