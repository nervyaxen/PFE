import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FIRST_LAUNCH_KEY = "machrou3i-first-launch-seen";

/** Redirects to the cinematic creator only on the very first app launch (user on "/"). Does not modify any existing storage keys. */
export default function FirstVisitRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/") return;
    try {
      if (window.localStorage.getItem(FIRST_LAUNCH_KEY)) return;
      window.localStorage.setItem(FIRST_LAUNCH_KEY, "1");
      navigate("/library/ai-creator", { replace: true });
    } catch {
      // ignore
    }
  }, [location.pathname, navigate]);

  return null;
}
