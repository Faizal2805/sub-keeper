import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface Subscription {
  id: string;
  serviceName: string;
  amount: number;
  billingDate: string;
  status: "Active" | "Expired";
  category?: string;
}

interface SubscriptionFormProps {
  subscription?: Subscription | null;
  onSubmit: (subscription: Subscription | Omit<Subscription, "id">) => void;
  onCancel: () => void;
}

export const SubscriptionForm = ({ subscription, onSubmit, onCancel }: SubscriptionFormProps) => {
  const [formData, setFormData] = useState({
    serviceName: subscription?.serviceName || "",
    amount: subscription?.amount || 0,
    billingDate: subscription?.billingDate || "",
    status: subscription?.status || "Active" as const,
    category: subscription?.category || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceName || !formData.amount || !formData.billingDate) {
      return;
    }

    if (subscription) {
      onSubmit({ ...subscription, ...formData });
    } else {
      onSubmit(formData);
    }
  };

  const categories = ["Entertainment", "Music", "Software", "Design", "Cloud Storage", "News", "Fitness", "Education", "Other"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-coral">
        <CardHeader className="bg-coral text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle>
              {subscription ? "Edit Subscription" : "Add New Subscription"}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="serviceName">Service Name</Label>
              <Input
                id="serviceName"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                placeholder="e.g., Netflix, Spotify"
                required
              />
            </div>

            <div>
              <Label htmlFor="amount">Monthly Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="billingDate">Next Billing Date</Label>
              <Input
                id="billingDate"
                type="date"
                value={formData.billingDate}
                onChange={(e) => setFormData({ ...formData, billingDate: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as "Active" | "Expired" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-coral hover:bg-coral/90 text-white"
              >
                {subscription ? "Update" : "Add"} Subscription
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};