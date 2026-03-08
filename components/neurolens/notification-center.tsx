'use client';

import { Bell, AlertTriangle, MapPin, AlertOctagon, CheckCircle, Navigation, X, Filter } from 'lucide-react';
import { useState } from 'react';

type NotificationSeverity = 'info' | 'warning' | 'alert';
type NotificationCategory = 'all' | 'warnings' | 'navigation' | 'emergency';

interface Notification {
  id: string;
  type: 'obstacle' | 'deviation' | 'distress' | 'safe_zone' | 'caregiver' | 'ride';
  title: string;
  description: string;
  severity: NotificationSeverity;
  timestamp: string;
  isRead: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
  unreadCount?: number;
  onClearAll?: () => void;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications = [
    {
      id: '1',
      type: 'distress',
      title: 'Distress Detected',
      description: 'System detected possible confusion at intersection',
      severity: 'alert',
      timestamp: '2 min ago',
      isRead: false,
    },
    {
      id: '2',
      type: 'deviation',
      title: 'Route Deviation',
      description: 'You are off the planned route. Would you like guidance?',
      severity: 'warning',
      timestamp: '5 min ago',
      isRead: false,
    },
    {
      id: '3',
      type: 'obstacle',
      title: 'Obstacle Detected',
      description: 'Construction barrier ahead, route adjusted',
      severity: 'warning',
      timestamp: '12 min ago',
      isRead: true,
    },
    {
      id: '4',
      type: 'safe_zone',
      title: 'Safe Zone Reached',
      description: 'You have arrived at Central Library',
      severity: 'info',
      timestamp: '1 hour ago',
      isRead: true,
    },
    {
      id: '5',
      type: 'caregiver',
      title: 'Caregiver Notified',
      description: 'Your guardian has been alerted and is monitoring',
      severity: 'info',
      timestamp: '2 hours ago',
      isRead: true,
    },
  ],
  unreadCount = 2,
  onClearAll,
  onMarkAsRead,
}: NotificationCenterProps) {
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'obstacle':
        return <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />;
      case 'deviation':
        return <Navigation className="w-5 h-5 text-[var(--warning)]" />;
      case 'distress':
        return <AlertOctagon className="w-5 h-5 text-[var(--distress)]" />;
      case 'safe_zone':
        return <CheckCircle className="w-5 h-5 text-[var(--safe)]" />;
      case 'caregiver':
        return <Bell className="w-5 h-5 text-primary" />;
      case 'ride':
        return <MapPin className="w-5 h-5 text-primary" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'alert':
        return 'bg-[var(--distress)]/10 border-[var(--distress)]/20';
      case 'warning':
        return 'bg-[var(--warning)]/10 border-[var(--warning)]/20';
      default:
        return 'bg-muted/30 border-border';
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'warnings') return notif.severity === 'warning' || notif.severity === 'alert';
    if (activeFilter === 'navigation') return notif.type === 'deviation' || notif.type === 'obstacle';
    if (activeFilter === 'emergency') return notif.severity === 'alert';
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-card rounded-l-2xl shadow-2xl border-l border-border w-full md:w-96 overflow-y-auto max-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filters */}
        <div className="border-b border-border p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Filter</p>
          <div className="grid grid-cols-2 gap-2">
            {['all', 'warnings', 'navigation', 'emergency'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as NotificationCategory)}
                className={`text-xs font-medium py-2 px-3 rounded-lg transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 divide-y divide-border">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead?.(notif.id)}
                className={`p-4 cursor-pointer transition-colors hover:bg-muted/20 ${
                  notif.isRead ? '' : 'bg-muted/10'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-foreground">{notif.title}</h3>
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{notif.description}</p>
                    <p className="text-xs text-muted-foreground">{notif.timestamp}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="w-12 h-12 text-muted/50 mb-3" />
              <p className="text-sm text-muted-foreground text-center">No notifications in this category</p>
            </div>
          )}
        </div>

        {/* Clear button */}
        {notifications.length > 0 && (
          <div className="border-t border-border p-4">
            <button
              onClick={onClearAll}
              className="w-full text-sm text-muted-foreground hover:text-foreground font-medium py-2 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
