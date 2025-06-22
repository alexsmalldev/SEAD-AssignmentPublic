// External libraries
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// when changing routes the react router doesn't auto go scroll to top - need to override the redirect
// and force the scroll to the top
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", 
    });
  }, [pathname]);

  return null;
}