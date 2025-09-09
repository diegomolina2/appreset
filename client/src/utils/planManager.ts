// Simplified plan manager - no plan restrictions
export interface PlanData {
  planId: number;
  startDate: string;
  expirationDate: string;
  isActive: boolean;
}

export interface Plan {
  id: number;
  name: string;
  duration: number;
  password: string;
  features: string[];
}

// Empty plans array - no plans needed anymore
export const PLANS: Plan[] = [];

// Always return true - no restrictions
export const hasAccessToContent = (content: any): boolean => {
  return true;
};

// Always return false - no access expiration
export const isAccessExpired = (): boolean => {
  return false;
};

// Return null - no current plan needed
export const getCurrentPlan = (): Plan | null => {
  return null;
};

// Return -1 - unlimited access
export const getRemainingDays = (): number => {
  return -1;
};

// Simplified save/load functions (kept for compatibility but not used)
export const savePlanData = (planData: PlanData): void => {
  // No-op - no plan data needed
};

export const loadPlanData = (): PlanData | null => {
  return null;
};

export const activatePlan = (planId: number, password: string): boolean => {
  return true; // Always successful but does nothing
};

export const deactivatePlan = (): void => {
  // No-op - no plan to deactivate
};