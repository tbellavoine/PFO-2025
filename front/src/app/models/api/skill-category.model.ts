/** Matches GET /v1/skills's response shape (back/src/modules/skills/skills.service.ts's SkillCategoryView). */
export interface SkillCategoryApiModel {
  key: string;
  label: string;
  skills: { name: string; level: string }[];
}
