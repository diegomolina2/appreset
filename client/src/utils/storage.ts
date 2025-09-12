import { UserData } from "../types";

const USER_DATA_KEY = "user_data";

export const defaultUserData: UserData = {
  userProfile: {
    name: "",
    age: 0,
    height: 0,
    weight: 0,
    targetWeight: 0,
    gender: "other",
    exerciseLevel: "sedentary",
    diet: [],
    language: "en-US",
  },
  favorites: {
    exercises: [],
    meals: [],
    quotes: [],
  },
  weights: [],
  moods: [],
  waterLog: [],
  caloriesLog: [],
  badges: [],
  challenges: {},
};

/**
 * Carrega os dados do usuário do localStorage ou retorna o default.
 */
export function loadUserData(): UserData {
  try {
    // Try to load from the current key first
    let data = localStorage.getItem(USER_DATA_KEY);
    if (data) {
      return JSON.parse(data) as UserData;
    }
    
    // Migration: Try to load from legacy "userData" key and migrate
    data = localStorage.getItem("userData");
    if (data) {
      const userData = JSON.parse(data) as UserData;
      // Migrate to new key
      saveUserData(userData);
      // Remove old key
      localStorage.removeItem("userData");
      return userData;
    }
  } catch (err) {
    console.error("Error loading user data:", err);
  }
  return defaultUserData;
}

/**
 * Salva os dados do usuário no localStorage.
 */
export function saveUserData(data: UserData): void {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Error saving user data:", err);
  }
}

/**
 * Limpa os dados do usuário do localStorage e retorna o estado padrão.
 */
export function clearUserData(): UserData {
  try {
    localStorage.removeItem(USER_DATA_KEY);
  } catch (err) {
    console.error("Error clearing user data:", err);
  }
  return defaultUserData;
}

/**
 * Verifica e desbloqueia badges dependendo de certas condições nos dados do usuário.
 */
export function checkAndUnlockBadges(
  userData: UserData,
  dispatch: React.Dispatch<any>,
): void {
  const unlockedBadges = new Set((userData?.badges ?? []).map((b) => b.id));

  const now = new Date().toISOString();

  const maybeUnlock = (id: string, name: string, description: string) => {
    if (!unlockedBadges.has(id)) {
      dispatch({
        type: "UNLOCK_BADGE",
        payload: id,
      });

      console.log(`Badge unlocked: ${name}`);
    }
  };

  // Exemplo: badge por completar todos os dias de um desafio
  Object.values(userData?.challenges ?? {}).forEach((challenge) => {
    if (
      challenge.isActive &&
      challenge.completedDays.length === challenge.days &&
      !unlockedBadges.has(`challenge-${challenge.id}`)
    ) {
      maybeUnlock(
        `challenge-${challenge.id}`,
        `${challenge.name} Master`,
        `Completed all ${challenge.days} days of ${challenge.name}`,
      );
    }
  });

  // Exemplo: badge por beber 2 litros de água em um dia
  const today = new Date().toISOString().split("T")[0];

  const todayWater = (userData?.waterLog ?? []).find((w) => w.date === today);

  if (
    todayWater &&
    todayWater.liters >= 2 &&
    !unlockedBadges.has("hydration-hero")
  ) {
    maybeUnlock(
      "hydration-hero",
      "Hydration Hero",
      "Drank at least 2 liters of water in one day",
    );
  }

  // Outros badges podem ser adicionados aqui seguindo o mesmo padrão
}

/**
 * Calcula a streak (sequência) atual de dias consecutivos a partir de uma lista de datas ISO (YYYY-MM-DD).
 * Exemplo de uso: getCurrentStreak(challenge.completedDays)
 */
export function getCurrentStreak(dates: string[]): number {
  if (!dates || dates.length === 0) return 0;

  // Ordena as datas do mais recente para o mais antigo
  const sorted = dates
    .map((date) => date.split("T")[0]) // garante só YYYY-MM-DD
    .map((date) => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diffDays = Math.floor(
      (sorted[i - 1].getTime() - sorted[i].getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 1) {
      streak++;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
}

// Removed getUserData and clearUserDataStorage as they used inconsistent storage keys.
// Use loadUserData and clearUserData instead for consistent key usage.

export const getCurrentStreakValue = (): number => {
  const userData = loadUserData();
  return userData.streaks?.current || 0;
};
