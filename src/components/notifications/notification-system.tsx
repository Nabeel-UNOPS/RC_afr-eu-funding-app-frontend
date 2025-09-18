"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, BellOff, Settings, AlertCircle, CheckCircle, Clock, Globe } from 'lucide-react';
import { FundingOpportunity, SearchFilters } from '@/lib/filters';

interface NotificationSettings {
  enabled: boolean;
  frequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
  countries: string[];
  thematicPriorities: string[];
  fundingTypes: string[];
  budgetThreshold: number;
  statusFilter: string[];
  emailNotifications: boolean;
  browserNotifications: boolean;
}

interface NotificationItem {
  id: string;
  type: 'new_opportunity' | 'deadline_reminder' | 'status_change' | 'system_update';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  opportunity?: FundingOpportunity;
  actionUrl?: string;
}

interface NotificationSystemProps {
  opportunities: FundingOpportunity[];
  onNotificationClick?: (notification: NotificationItem) => void;
}

export function NotificationSystem({ opportunities, onNotificationClick }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    frequency: 'daily',
    countries: [],
    thematicPriorities: [],
    fundingTypes: [],
    budgetThreshold: 100000,
    statusFilter: ['Open', 'Forthcoming'],
    emailNotifications: true,
    browserNotifications: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
  }, [settings]);

  // Generate notifications based on opportunities and settings
  useEffect(() => {
    if (!settings.enabled) return;

    const newNotifications: NotificationItem[] = [];

    // Check for new opportunities
    opportunities.forEach(opportunity => {
      // Check if opportunity matches user's criteria
      if (matchesNotificationCriteria(opportunity, settings)) {
        // Check if we already have a notification for this opportunity
        const existingNotification = notifications.find(n => 
          n.opportunity?.id === opportunity.id && n.type === 'new_opportunity'
        );

        if (!existingNotification) {
          newNotifications.push({
            id: `new-${opportunity.id}-${Date.now()}`,
            type: 'new_opportunity',
            title: 'New Funding Opportunity',
            message: `${opportunity.title} - ${opportunity.fundingAmount}`,
            timestamp: new Date(),
            read: false,
            priority: getPriority(opportunity),
            opportunity,
            actionUrl: opportunity.source_url
          });
        }
      }

      // Check for deadline reminders (7 days before deadline)
      if (opportunity.deadline && opportunity.deadline !== 'No deadline specified') {
        const deadline = new Date(opportunity.deadline);
        const now = new Date();
        const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDeadline <= 7 && daysUntilDeadline > 0) {
          const existingReminder = notifications.find(n => 
            n.opportunity?.id === opportunity.id && n.type === 'deadline_reminder'
          );

          if (!existingReminder) {
            newNotifications.push({
              id: `deadline-${opportunity.id}-${Date.now()}`,
              type: 'deadline_reminder',
              title: 'Deadline Reminder',
              message: `${opportunity.title} deadline in ${daysUntilDeadline} days`,
              timestamp: new Date(),
              read: false,
              priority: daysUntilDeadline <= 3 ? 'high' : 'medium',
              opportunity,
              actionUrl: opportunity.source_url
            });
          }
        }
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
      setUnreadCount(prev => prev + newNotifications.length);
    }
  }, [opportunities, settings]);

  const matchesNotificationCriteria = (opportunity: FundingOpportunity, settings: NotificationSettings): boolean => {
    // Check countries
    if (settings.countries.length > 0) {
      const hasMatchingCountry = settings.countries.some(country =>
        opportunity.geographical_focus.toLowerCase().includes(country.toLowerCase())
      );
      if (!hasMatchingCountry) return false;
    }

    // Check thematic priorities
    if (settings.thematicPriorities.length > 0) {
      const hasMatchingTheme = settings.thematicPriorities.some(theme =>
        opportunity.thematic_priorities.some(oppTheme => 
          oppTheme.toLowerCase().includes(theme.toLowerCase())
        )
      );
      if (!hasMatchingTheme) return false;
    }

    // Check funding types
    if (settings.fundingTypes.length > 0) {
      if (!settings.fundingTypes.includes(opportunity.funding_type)) return false;
    }

    // Check budget threshold
    const budgetAmount = extractBudgetAmount(opportunity.fundingAmount);
    if (budgetAmount && budgetAmount < settings.budgetThreshold) return false;

    // Check status
    if (settings.statusFilter.length > 0) {
      if (!settings.statusFilter.includes(opportunity.status)) return false;
    }

    return true;
  };

  const getPriority = (opportunity: FundingOpportunity): 'low' | 'medium' | 'high' => {
    const budgetAmount = extractBudgetAmount(opportunity.fundingAmount);
    if (budgetAmount && budgetAmount > 5000000) return 'high';
    if (budgetAmount && budgetAmount > 1000000) return 'medium';
    return 'low';
  };

  const extractBudgetAmount = (budgetString: string): number | null => {
    if (!budgetString || budgetString === 'Contact for details') return null;
    const match = budgetString.match(/€?([\d,.\s]+)/);
    if (match) {
      const amount = parseFloat(match[1].replace(/[,\s]/g, ''));
      if (budgetString.includes('M')) return amount * 1000000;
      if (budgetString.includes('K')) return amount * 1000;
      return amount;
    }
    return null;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    markAsRead(notification.id);
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_opportunity':
        return <Globe className="h-4 w-4 text-green-600" />;
      case 'deadline_reminder':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'status_change':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'system_update':
        return <Settings className="h-4 w-4 text-gray-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4 w-full max-w-none">
      {/* Notification Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {settings.enabled ? (
                <Bell className="h-5 w-5 text-green-600" />
              ) : (
                <BellOff className="h-5 w-5 text-gray-400" />
              )}
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-blue-50 hover:text-blue-700"
                  onClick={markAllAsRead}
                >
                  Mark All Read
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Settings Panel */}
        {showSettings && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                  Enable Notifications
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={settings.frequency}
                  onValueChange={(value: any) => 
                    setSettings(prev => ({ ...prev, frequency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Budget Threshold (EUR)</Label>
                <input
                  type="number"
                  value={settings.budgetThreshold}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, budgetThreshold: parseInt(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label>Status Filter</Label>
                <div className="space-y-1">
                  {['Open', 'Forthcoming', 'Closed'].map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={settings.statusFilter.includes(status)}
                        onCheckedChange={(checked) => {
                          const newStatusFilter = checked
                            ? [...settings.statusFilter, status]
                            : settings.statusFilter.filter(s => s !== status);
                          setSettings(prev => ({ ...prev, statusFilter: newStatusFilter }));
                        }}
                      />
                      <Label htmlFor={`status-${status}`} className="text-sm">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications yet</p>
              <p className="text-sm">We'll notify you when new opportunities match your criteria</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}