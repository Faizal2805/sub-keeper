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

  const getBadgeVariant = (status: string) => {
    return status === "Active" ? "default" : "secondary";
  };

  if (showSettings) {
    return <UserSettings user={user} onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen bg-coral-bg">
      {/* Header */}
      <div className="bg-coral p-6 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">SubKeeper</h1>
            <p className="text-coral-light">Manage your subscriptions effortlessly</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm opacity-90">Welcome back,</p>
              <p className="font-semibold">{user.name}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSettings(true)}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-text text-sm font-medium">Total Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-coral">
                {subscriptions.filter(sub => sub.status === "Active").length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-text text-sm font-medium">Monthly Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-coral">
                ${totalMonthlyAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-text text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Upcoming Renewals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {upcomingRenewals}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-4 w-4" />
            <Input
              placeholder="Search subscriptions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {["All", "Active", "Expired"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status as any)}
                className={statusFilter === status ? "bg-coral hover:bg-coral/90" : ""}
              >
                {status}
              </Button>
            ))}
          </div>
          
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-coral hover:bg-coral/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        </div>

        {/* Subscriptions List */}
        <div className="grid gap-4">
          {filteredSubscriptions.map((subscription) => (
            <Card key={subscription.id} className="shadow-soft hover:shadow-coral transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{subscription.serviceName}</h3>
                      <Badge variant={getBadgeVariant(subscription.status)}>
                        {subscription.status}
                      </Badge>
                      {subscription.category && (
                        <span className="text-sm text-gray-text bg-secondary px-2 py-1 rounded">
                          {subscription.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-text">
                      <span className="font-medium text-coral text-lg">
                        ${subscription.amount}/month
                      </span>
                      <span>Next billing: {new Date(subscription.billingDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSubscription(subscription)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSubscription(subscription.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredSubscriptions.length === 0 && (
            <Card className="shadow-soft">
              <CardContent className="p-12 text-center">
                <p className="text-gray-text">No subscriptions found matching your criteria.</p>
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