import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { AuthForm } from "@/components/AuthForm";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
  };

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  if (!showAuth && !user) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return <Dashboard />;
};

export default Index;
