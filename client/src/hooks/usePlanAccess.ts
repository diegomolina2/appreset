import { useState, useEffect } from "react";

// Simplified hook that always grants access
export const usePlanAccess = () => {
  const [isValid, setIsValid] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [remainingDays, setRemainingDays] = useState(-1);

  useEffect(() => {
    // No need to check access - always valid
    setIsValid(true);
    setCurrentPlan(null);
    setRemainingDays(-1);
  }, []);

  // Always return true - no access restrictions
  const hasAccess = (requiredPlans?: number[]): boolean => {
    return true;
  };

  return {
    hasAccess,
    currentPlan,
    remainingDays,
    refreshAccess: () => {
      // No-op - always has access
    },
  };
};