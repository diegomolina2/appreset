import { useEffect } from "react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to home page when a non-existent URL is accessed
    setLocation("/");
  }, [setLocation]);

  return null;
}
