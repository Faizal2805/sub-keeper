import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Settings, LogOut, Bell } from "lucide-react";
import { SubscriptionForm } from "./SubscriptionForm";
import { UserSettings } from "./UserSettings";
import { toast } from "sonner";

interface Subscription {
  id: string;
  serviceName: string;
  amount: number;
  billingDate: string;
  status: "Active" | "Expired";
  category?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  remindersEnabled: boolean;
}

export const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      serviceName: "Netflix",
      amount: 15.99,
      billingDate: "2024-02-15",
      status: "Active",
      category: "Entertainment"
    },
    {
      id: "2", 
      serviceName: "Spotify",
      amount: 9.99,
      billingDate: "2024-02-10",
      status: "Active",
      category: "Music"
    },
    {
      id: "3",
      serviceName: "Adobe Creative Cloud",
      amount: 52.99,
      billingDate: "2024-01-28",
      status: "Expired",
      category: "Design"
    }
  ]);

  const [user] = useState<User>({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    remindersEnabled: true
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Expired">("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMonthlyAmount = subscriptions
    .filter(sub => sub.status === "Active")
    .reduce((sum, sub) => sum + sub.amount, 0);

  const upcomingRenewals = subscriptions
    .filter(sub => {
      const billingDate = new Date(sub.billingDate);
      const today = new Date();
      const diffTime = billingDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0 && sub.status === "Active";
    }).length;

  // Notification system for expiring subscriptions
  useEffect(() => {
    const checkExpiringSubscriptions = () => {
      const expiringToday = subscriptions.filter(sub => {
        const billingDate = new Date(sub.billingDate);
        const today = new Date();
        const diffTime = billingDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 0 && sub.status === "Active";
      });

      const expiringSoon = subscriptions.filter(sub => {
        const billingDate = new Date(sub.billingDate);
        const today = new Date();
        const diffTime = billingDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 3 && sub.status === "Active";
      });

      if (expiringToday.length > 0) {
        expiringToday.forEach(sub => {
          toast.error(`${sub.serviceName} expires today! Renewing soon: ₹${sub.amount}`, {
            duration: 10000,
          });
        });
      }

      if (expiringSoon.length > 0) {
        expiringSoon.forEach(sub => {
          toast.warning(`${sub.serviceName} expires in 3 days - ₹${sub.amount}`, {
            duration: 8000,
          });
        });
      }
    };

    checkExpiringSubscriptions();
    const interval = setInterval(checkExpiringSubscriptions, 24 * 60 * 60 * 1000); // Check daily
    
    return () => clearInterval(interval);
  }, [subscriptions]);

  const handleAddSubscription = (subscription: Omit<Subscription, "id">) => {
      const newSubscription = {
        ...subscription,
        id: Date.now().toString()
      };
    setSubscriptions([...subscriptions, newSubscription]);
    setShowAddForm(false);
    toast.success("Subscription added successfully!");
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === subscription.id ? subscription : sub
    ));
    setEditingSubscription(null);
    toast.success("Subscription updated successfully!");
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    toast.success("Subscription deleted successfully!");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    // Reset the app state by reloading the page or triggering parent component state reset
    window.location.reload();
  };

  const getBadgeVariant = (status: string) => {
    return status === "Active" ? "default" : "secondary";
  };

  if (showSettings) {
    return <UserSettings user={user} onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen bg-clean-bg">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 shadow-clean border-b">{/* Remove text-white */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">SubMaintaing</h1>
            <p className="text-text-secondary text-sm sm:text-base">Manage your subscriptions effortlessly</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-text-secondary">Welcome back,</p>
              <p className="font-semibold text-text-primary">{user.name}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSettings(true)}
              className="border-orange hover:bg-orange-light/10 hover:text-orange transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span className="ml-2 sm:hidden">Settings</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="border-orange text-orange hover:bg-orange hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 sm:hidden">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="shadow-clean bg-white border hover:shadow-elevated transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-text-secondary text-sm font-medium">Total Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange">
                {subscriptions.filter(sub => sub.status === "Active").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-clean bg-white border hover:shadow-elevated transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-text-secondary text-sm font-medium">Monthly Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange">
                ₹{totalMonthlyAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-clean bg-white border hover:shadow-elevated transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-text-secondary text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Upcoming Renewals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning flex items-center gap-2">
                {upcomingRenewals}
                {upcomingRenewals > 0 && (
                  <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">
                    Soon!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
            <Input
              placeholder="Search subscriptions..."
              className="pl-10 bg-white border focus:border-orange transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            {["All", "Active", "Expired"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status as any)}
                className={`transition-all duration-300 ${
                  statusFilter === status 
                    ? "bg-orange text-white shadow-orange" 
                    : "hover:bg-clean-elevated border-orange text-orange hover:bg-orange/10"
                }`}
              >
                {status}
              </Button>
            ))}
          </div>
          
          <Button 
            onClick={() => setShowAddForm(true)}
            className="whitespace-nowrap bg-orange text-white shadow-orange hover:bg-orange-dark transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        </div>

        {/* Subscriptions List */}
        <div className="grid gap-3 sm:gap-4">
          {filteredSubscriptions.map((subscription) => {
            const billingDate = new Date(subscription.billingDate);
            const today = new Date();
            const diffTime = billingDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isExpiringSoon = diffDays <= 3 && diffDays >= 0 && subscription.status === "Active";
            
            return (
              <Card 
                key={subscription.id} 
                className={`shadow-clean hover:shadow-elevated transition-all duration-300 bg-white border ${
                  isExpiringSoon ? 'ring-2 ring-warning/50' : ''
                }`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-lg font-semibold truncate">{subscription.serviceName}</h3>
                        <Badge 
                          variant={getBadgeVariant(subscription.status)}
                          className={subscription.status === "Active" ? "bg-success text-white" : ""}
                        >
                          {subscription.status}
                        </Badge>
                        {subscription.category && (
                          <span className="text-xs sm:text-sm text-text-secondary bg-clean-elevated px-2 py-1 rounded-md">
                            {subscription.category}
                          </span>
                        )}
                        {isExpiringSoon && (
                          <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full animate-pulse">
                            Expires in {diffDays} day{diffDays !== 1 ? 's' : ''}!
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-text-secondary">
                        <span className="font-medium text-orange text-base sm:text-lg">
                          ₹{subscription.amount}/month
                        </span>
                        <span className="text-xs sm:text-sm">
                          Next billing: {new Date(subscription.billingDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSubscription(subscription)}
                        className="hover:bg-orange/10 hover:text-orange border-orange text-orange transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="ml-2 sm:hidden">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubscription(subscription.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-2 sm:hidden">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredSubscriptions.length === 0 && (
            <Card className="shadow-clean bg-white border">
              <CardContent className="p-8 sm:p-12 text-center">
                <p className="text-text-secondary">No subscriptions found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Subscription Modal */}
      {(showAddForm || editingSubscription) && (
        <SubscriptionForm
          subscription={editingSubscription}
          onSubmit={editingSubscription ? handleEditSubscription : handleAddSubscription}
          onCancel={() => {
            setShowAddForm(false);
            setEditingSubscription(null);
          }}
        />
      )}
    </div>
  );
};