import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("public");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <SettingsIcon className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Settings</h1>
          </div>
          <p className="text-xl text-white/90">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="account" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Update your business account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input id="business-name" placeholder="Your Business Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select defaultValue="technology">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="hello@business.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+1-555-0123" />
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-500">Get notified in real-time</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">New Connection Requests</h4>
                    <p className="text-sm text-gray-500">When someone wants to connect</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">Opportunity Matches</h4>
                    <p className="text-sm text-gray-500">When new opportunities match your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Weekly Digest</h4>
                    <p className="text-sm text-gray-500">Summary of your activity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Control who can see your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see</SelectItem>
                      <SelectItem value="members">Members Only</SelectItem>
                      <SelectItem value="connections">Connections Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">Show Transaction History</h4>
                    <p className="text-sm text-gray-500">Display verified Zil transactions on profile</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">Allow AI Matchmaking</h4>
                    <p className="text-sm text-gray-500">Use my data for better partner recommendations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Data Consent</h4>
                        <p className="text-sm text-gray-700">
                          Your financial data from Zil is used only with your consent to create trust badges and improve matchmaking. 
                          No sensitive data is ever shared publicly.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription & Billing
                </CardTitle>
                <CardDescription>Manage your subscription plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Free Plan</h3>
                        <p className="text-gray-600">Basic features to get started</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Upgrade
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">✓ Basic profile</p>
                      <p className="text-gray-600">✓ Browse marketplace</p>
                      <p className="text-gray-600">✓ Limited connections (10/month)</p>
                      <p className="text-gray-400">✗ AI matchmaking</p>
                      <p className="text-gray-400">✗ Verification badge</p>
                      <p className="text-gray-400">✗ Analytics dashboard</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-2">Basic</h4>
                      <p className="text-3xl font-bold text-gray-900 mb-1">$29<span className="text-lg text-gray-500">/mo</span></p>
                      <Button className="w-full mt-4">Select Plan</Button>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-xl transition-all border-2 border-blue-500">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-2">Premium</h4>
                      <p className="text-3xl font-bold text-gray-900 mb-1">$79<span className="text-lg text-gray-500">/mo</span></p>
                      <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600">Select Plan</Button>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-2">Enterprise</h4>
                      <p className="text-3xl font-bold text-gray-900 mb-1">$199<span className="text-lg text-gray-500">/mo</span></p>
                      <Button className="w-full mt-4">Select Plan</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Integrations
                </CardTitle>
                <CardDescription>Connect with other tools and services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Zil Payment Gateway", description: "Sync transaction history", connected: true },
                  { name: "QuickBooks", description: "Accounting integration", connected: false },
                  { name: "Slack", description: "Collaboration notifications", connected: false },
                  { name: "Google Calendar", description: "Event synchronization", connected: false },
                ].map((integration, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
                    <div>
                      <h4 className="font-medium text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-500">{integration.description}</p>
                    </div>
                    <Button variant={integration.connected ? "outline" : "default"} size="sm">
                      {integration.connected ? "Connected" : "Connect"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}