"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Globe, 
  MessageSquare, 
  Send,
  ExternalLink,
  Clock,
  CheckCircle
} from 'lucide-react';

interface ContactPerson {
  name: string;
  title: string;
  department: string;
  location: string;
  email: string;
  phone?: string;
  responsibilities: string[];
  availability: string;
}

interface EUDelegation {
  country: string;
  city: string;
  contact: string;
  email: string;
  phone: string;
  website: string;
  focusAreas: string[];
}

interface UserSupportProps {
  onContactSubmit?: (formData: ContactFormData) => void;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export function UserSupport({ onContactSubmit }: UserSupportProps) {
  const [activeTab, setActiveTab] = useState<'team' | 'delegations' | 'contact' | 'faq'>('team');
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const teamMembers: ContactPerson[] = [
    {
      name: 'Nabeel Siddiqui',
      title: 'IM & Analytics Officer',
      department: 'Peace and Security Cluster',
      location: 'Global Portfolios Office, New York, USA',
      email: 'nabeel.siddiqui@unops.org',
      phone: '+1-212-xxx-xxxx',
      responsibilities: [
        'System Administration',
        'Data Analytics',
        'Technical Support',
        'API Integration'
      ],
      availability: 'Monday-Friday, 9:00 AM - 5:00 PM EST'
    },
    {
      name: 'Kelly McAulay',
      title: 'Senior Partnership Advisor',
      department: 'Africa Region',
      location: 'Office of the Regional Director, Nairobi, Kenya',
      email: 'kelly.mcaulay@unops.org',
      phone: '+254-xxx-xxxx',
      responsibilities: [
        'Partnership Development',
        'Regional Coordination',
        'Stakeholder Engagement',
        'Programme Management'
      ],
      availability: 'Monday-Friday, 8:00 AM - 4:00 PM EAT'
    }
  ];

  const euDelegations: EUDelegation[] = [
    {
      country: 'Kenya',
      city: 'Nairobi',
      contact: 'EU Delegation to Kenya',
      email: 'delegation-kenya@eeas.europa.eu',
      phone: '+254-20-271-2000',
      website: 'https://eeas.europa.eu/delegations/kenya',
      focusAreas: ['Development Cooperation', 'Trade', 'Political Relations']
    },
    {
      country: 'Ethiopia',
      city: 'Addis Ababa',
      contact: 'EU Delegation to Ethiopia',
      email: 'delegation-ethiopia@eeas.europa.eu',
      phone: '+251-11-123-4567',
      website: 'https://eeas.europa.eu/delegations/ethiopia',
      focusAreas: ['Development Cooperation', 'Humanitarian Aid', 'Migration']
    },
    {
      country: 'Nigeria',
      city: 'Abuja',
      contact: 'EU Delegation to Nigeria',
      email: 'delegation-nigeria@eeas.europa.eu',
      phone: '+234-9-461-7000',
      website: 'https://eeas.europa.eu/delegations/nigeria',
      focusAreas: ['Development Cooperation', 'Security', 'Trade']
    },
    {
      country: 'South Africa',
      city: 'Pretoria',
      contact: 'EU Delegation to South Africa',
      email: 'delegation-south-africa@eeas.europa.eu',
      phone: '+27-12-452-5200',
      website: 'https://eeas.europa.eu/delegations/south-africa',
      focusAreas: ['Development Cooperation', 'Trade', 'Climate Change']
    }
  ];

  const faqItems = [
    {
      question: 'How do I search for funding opportunities?',
      answer: 'Use the search bar and filters on the main page. You can filter by country, thematic priority, funding type, and more. The system will show you opportunities that match your criteria.'
    },
    {
      question: 'How often is the data updated?',
      answer: 'The system automatically updates daily from the EU Funding & Tenders Portal API. New opportunities are added as soon as they become available.'
    },
    {
      question: 'Can I set up notifications for new opportunities?',
      answer: 'Yes! Go to the Notifications section to set up alerts based on your criteria. You can choose to receive notifications for specific countries, themes, or funding types.'
    },
    {
      question: 'What if I can\'t find a specific opportunity?',
      answer: 'Try using different search terms or broader filters. If you still can\'t find it, contact our support team who can help you locate specific opportunities.'
    },
    {
      question: 'How do I apply for funding?',
      answer: 'This platform helps you discover opportunities. To apply, visit the official EU Funding & Tenders Portal using the links provided for each opportunity.'
    },
    {
      question: 'Is there a mobile app?',
      answer: 'The platform is fully responsive and works on mobile devices. You can bookmark it on your phone for easy access.'
    }
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onContactSubmit) {
        onContactSubmit(contactForm);
      }
      
      setSubmitted(true);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium',
        category: 'general'
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'team', label: 'Team Contacts', icon: Users },
    { id: 'delegations', label: 'EU Delegations', icon: Globe },
    { id: 'contact', label: 'Contact Form', icon: MessageSquare },
    { id: 'faq', label: 'FAQ', icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Support & Contact Information
          </CardTitle>
          <p className="text-muted-foreground">
            Get help with the funding opportunities platform. Contact our team or EU delegations for assistance.
          </p>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Contacts Tab */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{member.title}</p>
                <p className="text-sm text-muted-foreground">{member.department}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${member.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.availability}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Responsibilities</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.responsibilities.map((responsibility, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {responsibility}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* EU Delegations Tab */}
      {activeTab === 'delegations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {euDelegations.map((delegation, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{delegation.contact}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {delegation.city}, {delegation.country}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${delegation.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {delegation.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{delegation.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={delegation.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Focus Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {delegation.focusAreas.map((area, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Form Tab */}
      {activeTab === 'contact' && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <p className="text-muted-foreground">
              Send us a message and we'll get back to you as soon as possible.
            </p>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-4">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
                <Button onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={contactForm.category}
                      onChange={(e) => setContactForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="data">Data Issue</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={contactForm.priority}
                      onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={5}
                    required
                  />
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
