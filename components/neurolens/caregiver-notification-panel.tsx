'use client';

import { Bell, AlertTriangle, AlertOctagon, CheckCircle, MapPin, Car, Navigation, X, Clock } from 'lucide-react';
import { useState } from 'react';

type NotificationSeverity = 'info' | 'warning' | 'emergency';

interface CaregiverNotification {
  id: string;
  title: string;
  message: string;
  type: 'distress' | 'cab_booked' | 'trip_shared' | 'arrival' | 'location_alert' | 'acknowledgment';
  severity: NotificationSeverity;
  timestamp: string;
  userName?: string;
  isAcknowledged?: boolean;
  actionRequired?: boolean;
}

interface CaregiverNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: CaregiverNotification[];
  unreadCount?: number;
  onAcknowledge?: (id: string) => void;
  onClearAll?: () => void;
  onViewDetails?: (id: string) => void;
}

export function CaregiverNotificationPanel({
  isOpen,
  onClose,
  notifications = [
    {
      id: '1',
      title: 'EMERGENCY: Distress Detected',
      message: 'Sarah detected confusion at intersection. Live location shared.',
      type: 'distress',
      severity: 'emergency',
      timestamp: '2 min ago',
      userName: 'Sarah Johnson',
      isAcknowledged: false,
      actionRequired: true,
    },
    {
      id: '2',
      title: 'Safe Cab Booked',
      message: 'Safe ride booked to Central Hospital. Driver Marcus Johnson assigned.',
      type: 'cab_booked',
      severity: 'info',
      timestamp: '15 min ago',
      userName: 'Sarah Johnson',
      isAcknowledged: false,
      actionRequired: false,
    },
    {
      id: '3',
      title: 'Trip Shared',
      message: 'Live trip sharing enabled. You can now track the journey in real-time.',
      type: 'trip_shared',
      severity: 'info',
      timestamp: '20 min ago',
      userName: 'Sarah Johnson',
      isAcknowledged: true,
      actionRequired: false,
    },
    {
      id: '4',
      title: 'Arrival Update',
      message: 'Sarah has arrived at the destination safely.',
      type: 'arrival',
      severity: 'info',
      timestamp: '45 min ago',
      userName: 'Sarah Johnson',
      isAcknowledged: true,
      actionRequired: false,
    },
  ],
  unreadCount = 2,
  onAcknowledge,
  onClearAll,
  onViewDetails,
}: CaregiverNotificationPanelProps) {
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>(
    notifications?.filter(n => n.isAcknowledged).map(n => n.id) || []
  );

  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds([...acknowledgedIds, id]);
    onAcknowledge?.(id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'distress':
        return AlertOctagon;
      case 'cab_booked':
        return Car;
      case 'trip_shared':
        return Navigation;
      case 'arrival':
        return CheckCircle;
      case 'location_alert':
        return MapPin;
      case 'acknowledgment':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getSeverityColor = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'emergency':
        return 'bg-[var(--distress)]/10 border-[var(--distress)]/30';
      case 'warning':
        return 'bg-[var(--warning)]/10 border-[var(--warning)]/30';
      case 'info':
        return 'bg-muted/30 border-muted/40';
      default:
        return 'bg-muted/30 border-muted/40';
    }
  };

  const getSeverityIcon = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'emergency':
        return { color: 'text-[var(--distress)]', bg: 'bg-[var(--distress)]/10' };
      case 'warning':
        return { color: 'text-[var(--warning)]', bg: 'bg-[var(--warning)]/10' };
      case 'info':
        return { color: 'text-primary', bg: 'bg-primary/10' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted/10' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border w-full sm:max-w-md h-[80vh] sm:h-auto sm:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-5 sm:zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--distress)] text-[var(--distress-foreground)] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Notifications</h2>
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications && notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                const severityColors = getSeverityColor(notification.severity);
                const iconColors = getSeverityIcon(notification.severity);
                const isAcknowledged = acknowledgedIds.includes(notification.id);

                return (
                  <div
                    key={notification.id}
                    className={`border-l-4 ${
                      notification.severity === 'emergency'
                        ? 'border-l-[var(--distress)]'
                        : notification.severity === 'warning'
                          ? 'border-l-[var(--warning)]'
                          : 'border-l-primary'
                    } ${severityColors} p-4 transition-all hover:bg-opacity-50`}
                  >
                    <div className="flex gap-3 mb-2">
                      <div className={`${iconColors.bg} p-2 rounded-lg flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${iconColors.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">{notification.title}</p>
                        {notification.userName && (
                          <p className="text-xs text-muted-foreground mb-1">From: {notification.userName}</p>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-foreground mb-3 ml-11">{notification.message}</p>

                    <div className="flex items-center justify-between ml-11">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {notification.timestamp}
                      </div>
                      {notification.actionRequired && !isAcknowledged && (
                        <button
                          onClick={() => handleAcknowledge(notification.id)}
                          className="bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold px-3 py-1 rounded-lg transition-all"
                        >
                          Acknowledge
                        </button>
                      )}
                      {isAcknowledged && (
                        <span className="text-xs text-[var(--safe)] font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Acknowledged
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="w-12 h-12 text-muted mb-3" />
              <p className="text-foreground font-semibold text-center">No notifications</p>
              <p className="text-sm text-muted-foreground text-center">All clear!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications && notifications.length > 0 && (
          <div className="border-t border-border p-4">
            <button
              onClick={() => {
                onClearAll?.();
                setAcknowledgedIds([]);
              }}
              className="w-full bg-muted text-foreground hover:bg-muted/80 font-semibold py-2 px-4 rounded-lg transition-all text-sm"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
