import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const ADMIN_SESSION_TIMEOUT = 5 * 60 * 1000;

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      const isAdminAuthenticated = localStorage.getItem("admin_authenticated") === "true";
      const loginTimeStr = localStorage.getItem("admin_login_time");

      if (!isAdminAuthenticated || !loginTimeStr) {
        localStorage.removeItem("admin_authenticated");
        localStorage.removeItem("admin_email");
        localStorage.removeItem("admin_login_time");
        navigate("/AdminLogin", { replace: true });
        return;
      }

      const loginTime = parseInt(loginTimeStr, 10);
      const currentTime = Date.now();
      const timeElapsed = currentTime - loginTime;

      if (timeElapsed > ADMIN_SESSION_TIMEOUT) {
        localStorage.removeItem("admin_authenticated");
        localStorage.removeItem("admin_email");
        localStorage.removeItem("admin_login_time");
        navigate("/AdminLogin", { replace: true });
        return;
      }

      setIsChecking(false);
    };

    checkAdminAuth();

    const interval = setInterval(checkAdminAuth, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  const isAdminAuthenticated = localStorage.getItem("admin_authenticated") === "true";
  const loginTimeStr = localStorage.getItem("admin_login_time");

  if (isChecking || !isAdminAuthenticated || !loginTimeStr) {
    return <LoadingScreen />;
  }

  const loginTime = parseInt(loginTimeStr, 10);
  const currentTime = Date.now();
  const timeElapsed = currentTime - loginTime;

  if (timeElapsed > ADMIN_SESSION_TIMEOUT) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

