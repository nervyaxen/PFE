import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
}

export default function ProtectedRoute({ children, requirePremium = false }: ProtectedRouteProps) {
  const { user, premiumUnlocked } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this premium area.",
      });
    } else if (requirePremium && !premiumUnlocked) {
      toast({
        title: "Feature Locked 🔒",
        description: "Unlock all premium systems with a one-time payment.",
      });
    }
  }, [user, premiumUnlocked, requirePremium]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requirePremium && !premiumUnlocked) {
    return <Navigate to="/payment" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
