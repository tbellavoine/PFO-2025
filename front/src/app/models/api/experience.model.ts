/** Matches back/src/modules/experiences/entities/*.ts's public shape (GET /v1/experiences). */
export interface ExperienceApiModel {
  id: string;
  slug: string;
  company: string;
  role: string;
  periodLabel: string;
  status: string;
  order: number;
  published: boolean;
  achievements: { id: string; text: string; order: number }[];
  skills: {
    id: string;
    skill: { id: string; name: string; slug: string };
    category: { id: string; key: string; label: string; order: number };
  }[];
}
