
export interface PlanData {
  planId: number;
  startDate: string;
  expirationDate: string;
  isActive: boolean;
}

export interface Plan {
  id: number;
  name: string;
  duration: number; // dias
  challenges: string[]; // IDs dos desafios permitidos
  features: string[];
  password: string;
}

export const PLANS: Plan[] = [
  {
    id: 1,
    name: 'Plano Básico',
    duration: 15,
    challenges: ['7-day-challenge'],
    features: ['Desafio de 7 dias'],
    password: 'plano1senha'
  },
  {
    id: 2,
    name: 'Plano Intermediário', 
    duration: 45,
    challenges: ['7-day-challenge', '14-day-challenge', '28-day-challenge'],
    features: ['Desafio de 7 dias', 'Desafio de 14 dias', 'Desafio de 28 dias'],
    password: 'plano2senha'
  },
  {
    id: 3,
    name: 'Plano Avançado',
    duration: 120,
    challenges: ['7-day-challenge', '14-day-challenge', '28-day-challenge'],
    features: ['Todos os desafios', 'Funcionalidades premium', 'Relatórios avançados'],
    password: 'plano3senha'
  },
  {
    id: 4,
    name: 'Plano Ilimitado',
    duration: -1, // -1 significa ilimitado
    challenges: ['7-day-challenge', '14-day-challenge', '28-day-challenge'],
    features: ['Acesso ilimitado', 'Todos os recursos', 'Suporte premium'],
    password: 'plano4senha'
  }
];

export const savePlanData = (planData: PlanData): void => {
  try {
    localStorage.setItem('userPlan', JSON.stringify(planData));
  } catch (error) {
    console.error('Failed to save plan data:', error);
  }
};

export const loadPlanData = (): PlanData | null => {
  try {
    const stored = localStorage.getItem('userPlan');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load plan data:', error);
  }
  return null;
};

export const activatePlan = (planId: number, password: string): boolean => {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan || plan.password !== password) {
    return false;
  }

  const startDate = new Date();
  const expirationDate = plan.duration === -1 
    ? new Date(2099, 11, 31) // Data muito distante para plano ilimitado
    : new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

  const planData: PlanData = {
    planId,
    startDate: startDate.toISOString(),
    expirationDate: expirationDate.toISOString(),
    isActive: true
  };

  savePlanData(planData);
  return true;
};

export const isAccessExpired = (): boolean => {
  const planData = loadPlanData();
  if (!planData || !planData.isActive) {
    return true;
  }

  const expirationDate = new Date(planData.expirationDate);
  return new Date() > expirationDate;
};

export const hasAccessToChallenge = (challengeId: string): boolean => {
  const planData = loadPlanData();
  if (!planData || !planData.isActive || isAccessExpired()) {
    return false;
  }

  const plan = PLANS.find(p => p.id === planData.planId);
  if (!plan) {
    return false;
  }

  return plan.challenges.includes(challengeId);
};

export const getCurrentPlan = (): Plan | null => {
  const planData = loadPlanData();
  if (!planData || !planData.isActive) {
    return null;
  }

  return PLANS.find(p => p.id === planData.planId) || null;
};

export const getRemainingDays = (): number => {
  const planData = loadPlanData();
  if (!planData || !planData.isActive) {
    return 0;
  }

  const plan = PLANS.find(p => p.id === planData.planId);
  if (!plan || plan.duration === -1) {
    return -1; // Ilimitado
  }

  const expirationDate = new Date(planData.expirationDate);
  const today = new Date();
  const diffTime = expirationDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

export const deactivatePlan = (): void => {
  localStorage.removeItem('userPlan');
};
