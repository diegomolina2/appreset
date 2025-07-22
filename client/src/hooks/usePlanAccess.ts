
import { useState, useEffect } from 'react';
import { isAccessExpired, getCurrentPlan, getRemainingDays } from '../utils/planManager';

export const usePlanAccess = () => {
  const [hasAccess, setHasAccess] = useState(!isAccessExpired());
  const [currentPlan, setCurrentPlan] = useState(getCurrentPlan());
  const [remainingDays, setRemainingDays] = useState(getRemainingDays());

  useEffect(() => {
    const checkAccess = () => {
      const expired = isAccessExpired();
      setHasAccess(!expired);
      setCurrentPlan(getCurrentPlan());
      setRemainingDays(getRemainingDays());
    };

    checkAccess();
    const interval = setInterval(checkAccess, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return {
    hasAccess,
    currentPlan,
    remainingDays,
    refreshAccess: () => {
      setHasAccess(!isAccessExpired());
      setCurrentPlan(getCurrentPlan());
      setRemainingDays(getRemainingDays());
    }
  };
};
