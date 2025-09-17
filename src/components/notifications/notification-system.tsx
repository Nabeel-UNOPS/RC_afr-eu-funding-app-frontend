"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellOff, Settings, AlertCircle, CheckCircle, Clock, Globe } from 'lucide-react';
import { EnhancedOpportunity } from '@/lib/enhanced-api';

export interface NotificationSettings {
  enabled: boolean;
  newOpportunities: boolean;
  deadlineAlerts: boolean;
  countrySpecific: boolean;
  thematicPriority: string[];
  countries: string[];
  fundingTypes: string[];
  alertFrequency: 'immediate' | 'daily' | 'weekly';
}

export interface Notification {
  id: string;
  type: 'new_opportunity' | 'deadline_alert' | 'country_update' | 'thematic_update';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  opportunityId?: string;
  country?: string;
  thematicPriority?: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  newOpportunities: true,
  deadlineAlerts: true,
  countrySpecific: false,
  thematicPriority: [],
  countries: [],
  fundingTypes: ['Development', 'Humanitarian'],
  alertFrequency: 'daily'
};

const THEMATIC_PRIORITIES = [
  'Sustainable economic growth',
  'Green and digital transition',
  'Human development',
  'Governance and rule of law',
  'Migration and mobility',
  'Security and stability',
  'Climate action',
  'Digital transformation',
  'Education and training',
  'Health and social protection',
  'Agriculture and rural development',
  'Infrastructure and connectivity',
  'Private sector development',
  'Civil society and media',
  'Youth and gender equality'
];

const COUNTRIES = [
  'Benin',
  'Burkina Faso',
  'Cameroon',
  'Chad',
  'Côte d\'Ivoire',
  'Ghana',
  'Guinea',
  'Liberia',
  'Mali',
  'Niger',
  'Nigeria',
  'Senegal',
  'Sierra Leone',
  'Togo',
  'Sub-Saharan Africa'
];

const FUNDING_TYPES = ['Development', 'Humanitarian'];

export function NotificationSystem() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
  }, [settings]);

  // Generate mock notifications based on settings
  useEffect(() => {
    if (!settings.enabled) {
      setNotifications([]);
      return;
    }

    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'new_opportunity',
        title: 'New Funding Opportunity: Climate Action in West Africa',
        message: 'A new climate action funding opportunity has been posted for West African countries.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        opportunityId: 'climate-action-001',
        country: 'West Africa',
        thematicPriority: 'Climate action'
      },
      {
        id: '2',
        type: 'deadline_alert',
        title: 'Deadline Approaching: Education Initiative',
        message: 'The application deadline for the Education Initiative in Ghana is approaching in 3 days.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false,
        opportunityId: 'education-ghana-001',
        country: 'Ghana',
        thematicPriority: 'Education and training'
      },
      {
        id: '3',
        type: 'country_update',
        title: 'New Opportunities in Nigeria',
        message: '3 new funding opportunities have been added for Nigeria.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        country: 'Nigeria'
      },
      {
        id: '4',
        type: 'thematic_update',
        title: 'Health & Social Protection Updates',
        message: 'New health and social protection opportunities are now available.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true,
        thematicPriority: 'Health and social protection'
      }
    ];

    // Filter notifications based on settings
    let filteredNotifications = mockNotifications;

    if (settings.countrySpecific && settings.countries.length > 0) {
      filteredNotifications = filteredNotifications.filter(notif => 
        !notif.country || settings.countries.includes(notif.country)
      );
    }

    if (settings.thematicPriority.length > 0) {
      filteredNotifications = filteredNotifications.filter(notif => 
        !notif.thematicPriority || settings.thematicPriority.includes(notif.thematicPriority)
      );
    }

    setNotifications(filteredNotifications);
  }, [settings]);

  const handleSettingsChange = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: !notif.read } : notif
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_opportunity':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'deadline_alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'country_update':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'thematic_update':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
            >
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about new opportunities and updates
                </p>
              </div>
              <Switch
                id="notifications-enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingsChange('enabled', checked)}
              />
            </div>

            {settings.enabled && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-opportunities">New Opportunities</Label>
                    <Switch
                      id="new-opportunities"
                      checked={settings.newOpportunities}
                      onCheckedChange={(checked) => handleSettingsChange('newOpportunities', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="deadline-alerts">Deadline Alerts</Label>
                    <Switch
                      id="deadline-alerts"
                      checked={settings.deadlineAlerts}
                      onCheckedChange={(checked) => handleSettingsChange('deadlineAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="country-specific">Country-Specific Alerts</Label>
                    <Switch
                      id="country-specific"
                      checked={settings.countrySpecific}
                      onCheckedChange={(checked) => handleSettingsChange('countrySpecific', checked)}
                    />
                  </div>
                </div>

                {settings.countrySpecific && (
                  <div className="space-y-2">
                    <Label>Countries to Monitor</Label>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (value && !settings.countries.includes(value)) {
                          handleSettingsChange('countries', [...settings.countries, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add country to monitor" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.filter(country => !settings.countries.includes(country)).map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      {settings.countries.map(country => (
                        <Badge key={country} variant="secondary" className="flex items-center gap-1">
                          {country}
                          <button
                            onClick={() => handleSettingsChange('countries', settings.countries.filter(c => c !== country))}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Alert Frequency</Label>
                  <Select
                    value={settings.alertFrequency}
                    onValueChange={(value) => handleSettingsChange('alertFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      {!settings.enabled ? (
        <Card className="p-8 text-center">
          <BellOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Notifications Disabled</h3>
          <p className="text-muted-foreground mb-4">
            Enable notifications to receive updates about new funding opportunities.
          </p>
          <Button onClick={() => handleSettingsChange('enabled', true)}>
            Enable Notifications
          </Button>
        </Card>
      ) : notifications.length === 0 ? (
        <Card className="p-8 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
          <p className="text-muted-foreground">
            You're all caught up! New notifications will appear here when available.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
              }`}
              onClick={() => handleToggleRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex gap-2">
                      {notification.country && (
                        <Badge variant="outline" className="text-xs">
                          {notification.country}
                        </Badge>
                      )}
                      {notification.thematicPriority && (
                        <Badge variant="outline" className="text-xs">
                          {notification.thematicPriority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
