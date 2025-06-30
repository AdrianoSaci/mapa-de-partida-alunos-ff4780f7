
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Child {
  name: string;
  dateOfBirth: string;
}

export interface Caregiver {
  name: string;
  email: string;
  whatsapp: string;
}

export interface SkillGroup {
  ageRange: string;
  minScore: number;
  desiredScore: number;
  skills: string[];
}

export interface EvaluationData {
  id?: string;
  caregiver: Caregiver;
  child: Child;
  selectedSkills: Record<string, string[]>;
  scores: Record<string, number>;
  communicationAge: string;
  dataHoraPreenchimento: string;
  createdAt?: string;
}

export interface NotificationPreference {
  userId: string;
  enableReminders: boolean;
  lastEvaluation: string;
}
