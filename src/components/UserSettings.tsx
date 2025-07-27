import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Bell, User, Mail } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  remindersEnabled: boolean;
}

interface UserSettingsProps {
  user: User;
  onBack: () => void;
}

export const UserSettings = ({ user, onBack }: UserSettingsProps) => {
  const [userData, setUserData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-coral-bg">
      {/* Header */}
      <div className="bg-coral p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-coral-light">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-coral" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-coral" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="reminders" className="text-base font-medium">
                    Email Reminders
                  </Label>
                  <p className="text-sm text-gray-text">
                    Get notified 2 days before your subscription renewals
                  </p>
                </div>
                <Switch
                  id="reminders"
                  checked={userData.remindersEnabled}
                  onCheckedChange={(checked) => 
                    setUserData({ ...userData, remindersEnabled: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Reminder Schedule */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-coral" />
                Reminder Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-coral-light rounded-lg">
                  <h4 className="font-medium text-coral mb-2">Current Schedule</h4>
                  <ul className="space-y-1 text-sm text-gray-text">
                    <li>• Reminder 7 days before renewal</li>
                    <li>• Reminder 2 days before renewal</li>
                    <li>• Reminder on renewal day</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-text">
                  Reminder schedule is automatically optimized based on your subscription patterns.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-destructive/20 rounded-lg">
                  <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                  <p className="text-sm text-gray-text mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-coral hover:bg-coral/90 text-white min-w-32"
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};