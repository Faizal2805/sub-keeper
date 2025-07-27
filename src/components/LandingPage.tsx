import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Bell, Search, BarChart3, Shield, Smartphone } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    {
      icon: CreditCard,
      title: "Track All Subscriptions",
      description: "Manage Netflix, Spotify, Adobe, and all your subscriptions in one place"
    },
    {
      icon: Bell,
      title: "Smart Reminders", 
      description: "Get notified before renewals so you never miss a payment"
    },
    {
      icon: Search,
      title: "Easy Search & Filter",
      description: "Find subscriptions quickly with powerful search and filtering"
    },
    {
      icon: BarChart3,
      title: "Spending Analytics",
      description: "See exactly how much you're spending on subscriptions monthly"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your subscription data is encrypted and completely secure"
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Access your subscriptions from any device, anywhere"
    }
  ];

  return (
    <div className="min-h-screen bg-coral-bg">
      {/* Hero Section */}
      <div className="bg-coral text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-8">
              <CreditCard className="h-10 w-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Never Miss a <span className="text-yellow-accent">Subscription</span> Again
            </h1>
            <p className="text-xl text-coral-light mb-8 max-w-2xl mx-auto">
              Take control of your recurring payments. Track, manage, and optimize all your subscriptions 
              in one beautiful, intuitive dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-yellow-accent text-foreground hover:bg-yellow-accent/90 text-lg px-8 py-6 h-auto"
              >
                Get Started Free
              </Button>
              <Button 
                variant="coral-outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-coral mb-4">
            Everything You Need to Manage Subscriptions
          </h2>
          <p className="text-xl text-gray-text">
            Powerful features designed to save you time and money
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-soft hover:shadow-coral transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-coral-light rounded-2xl mb-6">
                  <feature.icon className="h-8 w-8 text-coral" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-text">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-coral mb-2">$200+</div>
              <p className="text-gray-text">Average monthly savings</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-coral mb-2">10+</div>
              <p className="text-gray-text">Subscriptions tracked per user</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-coral mb-2">99%</div>
              <p className="text-gray-text">Customer satisfaction rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-coral text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Take Control of Your Subscriptions?
          </h2>
          <p className="text-xl text-coral-light mb-8">
            Join thousands of users who have saved money and time with SubKeeper
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-yellow-accent text-foreground hover:bg-yellow-accent/90 text-lg px-8 py-6 h-auto"
          >
            Start Managing Subscriptions
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-foreground text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CreditCard className="h-6 w-6" />
            <span className="text-xl font-bold">SubKeeper</span>
          </div>
          <p className="text-gray-text">
            © 2024 SubKeeper. All rights reserved. Made with ❤️ for subscription management.
          </p>
        </div>
      </div>
    </div>
  );
};